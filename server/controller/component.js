const fs = require('fs-extra')
const path = require('path')
const utils = require('./utils')
const lock = require('./lock')
const dayjs = require('dayjs')
const pubPath = path.resolve(__dirname, '../public')

function getPath (type, isIndex = true) {
  return path.join(pubPath, type, isIndex ? 'index.json' : '')
}

const handle = {
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
    const c = await fs.readFileSync(file, 'utf8')
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
        createUser: project.createUser
      }
    })
  },
  saveProject: async (dir, data) => {
    const exist = fs.pathExistsSync(path.join(pubPath, 'project', dir))
    if (!data.force && exist) {
      // 检查是否已存在
      return { success: false, msg: `项目 ${dir} 名称已存在`, code: 6001 }
    } else {
      // 初次创建保存创建人
      if (!exist) {
        data.project.createUser = data.project.info.userName
      }
      delete data.force
      await fs.outputFile(path.join(pubPath, 'project', dir, 'data.json'), JSON.stringify(data))
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
    // 先清空目标文件夹
    utils.rm(releasePath)
    // copy dist-system/ => release/项目 目录下
    const manifest = await fs.readJson(path.join(distPath, 'manifest.json'))
    await fs.copy(path.join(distPath, 'render.html'), path.join(releasePath, 'index.html'))
    await fs.copy(path.join(distPath, 'vant-form'), path.join(releasePath, 'vant-form'))
    await fs.copy(path.join(distPath, 'vant2.5'), path.join(releasePath, 'vant2.5'))
    await fs.copy(path.join(distPath, 'vue2.6'), path.join(releasePath, 'vue2.6'))
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
    // 改写 data.json
    const dataPath = path.join(pubPath, 'project', dir, 'data.json')
    await fs.copy(dataPath, path.join(releasePath, 'data.json'))
    const globalProject = await fs.readJson(dataPath)
    globalProject.project.info = body.info
    await fs.writeJson(dataPath, globalProject)
    await handle.updateProjectList()
    // 将组件 js 合并生成文件
    let jsContent = ''
    for (let i = 0; i < globalProject.project.componentDownload.length; i++) {
      const item = globalProject.project.componentDownload[i]
      const c = await fs.readFile(path.join(pubPath, item.jsUrl.replace('/butterfly/static', '')))
      jsContent += `${c}\n`
    }
    const componentMergeFileName = `component.${dayjs().format('MMDDHHmmss')}.js`
    await fs.outputFile(path.join(releasePath, componentMergeFileName), jsContent, 'utf8')
    // 切换为正式环境
    globalProject.project.env = 'pro'
    // 编译 code
    await utils.babel(globalProject.project)
    // 改写 index.html 中的 publicPath
    const releaseHtmlPath = path.join(releasePath, 'index.html')
    const publicPath = globalProject.project.config.pro.publicPath || ''
    let renderContent = await fs.readFile(releaseHtmlPath, 'utf8')
    // href=css href=js src=js
    renderContent = renderContent
      .replace(/(href=css|href=js|src=js)/g, (match, group) => {
        const arr = group.split('=')
        return arr[0] + '=' + publicPath + '/' + arr[1]
      })
      // 插入 data 引入 window.globalProject
      .replace(
        '</head>',
        `<script>/* ${dayjs().format('YYYY/MM/DD HH:mm')} */ var globalProject = %%%%</script></head>`
      )
      .replace(
        '</body>',
        `<script src="${publicPath + componentMergeFileName}"></script></body>`
      )
    // 正则匹配中 $$ 是关键词，必须绕开
    renderContent = renderContent.split('%%%%')
    renderContent = renderContent[0] + JSON.stringify(globalProject) + renderContent[1]
    await fs.outputFile(path.join(releasePath, 'index.html'), renderContent)
    // utils.rm(path.join(releasePath, 'render.html'))
    // 同步提交 git
    // 不提交 git，忽略 release 目录
    // await utils.spawn('git', ['add', '.'])
    // return utils.spawn('git', ['commit', '-m', `build: release ${releaseDataFileName}`])
    //   .then(() => {
    //     // 已经是目标机器，不需要 push
    //     // return utils.spawn('git', ['push'])
    //   })
    //   .catch(err => {
    //     if (typeof err === 'string') {
    //       return
    //     }
    //     return Promise.reject(err)
    //   })
    const zipPath = path.join(releasePath, `${dir}.zip`)
    if (fs.pathExistsSync(zipPath)) {
      utils.rm(zipPath)
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
  }
}

module.exports = handle
