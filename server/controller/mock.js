const fs = require('fs-extra')
const path = require('path')
const utils = require('./utils')
const pubPath = path.resolve(__dirname, '../public')
const component = require('./component')
const MD5 = require('blueimp-md5')
const NodeCache = require('node-cache')
const CACHE_TIME = 60 * 5
const myCache = new NodeCache({
  stdTTL: CACHE_TIME,
  checkperiod: CACHE_TIME
})

const handle = {
  findById (arr, id) {
    if (id === undefined || id === null) {
      return null
    }
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.id === id) {
        return item
      } else if (item.children && item.children.length) {
        const res = handle.findById(item.children, id)
        if (res) {
          return res
        }
      }
    }
  },

  async getIndex () {
    const file = path.resolve(pubPath, 'mock', 'index.json')
    return fs.readJson(file)
  },

  async getApiList ({ categoryId }) {
    const file = path.resolve(pubPath, 'mock', 'api.json')
    const res = await fs.readJson(file).catch(() => [])
    return res.filter(x => x.categoryId === categoryId)
  },

  async getApiDetail ({ id }) {
    const dataFile = path.resolve(pubPath, 'mock', 'api', `${id}.json`)
    // 校验文件是否存在
    if (!fs.pathExistsSync(dataFile)) {
      return { msg: '接口不存在' }
    }

    const cache = myCache.get(id)
    if (cache) {
      return { data: cache }
    }
    // 设置缓存时间
    const data = await fs.readJson(dataFile)
    myCache.set(id, data)
    return { data }
  },

  async apiAdd ({ id, name, data, categoryId }) {
    const jsonFile = path.resolve(pubPath, 'mock', 'api.json')
    await fs.ensureFile(jsonFile)
    const apiData = await fs.readJson(jsonFile).catch(() => [])
    const writeData = (id, json) => {
      const dataFile = path.resolve(pubPath, 'mock', 'api', `${id}.json`)
      fs.ensureFileSync(dataFile)
      return fs.writeJson(dataFile, json)
    }

    if (id) {
      const item = apiData.find(x => x.id === id)
      item.name = name
      await writeData(id, data)
    } else {
      const id = MD5(name)
      const item = {
        id,
        name,
        categoryId
      }
      await writeData(id, data)
      apiData.push(item)
    }
    await fs.writeJson(jsonFile, apiData)
  },

  async categoryAdd ({ id, name, creator, parentId }) {
    const data = await component.list('mock')
    const parent = handle.findById(data, parentId)
    if (id) {
      // 修改
      const item = (parent ? parent.children : data).find(x => x.id === id)
      item.name = name
    } else {
      // 新增
      const id = MD5(name)
      const arr = (parent ? parent.children : data)
      // 校验 id 是否已存在
      const exist = handle.findById(data, id)
      if (exist) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return '该分类已存在'
      }
      arr.push({
        id,
        name,
        creator,
        parentId,
        children: []
      })
    }
    const file = path.resolve(pubPath, 'mock', 'index.json')
    await fs.writeJson(file, data)
  },

  async deleteCategory ({ id, parentId }) {
    const data = await component.list('mock')
    const parent = handle.findById(data, parentId)
    const i = parent.children.findIndex(x => x.id === id)
    parent.children.splice(i, 1)
    const file = path.resolve(pubPath, 'mock', 'index.json')
    await fs.writeJson(file, data)
  },

  async deleteApi ({ id }) {
    const jsonFile = path.resolve(pubPath, 'mock', 'api.json')
    const json = await fs.readJson(jsonFile)
    const i = json.findIndex(x => x.id === id)
    json.splice(i, 1)
    utils.rm(path.resolve(pubPath, 'mock', 'api', `${id}.json`))
    await fs.writeJson(jsonFile, json)
  }
}

module.exports = handle
