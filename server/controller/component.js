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
    const project = getPath('project')
    const compose = getPath('compose')
    const upload = getPath('upload')
    const suggest = getPath('suggest')
    const umd = getPath('umd')
    const utils = getPath('utils')
    if (!fs.pathExistsSync(project)) {
      await fs.outputFile(project, '[]')
    }
    if (!fs.pathExistsSync(upload)) {
      await fs.outputFile(upload, '[]')
    }
    if (!fs.pathExistsSync(compose)) {
      await fs.outputFile(compose, '[]')
    }
    if (!fs.pathExistsSync(suggest)) {
      await fs.outputFile(suggest, '[]')
    }
    if (!fs.pathExistsSync(umd)) {
      await fs.outputFile(umd, '[]')
    }
    if (!fs.pathExistsSync(utils)) {
      await fs.outputFile(utils, '[]')
    }
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
        content.push(scopeCallback(data))
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
    utils.unzip(file, tmpPath)
    // 读取 package.json name 校验唯一性
    const pkg = path.join(tmpPath, 'package.json')
    const schemaPath = path.join(tmpPath, 'schema.js')
    if (!fs.pathExistsSync(pkg)) {
      utils.rm(tmpPath)
      return 'package.json 不存在'
    }
    const pkgContent = await fs.readJSON(pkg)
    const { name, main } = pkgContent
    // name = `bf-${name}`
    // console.log('----', name, main)
    const upPath = getPath('upload')
    const basicPath = getPath('basic')
    let existItem = false
    if (fs.pathExistsSync(upPath)) {
      const arr = await fs.readJSON(upPath)
      existItem = arr.find(x => x.name === `bf-${name}`)
    }
    if (!existItem && fs.pathExistsSync(basicPath)) {
      const arr = await fs.readJSON(basicPath)
      existItem = arr.find(x => x.name === `bf-${name}`)
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
    const schema = require(schemaPath)
    // 创建入口文件格式
    const entryContent = fs.readFileSync(path.join(pubPath, 'upload-entry-template.tpl'), 'utf8')
      .replace('{{entryVue}}', main)
      .replace('{{props}}', JSON.stringify(pkgContent))
      .replace('{{schema}}', JSON.stringify(schema))
    const entryPath = path.join(tmpPath, 'entry.js')
    await fs.outputFile(entryPath, entryContent)
    // console.log('---- entryPath', entryPath, entryContent)
    await utils.webpack(name, entryPath)
    // console.log('---- webpack done')
    // 将 zip 包 copy 到目标目录
    await fs.copy(file, path.join(pubPath, 'upload', name, `${name}.zip`), { overwrite: true })
    const dataPath = path.join(pubPath, 'upload', name, 'data.json')
    const dataJson = await fs.readJSON(dataPath)
    dataJson.title = pkgContent.title
    dataJson.cover = pkgContent.cover
    dataJson.version = pkgContent.version
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
  updateProjectList: async () => {
    await handle.update('project', ({ project }) => {
      return {
        thumbCover: project.thumbCover,
        dir: project.dir,
        desc: project.desc,
        info: project.info,
        createUser: project.createUser,
        url: project.url
      }
    })
  },
  saveProject: async (dir, data) => {
    const exist = fs.pathExistsSync(path.join(pubPath, 'project', dir))
    if (!data.force && exist) {
      // 检查是否已存在
      return { success: false, msg: `项目 ${dir} 名称已存在`, code: 6001 }
    } else {
      const dataPath = path.join(pubPath, 'project', dir, 'data.json')
      if (exist) {
        const oldData = await fs.readJSON(dataPath)
        // info.remark
        data.project.info.remark = oldData.project.info.remark
        delete data.force
      }
      if (!data.project.createUser) {
        // 初次创建保存创建人
        data.project.createUser = data.project.info.userName
      }
      await fs.outputFile(dataPath, JSON.stringify(data))
      await handle.updateProjectList()
      await lock.lock(dir, data.project.info.userName)
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
    const globalProject = await fs.readJson(dataPath)
    const isDev = process.env.APP_ENV === 'dev'
    const isXmmp = globalProject.project.interactiveType === 'xmmp'

    // 改写 data.json
    globalProject.project.info = body.info
    await fs.writeJson(dataPath, globalProject)
    await handle.updateProjectList()

    // 先清空目标文件夹
    utils.rm(releasePath)
    // copy dist-system/ => release/项目 目录下
    const manifest = await fs.readJson(path.join(distPath, 'manifest.json'))
    await fs.copy(dataPath, path.join(releasePath, 'data.json'))
    await fs.copy(path.join(distPath, 'render.html'), path.join(releasePath, 'index.html'))
    await fs.copy(path.join(distPath, 'vue2.6'), path.join(releasePath, 'vue2.6'))
    // await fs.copy(path.join(distPath, 'vant2.5'), path.join(releasePath, 'vant2.5'))
    fs.readdirSync(path.join(distPath, 'js')).forEach(name => {
      if (
        /render|chunk-vendors/.test(name) &&
        manifest.js.some(x => x === name)
      ) {
        fs.copySync(path.join(distPath, 'js', name), path.join(releasePath, 'js', name))
      }
    })
    fs.readdirSync(path.join(distPath, 'css')).forEach(name => {
      if (
        /render|chunk-vendors/.test(name) &&
        manifest.css.some(x => x === name)
      ) {
        fs.copySync(path.join(distPath, 'css', name), path.join(releasePath, 'css', name))
      }
    })

    // 切换为正式环境
    // globalProject.project.env = 'pro'
    // 将其它发布环境平铺出来
    if (globalProject.project.config.proArr && globalProject.project.config.proArr.length) {
      globalProject.project.config.proArr.forEach(it => {
        globalProject.project.config[it.name] = it.kv
      })
    }
    // 编译 code
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
    renderContent = renderContent[0] + JSON.stringify(globalProject) + renderContent[1]

    // 处理 umd 组件
    if (globalProject.project.componentUmd) {
      const needDownload = []
      const cdn = []
      globalProject.project.componentUmd.forEach(it => {
        if (it.isReleaseDownload) {
          needDownload.push(it)
        } else {
          cdn.push(it)
        }
      })
      let cdnScript = ''
      cdn.forEach(it => {
        cdnScript += `<script src="${it.url}"></script>`
      })
      if (cdnScript) {
        renderContent = renderContent.replace('</body>', cdnScript + '</body>')
      }
      if (needDownload.length) {
        const umdFileName = isDev
          ? 'umd.js'
          : `umd.${dayjs().format('MMDDHHmmss')}.js`
        const arr = await Promise.all(needDownload.map(it => service.getRemoteFileContent(it.url)))
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
    if (!globalProject.project.syncFile) {
      renderContent = renderContent
        .replace('<script src=https://statics-china.uban360.com/config/app.js></script>', '')
    }
    if (isXmmp) {
      await fs.copy(path.join(distPath, 'xmmp'), path.join(releasePath, 'xmmp'))
      renderContent = renderContent
        .replace('</head>', `<script src=xmmp/xmmp.min.js></script></head>`)
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
    renderContent = renderContent.replace(/(href=css|href=js|href=v|src=js|src=v|src=x|src=n)/g, (match, group) => {
      const arr = group.split('=')
      return arr[0] + '=' + publicPath + arr[1]
    })

    // 如果是 彩云，则手动替换 https://statics-china.uban360.com/config/app.js
    // 因为彩云 nginx 没有处理
    if (globalProject.project.syncFile && globalProject.project.config.appType === 1) {
      renderContent = renderContent.replace(
        'https://statics-china.uban360.com/config/app.js',
        'https://statics.jituancaiyun.com/config/app.js'
      )
    }

    // 写文件
    await fs.outputFile(path.join(releasePath, 'index.html'), renderContent)

    // 检查 zip 是否存在，因为 download 生成 zip 时如果存在会报错
    const zipPath = path.join(releasePath, `${dir}.zip`)
    if (fs.pathExistsSync(zipPath)) {
      utils.rm(zipPath)
    }
    if (globalProject.project.syncFile) {
      // 非小程序 同步机器文件
      return service.syncFile(globalProject.project)
    }
  },
  async uploadProject (file, tmpPath) {
    const projectList = await handle.list('project')
    const data = await fs.readJson(file)
    if (projectList.some(x => x.dir === data.project.dir)) {
      return '项目已存在'
    }
    await fs.move(
      file,
      path.join(getPath('project', false), data.project.dir, 'data.json')
    )
    await handle.updateProjectList()
    utils.rm(tmpPath)
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

  // async saveUmd (data) {
  //   const index = getPath('umd')
  //   const list = await fs.readJson(index)
  //   if (data.id) {
  //     // 编辑
  //     const i = list.find(x => x.id === data.id)
  //     if (data.delete) {
  //       list.splice(i, 1)
  //     } else {
  //       list.splice(i, 1, data)
  //     }
  //   } else {
  //     // 新增
  //     list.push({
  //       ...data,
  //       id: Date.now()
  //     })
  //   }
  //   await fs.writeJson(index, list)
  // },

  async saveList (data, type) {
    const index = getPath(type)
    const list = await fs.readJson(index)
    if (data.id) {
      // 编辑
      const i = list.find(x => x.id === data.id)
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
  }
}

module.exports = handle
