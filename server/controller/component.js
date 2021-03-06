const fs = require('fs-extra')
const path = require('path')
const utils = require('./utils')
const lock = require('./lock')
const dayjs = require('dayjs')
const pubPath = path.resolve(__dirname, '../public')
const service = require('./service')

function getPath (type, isIndex = true) {
  return path.join(pubPath, type, isIndex ? 'index.json' : '')
}

const handle = {
  async init () {
    const dirs = ['project', 'compose', 'upload', 'suggest', 'umd', 'utils', 'folder', 'system', 'mock']
    const alls = dirs.map(async dir => {
      const p = getPath(dir)
      if (!fs.pathExistsSync(p)) {
        await fs.outputFile(p, '[]')
      }
    })
    return Promise.all(alls)
  },

  /**
   * 获取组件列表
   * @param type
   */
  list: async (type) => {
    const exist = await fs.pathExists(getPath(type))
    if (type === 'project') {
      const data = await fs.readJSON(getPath(type))
      return data.map(x => ({
        ...x,
        lockedBy: lock.lockMap[x.dir]
      }))
    }
    return exist ? fs.readJSON(getPath(type)) : handle.update(type)
  },

  /**
   * 更新组件列表文件
   * @param type
   * @param scopeCallback
   */
  update: async (type, scopeCallback) => {
    const typeDir = getPath(type, false)
    let dirs = await fs.readdir(typeDir)
    dirs = dirs.filter(x => !/\./.test(x))
    const content = []
    for (let i = 0; i < dirs.length; i++) {
      const data = await fs.readJSON(path.join(typeDir, dirs[i], 'data.json'))
      if (scopeCallback) {
        const v = await scopeCallback(data)
        content.push(v)
      } else {
        const p = `/butterfly/static/${type}/${dirs[i]}`
        content.push({
          ...data,
          jsUrl: data.componentDeps ? undefined : `${p}/index.js`,
          cssUrl: data.existCss ? `${p}/index.css` : undefined
        })
      }
    }

    // 遍历 type 文件夹
    await fs.outputFile(getPath(type), JSON.stringify(content))
    return content
  },

  async delete (type, dir) {
    utils.rm(path.join(pubPath, type, dir))
    if (type === 'project') {
      await handle.removeFolderProjects(dir, true)
      await handle.updateProjectList()
    } else {
      await handle.update(type)
    }
  },

  /**
   * 新增封装组件
   * @param type
   * @param data
   * @returns {Promise<boolean>}
   */
  export: async (type, data) => {
    const force = data.force
    data.force = undefined
    const _do = async () => {
      data.title = data.title || data.node.title
      await fs.outputJSON(path.join(getPath(type, false), data.name, 'data.json'), data)
      await handle.update(type)
    }

    // 检查名称是否存在
    const arr = await fs.readJSON(getPath(type))
    const item = arr.find(x => x.name === data.name)
    if (item) {
      const isAuthor = data.userName === item.userName
      if (isAuthor) {
        if (force) {
          return _do()
        }
        return { code: 60001, msg: '组件已存在，是否覆盖？' }
      }
      return { msg: '组件名称已被占用，换个试试吧' }
    }
    return _do()
  },

  /**
   * 上传自定义组件
   * @param file
   * @param tmpPath
   * @returns {Promise<string>}
   */
  uploadComponent: async (file, tmpPath, body) => {
    // const force = body.force
    // 解压到 tmp/data 目录下
    // console.log('----', file)
    await utils.unzip(file, tmpPath)
    // 读取 package.json name 校验唯一性
    const pkg = path.join(tmpPath, 'package.json')
    const schemaPath = path.join(tmpPath, 'schema.js')
    if (!fs.pathExistsSync(pkg)) {
      utils.rm(tmpPath)
      return 'package.json 不存在'
    }
    const pkgContent = await fs.readFile(pkg, 'utf8')
    const { name, main, title, cover, version } = JSON.parse(pkgContent)
    const upPath = getPath('upload')
    const basicPath = getPath('basic')
    let existItem = false
    if (fs.pathExistsSync(upPath)) {
      const arr = await fs.readFile(upPath)
      existItem = JSON.parse(arr).find(x => x.name === `bf-${name}`)
    }
    if (!existItem && fs.pathExistsSync(basicPath)) {
      const arr = await fs.readFile(basicPath)
      existItem = JSON.parse(arr).find(x => x.name === `bf-${name}`)
    }
    if (existItem) {
      const isAuthor = existItem.userName === body.userName
      if (!isAuthor) {
        utils.rm(tmpPath)
        return '组件名称已存在，换个试试吧'
      }
      // if (!force) {
      //   utils.rm(tmpPath)
      //   return 60001
      // }
    }
    if (!fs.pathExistsSync(schemaPath)) {
      utils.rm(tmpPath)
      return 'schema.js 不存在'
    }
    const schema = await fs.readFile(schemaPath, 'utf8')
    // 创建入口文件格式
    const entryContent = fs.readFileSync(path.join(pubPath, 'upload-entry-template.tpl'), 'utf8')
      .replace('{{entryVue}}', main)
      .replace('{{props}}', pkgContent)
      .replace('{{schema}}', schema.replace('module.exports = ', ''))
    const entryPath = path.join(tmpPath, 'entry.js')
    await fs.outputFile(entryPath, entryContent)
    // console.log('---- entryPath', entryPath, entryContent)
    await utils.webpack(name, entryPath)
    // console.log('---- webpack done')
    // 将 zip 包 copy 到目标目录
    await fs.copy(file, path.join(pubPath, 'upload', name, `${name}.zip`), { overwrite: true })
    const dataPath = path.join(pubPath, 'upload', name, 'data.json')
    const dataJson = await fs.readJSON(dataPath)
    dataJson.title = title
    dataJson.cover = cover
    dataJson.version = version
    dataJson.userName = body.userName
    await fs.writeJson(dataPath, dataJson)
    await handle.update('upload')
    utils.rm(tmpPath)
  },

  uploadComposeComponent: async (file, tmpPath) => {
    let msg = ''
    const c = await fs.readFile(file, 'utf8')
    const data = JSON.parse(c)
    await handle.export('compose', { ...data, force: true })
    utils.rm(tmpPath)
    return msg
  },

  async readJsonStorage (filePath, clear) {
    let content
    if (clear) {
      content = undefined
      return
    }
    if (content) {
      return content
    }
    const read = async () => {
      content = await fs.readJSON(filePath)
      return content
    }
    return read()
  },

  updateProjectList: async (projectInfo) => {
    await handle.update('project', async ({ project }) => {
      const data = {
        thumbCover: project.thumbCover,
        dir: project.dir,
        desc: project.desc,
        info: project.info,
        createUser: project.createUser,
        url: project.url,
        folder: project.folder || '',
        versionId: project.versionId || ''
      }
      if (projectInfo && projectInfo.dir === project.dir) {
        data.info = projectInfo.info
      }
      if (project.folder) {
        // 更新到 folder
        await handle.addFolderProjects(project.folder, project.dir)
      } else {
        // 检查移除
        await handle.removeFolderProjects(project.dir)
      }
      return data
    })
    await handle.readJsonStorage(null, true)
  },

  saveProject: async (dir, data) => {
    const exist = fs.pathExistsSync(path.join(pubPath, 'project', dir))
    if (!data.force && exist) {
      // 检查是否已存在
      return { success: false, msg: `项目 ${dir} 名称已存在`, code: 6001 }
    } else {
      const dataPath = path.join(pubPath, 'project', dir, 'data.json')
      if (exist) {
        // const oldData = await fs.readJSON(dataPath)
        // info.remark
        // data.project.info.remark = oldData.project.info.remark
        delete data.force
      }
      if (!data.project.createUser) {
        // 初次创建保存创建人
        data.project.createUser = data.project.info.userName
      }
      if (data.doLock !== false) {
        await lock.lock(dir, data.project.info.userName)
      }
      await fs.outputFile(dataPath, JSON.stringify(data))
      await handle.updateProjectList()
    }
  },

  lockProject: async (dir, userName, isLock) => {
    if (isLock) {
      await lock.lock(dir, userName)
    } else {
      await lock.unlock(dir)
    }
    // await handle.updateProjectList()
  },

  getLock (dir) {
    return lock.lockMap[dir]
  },

  getProject: (dir) => {
    return fs.readJson(path.join(pubPath, 'project', dir, 'data.json'))
  },

  releaseProject: async (dir, body) => {
    const releasePath = path.resolve(__dirname, '../../release', dir)
    const distPath = path.resolve(__dirname, '../../dist-system')
    const dataPath = path.join(pubPath, 'project', dir, 'data.json')
    const recordPath = path.join(pubPath, 'project', dir, 'record.json')
    const globalProject = await fs.readJson(dataPath)
    const isDev = process.env.APP_ENV === 'dev'
    const isXmmp = globalProject.project.interactiveType === 'xmmp'

    // 更新列表操作记录
    // globalProject.project.info = body.info
    // await fs.writeJson(dataPath, globalProject)
    await handle.updateProjectList({ dir, info: body.info })
    // 更新操作记录文件
    await fs.ensureFile(recordPath)
    const records = await fs.readJson(recordPath).catch(() => [])
    records.unshift(body.info)
    await fs.writeJson(recordPath, records)

    // 先清空目标文件夹
    utils.rm(releasePath)
    // copy dist-system/ => release/项目 目录下
    const manifest = await fs.readJson(path.join(distPath, 'manifest.json'))
    const _copyVendors = async (type) => {
      const distType = path.join(distPath, type)
      const dirs = await fs.readdir(distType)
      return dirs.map(name => {
        if (
          /render|chunk-vendors/.test(name) &&
          manifest[type].some(x => x === name)
        ) {
          return fs.copy(path.join(distType, name), path.join(releasePath, type, name))
        }
      }).filter(Boolean)
    }
    const preCopyFiles = [
      fs.copy(dataPath, path.join(releasePath, 'data.json')),
      fs.copy(path.join(distPath, 'render.html'), path.join(releasePath, 'index.html')),
      fs.copy(path.join(distPath, 'vue2.6'), path.join(releasePath, 'vue2.6'))
    ]
      .concat(_copyVendors('js'))
      .concat(_copyVendors('css'))
    await Promise.all(preCopyFiles)

    // 将其它发布环境平铺出来
    if (globalProject.project.config.proArr && globalProject.project.config.proArr.length) {
      globalProject.project.config.proArr.forEach(it => {
        globalProject.project.config[it.name] = it.kv
      })
    }
    // 编译 code
    console.log('编译 code')
    globalProject.project = await utils.babel(globalProject.project)
    // 改写 index.html 中的 publicPath
    const releaseHtmlPath = path.join(releasePath, 'index.html')
    const publicPath = globalProject.project.config[globalProject.project.env].publicPath || ''
    let renderContent = await fs.readFile(releaseHtmlPath, 'utf8')
    renderContent = renderContent
      // 插入 data 引入 window.globalProject
      .replace(
        '</head>',
        `<script>/* ${dayjs().format('YYYY/MM/DD HH:mm')} */ var globalProject = %%%%</script></head>`
      )
    // 正则匹配中 $$ 是关键词，必须绕开
    renderContent = renderContent.split('%%%%')

    let projectString = JSON.stringify(globalProject)
    // 下载图片到本地
    // 并改写路径
    if (globalProject.project.config.downImgToLocal) {
      console.log('下载图片到本地')
      projectString = await utils.downImgAndReplace(projectString, releasePath).catch(() => {
        return Promise.reject(new Error('下载项目图片到本地失败，请重试'))
      })
    }

    renderContent = renderContent[0] + projectString + renderContent[1]

    // 处理 umd 组件
    if (globalProject.project.componentUmd) {
      const needDownload = []
      const cdn = []
      globalProject.project.componentUmd.forEach(it => {
        if (it.type !== 'css' && it.isReleaseDownload) {
          needDownload.push(it)
        } else {
          cdn.push(it)
        }
      })
      let cdnScript = ''
      let cdnCss = ''
      cdn.forEach(it => {
        if (it.type === 'css') {
          cdnCss += `<link rel="stylesheet" href="${it.url}">`
        } else {
          cdnScript += `<script src="${it.url}"></script>`
        }
      })
      if (cdnCss) {
        renderContent = renderContent.replace('</head>', cdnCss + '</head>')
      }
      if (cdnScript) {
        renderContent = renderContent.replace('</body>', cdnScript + '</body>')
      }
      if (needDownload.length) {
        console.log(`下载 componentUmd 到本地，共 ${needDownload.length} 个`)
        const umdFileName = isDev
          ? 'umd.js'
          : `umd.${dayjs().format('MMDDHHmmss')}.js`
        const arr = await Promise.all(needDownload.map(it => service.getRemoteFileContent(it.url))).catch((err) => {
          console.log(`下载失败`, err.message)
          return Promise.reject(err)
        })
        await fs.outputFile(path.join(releasePath, umdFileName), arr.join('\n'), 'utf8')
        renderContent = renderContent.replace(
          '</body>',
          `<script src="${publicPath + umdFileName}"></script></body>`
        )
      }
    }

    // 将组件 js 合并生成文件
    let jsContent = ''
    // 去重
    const componentDeps = []
    globalProject.project.componentDownload.forEach(it => {
      if (componentDeps.every(x => x.name !== it.name)) {
        componentDeps.push(it)
      }
    })
    for (let i = 0; i < componentDeps.length; i++) {
      const item = componentDeps[i]
      const c = await fs.readFile(path.join(pubPath, item.jsUrl.replace('/butterfly/static', '')))
      jsContent += `${c}\n`
    }
    if (jsContent) {
      const componentMergeFileName = isDev
        ? 'component.js'
        : `component.${dayjs().format('MMDDHHmmss')}.js`
      await fs.outputFile(path.join(releasePath, componentMergeFileName), jsContent, 'utf8')
      renderContent = renderContent.replace(
        '</body>',
        `<script src="${publicPath + componentMergeFileName}"></script></body>`
      )
    }

    const { form, vant } = globalProject.project.componentLibrary
    const hasLibraryForm = form && form.length
    const hasLibraryVant = vant && vant.length
    if (hasLibraryForm) {
      await fs.copy(path.join(distPath, 'vant-form'), path.join(releasePath, 'vant-form'))
    } else {
      // 清除引用
      renderContent = renderContent
        .replace(`<script>Vue.component('vantForm', vantForm.default)</script>`, '')
        .replace(`<script src=vant-form/vantForm.umd.min.js></script>`, '')
        .replace(`<link rel=stylesheet href=vant-form/vantForm.css>`, '')
    }
    if (hasLibraryVant) {
      await fs.copy(path.join(distPath, 'vant2.5'), path.join(releasePath, 'vant2.5'))
    } else {
      // 清除引用
      renderContent = renderContent
        .replace(`<link rel=stylesheet href=vant2.5/index.css>`, '')
        .replace(`<script src=vant2.5/index.min.js></script>`, '')
    }
    // 去除 cdn 外网无法访问
    // if (!globalProject.project.syncFile) {
    //   renderContent = renderContent
    //     .replace('<script src=//statics-china.uban360.com/config/app.js></script>', '')
    // }
    if (isXmmp) {
      await fs.copy(path.join(distPath, 'xmmp'), path.join(releasePath, 'xmmp'))
      renderContent = renderContent
        .replace('</head>', `<script id="J_20000" src=shinemosdk://20000/index.js></script></head>`)
      // 内置 sdklist
      if (globalProject.project.config.sdklist) {
        globalProject.project.config.sdklist.sort().forEach(id => {
          renderContent = renderContent
            .replace('</head>', `<link id="C_${id}" rel="stylesheet" href=shinemosdk://${id}/index.css></head>`)
            .replace('</head>', `<script id="J_${id}" src=shinemosdk://${id}/index.js></script></head>`)
        })
      }
    } else {
      await fs.copy(path.join(distPath, 'native'), path.join(releasePath, 'native'))
      renderContent = renderContent
        .replace('</head>', `<script src=native/native.js></script></head>`)
    }
    if (globalProject.project.config.openConsole) {
      await fs.copy(path.join(distPath, 'vconsole'), path.join(releasePath, 'vconsole'))
      renderContent = renderContent
        .replace('</head>', `<script src=vconsole/index.js></script></head>`)
    }

    // href=css href=js src=js
    // 替换 publicPath
    renderContent = renderContent.replace('_PUBLIC_PATH=\'./\'', `_PUBLIC_PATH='${publicPath}'`)
    renderContent = renderContent.replace(/(href="?css|href="?js|href="?v|src="?js|src="?v|src="?x|src="?n)/g, (match, group) => {
      const arr = group.split('=')
      return arr[0] + '=' + publicPath + arr[1]
    })

    // H5 中的 app config，分享功能有依赖
    // 如果是 彩云，则手动替换
    // 因为彩云 nginx 没有处理
    if (globalProject.project.syncFile) {
      const appJs = globalProject.project.config.appType === 1
        ? '//statics.jituancaiyun.com/config/app.js'
        : '//statics-china.uban360.com/config/app.js'
      renderContent = renderContent
        .replace('</head>', `<script src=${appJs}></script></head>`)
    }

    // 写文件
    await fs.outputFile(path.join(releasePath, 'index.html'), renderContent)
    console.log('文件写入成功')

    // 写入 plugin.json
    const projectColor = globalProject.project.config.navColor
    if (isXmmp && projectColor) {
      await fs.outputFile(path.join(releasePath, 'plugin.json'), JSON.stringify({
        color: projectColor,
        indexURL: 'index.html?navibar=h5&navibarColor=' + projectColor.substr(1)
      }))
      console.log('plugin.json 写入成功')
    }

    if (globalProject.project.syncFile) {
      console.log('开始同步文件')
      return service.syncFile(globalProject.project)
    }
    // 同步 IOC
    if (globalProject.project.config.iocSync) {
      console.log('开始同步 IOC')
      return service.syncIoc(globalProject.project)
    }
  },

  async uploadProject (file, tmpPath) {
    const projectList = await handle.list('project')
    const data = await fs.readJson(file)
    if (projectList.some(x => x.dir === data.project.dir)) {
      return '项目已存在'
    }
    data.project.folder = ''
    await fs.writeJson(file, data)
    await fs.move(
      file,
      path.join(getPath('project', false), data.project.dir, 'data.json')
    )
    await handle.updateProjectList()
    utils.rm(tmpPath)
  },

  async syncProject (file, tmpPath) {
    // 解压 zip
    await utils.unzip(file, tmpPath)
    // 读取 folder
    const folder = await fs.readJson(path.join(tmpPath, 'folder', 'index.json'))
    // 检查项目是否存在
    const localProjects = await fs.readJson(getPath('project'))
    const isExist = folder[0].projects.findIndex(y => localProjects.some(x => y === x.dir))
    if (isExist > -1) {
      return `导入的项目列表中存在相同的项目: ${folder[0].projects[isExist]}`
    }
    const p = getPath('project', false)
    // 备份 project 到 public 目录
    const bakProjectPath = path.join(pubPath, 'bak-project')
    await fs.copy(p, bakProjectPath, { overwrite: true })
    console.log('备份 project 到 public/bak-project')
    let msg
    await Promise.all(
      folder[0].projects.map(project => {
        // copy 到 projects 目录
        return fs.move(
          path.join(tmpPath, 'project', project),
          path.join(p, project),
          { overwrite: true }
        )
      })
    ).catch(async err => {
      msg = `执行出错：${err.message}`
      console.log('执行出错，还原备份 bak-project 到 project')
      await fs.copy(bakProjectPath, p, { overwrite: true })
      await handle.updateProjectList()
    })
    if (!msg) {
      // 更新项目列表
      await handle.updateProjectList()
    }
    // 删除备份
    utils.rm(bakProjectPath)
    console.log('删除备份 public/bak-project')
    // 删除 tmp
    utils.rm(tmpPath)
    return msg
  },

  async saveSuggest (data) {
    const p = getPath('suggest')
    const exist = fs.pathExistsSync(p)
    const list = exist ? await fs.readJson(p) : []
    if (!exist) {
      fs.ensureFileSync(p)
    }
    const isEdit = data.id
    if (isEdit !== undefined) {
      const i = list.findIndex(x => x.id === isEdit)
      if (i > -1) {
        list.splice(i, 1, data)
        return fs.writeJson(p, list)
      }
    }
    list.push({
      ...data,
      id: list.length + 1,
      time: Date.now()
    })
    return fs.writeJson(p, list)
  },

  async getSuggest () {
    const p = getPath('suggest')
    const exist = fs.pathExistsSync(p)
    return exist ? fs.readJson(p) : []
  },

  async saveList (data, type) {
    const index = getPath(type)
    const list = await fs.readJson(index)
    if (data.id) {
      // 编辑
      const i = list.findIndex(x => x.id === data.id)
      if (data.delete) {
        list.splice(i, 1)
      } else {
        list.splice(i, 1, data)
      }
    } else {
      // 新增
      list.push({
        ...data,
        id: Date.now()
      })
    }
    await fs.writeJson(index, list)
  },

  async saveFolder ({ name, user, id }) {
    const index = getPath('folder')
    const list = await fs.readJson(index)
    let item
    if (id) {
      item = list.find(x => x.id === id)
      item.name = name
      item.time = Date.now()
    } else {
      item = list.find(x => x.name === name)
      if (item) {
        return '文件夹已存在'
      }
      list.unshift({
        user,
        name,
        id: `${user.uid}_${Date.now()}`,
        projects: [],
        time: Date.now()
      })
    }
    await fs.writeJson(index, list)
  },

  async getFolder (id) {
    const index = getPath('folder')
    const list = await fs.readJson(index)
    const item = list.find(x => x.id === id)
    if (!item) {
      return '该文件夹不存在'
    }
    return item
  },

  async listFolder () {
    const index = getPath('folder')
    return fs.readJson(index)
  },

  async deleteFolder ({ id }) {
    const index = getPath('folder')
    const list = await fs.readJson(index)
    const i = list.findIndex(x => x.id === id)
    if (list[i].projects.length) {
      return '请先移除文件夹下的项目'
    }
    list.splice(i, 1)
    await fs.writeJson(index, list)
  },

  async getCombindList ({ folderId, dirs }) {
    const folder = getPath('folder')
    const project = getPath('project')
    if (folderId) {
      if (!dirs) {
        return []
      }
      dirs = dirs.split(',')
      const projects = await fs.readJson(project)
      const res = []
      let num = 0
      while (dirs.length && num < 1000) {
        num++
        const cur = dirs.pop()
        const item = projects.find(x => x.dir === cur)
        if (item) {
          res.push(item)
        } else {
          console.log(`${cur} 在项目列表中未找到，移除`)
          process.nextTick(() => {
            handle.removeFolderProjects(cur, true)
          })
        }
      }
      return res.map(x => ({
        ...x,
        lockedBy: lock.lockMap[x.dir]
      })).sort((a, b) => b.info.time - a.info.time)
    }
    const [folders, projects] = await Promise.all([fs.readJson(folder), fs.readJson(project)])
    // 取出未归类的项目
    return folders
      .sort((a, b) => b.time - a.time)
      .concat(
        projects.filter(x => !x.folder || folders.every(it => it.id !== x.folder))
          .sort((a, b) => b.info.time - a.info.time)
          .map(x => ({
            ...x,
            lockedBy: lock.lockMap[x.dir]
          }))
      )
  },

  async addFolderProjects (folderId, dir) {
    const index = getPath('folder')
    const list = await handle.readJsonStorage(index)
    // 去除 dir 原来的 folderId
    let oldIndex = -1
    const oldFolder = list.find(x => {
      oldIndex = x.projects.findIndex(y => y === dir)
      return oldIndex !== -1
    })
    if (oldFolder) {
      oldFolder.projects.splice(oldIndex, 1)
    }
    // 修改为新的 folderId
    const folder = list.find(x => x.id === folderId)
    const dirIndex = folder ? folder.projects.findIndex(x => x === dir) : -2
    if (dirIndex === -1) {
      folder.projects.push(dir)
      await fs.writeJson(index, list)
    }
  },

  async removeFolderProjects (dir, removeStorage) {
    const index = getPath('folder')
    const list = await handle.readJsonStorage(index)
    let i = -1
    const folder = list.find(x => {
      i = x.projects.findIndex(y => y === dir)
      return i !== -1
    })
    if (folder) {
      folder.projects.splice(i, 1)
      await fs.writeJson(index, list)
    }
    // 去除存储
    if (removeStorage) {
      await handle.readJsonStorage(index, true)
    }
  },

  async searchProject ({ keyword, field }) {
    const project = getPath('project')
    const projects = await fs.readJson(project)
    const isDir = field === 'dir'
    return projects.map(x => {
      if (new RegExp(keyword, 'i').test(x[field])) {
        return {
          ...x,
          [isDir ? 'dirSearch' : field]: x[field].replace(keyword, `<span class="c-main">${keyword}</span>`),
          lockedBy: lock.lockMap[x.dir]
        }
      }
    }).filter(Boolean).sort((a, b) => b.info.time - a.info.time)
  },

  async listVersion ({ dir }) {
    const versionIndex = path.join(getPath('project', false), dir, 'version', 'index.json')
    await fs.ensureFile(versionIndex)
    return fs.readJSON(versionIndex).catch(() => [])
  },

  /**
   * 添加版本
   * 按照当前的 data.json 去添加
   */
  async addVersion ({ name, dir }) {
    const getVersionPath = str => path.join(getPath('project', false), dir, 'version', str)
    const dataJson = path.join(getPath('project', false), dir, 'data.json')
    const newVersion = {
      id: `${Date.now()}_${String(Math.random()).replace('0.', '')}`,
      name,
      time: Date.now()
    }
    // 创建版本
    const newVersionPath = getVersionPath(`${newVersion.id}.json`)
    const project = await fs.readJson(dataJson)
    project.project.versionId = newVersion.id
    await fs.outputJson(newVersionPath, project)
    // 更新列表
    const indexPath = getVersionPath('index.json')
    const indexData = await fs.readJson(indexPath).catch(() => [])
    indexData.push(newVersion)
    return fs.writeJson(indexPath, indexData)
  },

  async deleteVersion ({ id, dir }) {
    const getVersionPath = str => path.join(getPath('project', false), dir, 'version', str)
    // 校验当前 data.json 是否为该版本
    // 如果是则提示不能删除
    const dataJson = path.join(getPath('project', false), dir, 'data.json')
    const project = await fs.readJson(dataJson)
    if (project.project.versionId === id) {
      return '该版本为当前版本，不能被删除'
    }

    // 删除文件
    utils.rm(getVersionPath(`${id}.json`))
    // 更新列表
    const indexPath = getVersionPath('index.json')
    const indexData = await fs.readJson(indexPath).catch(() => [])
    const index = indexData.findIndex(x => x.id === id)
    indexData.splice(index, 1)
    fs.writeJson(indexPath, indexData)
  },

  /**
   * 切换到某个版本
   */
  async switchVersion ({ id, dir }) {
    const getVersionPath = str => path.join(getPath('project', false), dir, 'version', str)
    const versionPath = getVersionPath(`${id}.json`)
    if (!fs.pathExistsSync(versionPath)) {
      return '当前版本不存在'
    }
    // 保存当前 data.json 到版本中
    const dataJson = path.join(getPath('project', false), dir, 'data.json')
    const project = await fs.readJson(dataJson)
    const versionId = project.project.versionId
    if (versionId) {
      const dataVersionPath = getVersionPath(`${versionId}.json`)
      if (fs.pathExistsSync(dataVersionPath)) {
        await fs.writeJson(dataVersionPath, project)
      } else {
        await fs.outputJson(dataVersionPath, project)
      }
    } else {
      // 创建新版本
      await handle.addVersion({ name: 'butterfly-main', dir })
    }
    // 切换当前 data.json
    const curVersionData = await fs.readJson(versionPath)
    fs.writeJson(dataJson, curVersionData)
    // 更新项目列表
    await handle.updateProjectList()
  }
}

module.exports = handle
