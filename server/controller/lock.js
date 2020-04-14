// import { unlock } from '../../src/assets/lock'
// const component = require('./component')
// const fs = require('fs-extra')
// const path = require('path')
// const pubPath = path.resolve(__dirname, '../public')
let timerHandler
const handle = {
  lockMap: {
  },
  async lock (dir, userName) {
    // 更改项目文件 lockedBy
    // const dataPath = path.join(pubPath, 'project', dir, 'data.json')
    // const data = await fs.readJson(dataPath)
    // data.lockedBy = userName
    // await fs.writeJson(dataPath, data)
    handle.lockMap[dir] = userName
    if (timerHandler) {
      clearTimeout(timerHandler)
    }
    // await component.updateProjectList()
    console.log('===>', dir, 'lock')
    timerHandler = setTimeout(() => {
      handle.unlock(dir)
    }, 5 * 60 * 1000)
  },
  async unlock (dir) {
    // const dataPath = path.join(pubPath, 'project', dir, 'data.json')
    // const data = await fs.readJson(dataPath)
    // data.lockedBy = ''
    handle.lockMap[dir] = ''
    if (timerHandler) {
      clearTimeout(timerHandler)
      timerHandler = undefined
    }
    console.log('===>', dir, 'unlock')
    // await component.updateProjectList()
    // await fs.writeJson(dataPath, data)
  }
}

module.exports = handle
