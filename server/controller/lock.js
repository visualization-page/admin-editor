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
      // 默认锁丢失时间延长为 3h
    }, 10 * 60 * 1000)
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
