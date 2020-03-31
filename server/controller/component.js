const fs = require('fs-extra')
const path = require('path')
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
    await fs.writeJSON(getPath(type), content)
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
  }
}

module.exports = handle
