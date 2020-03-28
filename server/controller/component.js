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
      // const existCss = await fs.pathExists(path.join(pubPath, type, dirs[i], 'index.css'))
      content.push({
        ...data,
        jsUrl: `${p}/index.js`,
        cssUrl: data.existCss && `${p}/index.css`
      })
    }

    // 遍历 type 文件夹
    await fs.writeJSON(getPath(type), content)
    return content
  }
}

module.exports = handle
