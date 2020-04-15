const timerHandlerMap = {}
const handle = {
  lockMap: {
  },
  async lock (dir, userName) {
    handle.lockMap[dir] = userName
    if (timerHandlerMap[dir]) {
      clearTimeout(timerHandlerMap[dir])
    }
    // await component.updateProjectList()
    console.log('===>', dir, 'lock')
    timerHandlerMap[dir] = setTimeout(() => {
      handle.unlock(dir)
    }, 5 * 60 * 1000)
  },
  async unlock (dir) {
    handle.lockMap[dir] = ''
    if (timerHandlerMap[dir]) {
      clearTimeout(timerHandlerMap[dir])
      timerHandlerMap[dir] = undefined
    }
    console.log('===>', dir, 'unlock')
  }
}

module.exports = handle
