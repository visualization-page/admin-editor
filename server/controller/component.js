const fs = require('fs-extra')
const path = require('path')
const utils = require('./utils')
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
   */
  update: async (type) => {
    const typeDir = getPath(type, false)
    let dirs = await fs.readdir(typeDir)
    dirs = dirs.filter(x => !/\./.test(x))
    const content = []
    for (let i = 0; i < dirs.length; i++) {
      const data = await fs.readJSON(path.join(typeDir, dirs[i], 'data.json'))
      const p = `/butterfly/static/${type}/${dirs[i]}`
      content.push({
        ...data,
        jsUrl: data.componentDeps ? undefined : `${p}/index.js`,
        cssUrl: data.existCss && `${p}/index.css`
      })
    }

    // 遍历 type 文件夹
    await fs.outputFile(getPath(type), JSON.stringify(content))
    return content
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
      } else {
        msg = 'schema.js 不存在'
      }
    } else {
      msg = 'package.json 不存在'
    }
    utils.rm(tmpPath)
    return msg
  }
}

module.exports = handle
