const fs = require('fs-extra')
const path = require('path')
const utils = require('./utils')
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
    // 检查名称是否存在
    const exist = await fs.pathExists(getPath(type))
    if (exist) {
      const arr = fs.readJSON(getPath(type))
      if (arr.findIndex(x => x.name === data.name) > -1) {
        return false
      }
    }
    // const result = {
    //   componentDeps
    //   name
    //   node
    // }
    await fs.outputJSON(path.join(getPath(type, false), data.name, 'data.json'), data)
    await handle.update(type)
    return true
  },

  /**
   * 上传自定义组件
   * @param file
   * @param tmpPath
   * @returns {Promise<string>}
   */
  upload: async (file, tmpPath) => {
    let msg = ''
    // 解压到 tmp/data 目录下
    console.log('----', file)
    utils.unzip(file, tmpPath)
    // 读取 package.json name 校验唯一性
    const pkg = path.join(tmpPath, 'package.json')
    const schemaPath = path.join(tmpPath, 'schema.js')
    if (fs.pathExistsSync(pkg)) {
      const pkgContent = await fs.readJSON(pkg)
      const { name, main } = pkgContent
      // name = `bf-${name}`
      console.log('----', name, main)
      const upPath = getPath('upload')
      const basicPath = getPath('basic')
      let exist = false
      if (fs.pathExistsSync(upPath)) {
        const arr = await fs.readJSON(upPath)
        exist = arr.some(x => x.name === `bf-${name}`)
      }
      if (fs.pathExistsSync(basicPath)) {
        const arr = await fs.readJSON(basicPath)
        exist = arr.some(x => x.name === `bf-${name}`)
      }
      if (exist) {
        msg = '组件名称已存在'
      } else if (fs.pathExistsSync(schemaPath)) {
        const schema = require(schemaPath)
        // 创建入口文件格式
        const entryContent = fs.readFileSync(path.join(pubPath, 'upload-entry-template.tpl'), 'utf8')
          .replace('{{entryVue}}', main)
          .replace('{{props}}', JSON.stringify(pkgContent))
          .replace('{{schema}}', JSON.stringify(schema))
        const entryPath = path.join(tmpPath, 'entry.js')
        await fs.outputFile(entryPath, entryContent)
        console.log('---- entryPath', entryPath, entryContent)
        await utils.webpack(name, entryPath)
        console.log('---- webpack done')
        // 将 zip 包 copy 到目标目录
        await fs.copy(file, path.join(pubPath, 'upload', name, `${name}.zip`))
      } else {
        msg = 'schema.js 不存在'
      }
    } else {
      msg = 'package.json 不存在'
    }
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
    }
  },
  getProject: (dir) => {
    return fs.readJson(path.join(pubPath, 'project', dir, 'data.json'))
  },
  releaseProject: async (dir) => {
    const releasePath = path.resolve(__dirname, '../../release', dir)
    const distPath = path.resolve(__dirname, '../../dist-system')
    // copy dist-system/ => release/项目 目录下
    await fs.copy(distPath, releasePath)
    // 改写 data.json
    const dirPath = path.join(pubPath, 'project', dir, 'data.json')
    const globalProject = await fs.readJson(dirPath)
    // 切换为正式环境
    globalProject.project.env = 'pro'
    const releaseDataFileName = `data.${dayjs().format('MM-DD-HH-mm')}.js`
    await fs.outputFile(path.join(releasePath, releaseDataFileName), `var globalProject = ${JSON.stringify(globalProject)}`)
    // 改写 render.html 中的 publicPath
    const releaseRenderPath = path.join(releasePath, 'render.html')
    const publicPath = globalProject.project.config.pro.publicPath || ''
    let renderContent = await fs.readFile(releaseRenderPath, 'utf8')
    // href=css href=js src=js
    renderContent = renderContent
      .replace(/(href=css|href=js|src=js)/g, (match, group) => {
        const arr = group.split('=')
        return arr[0] + '=' + publicPath + '/' + arr[1]
      })
      // 编译 code
      // 插入 data 引入 window.globalProject
      .replace('</head>', `<script src="${publicPath}/${releaseDataFileName}"></script></head>`)
    await fs.outputFile(path.join(releasePath, 'index.html'), renderContent)
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
  }
}

module.exports = handle
