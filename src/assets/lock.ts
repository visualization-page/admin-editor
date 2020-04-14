import { watch } from '@vue/composition-api'
import Vue from 'vue'
import { updateProject, project, saveProject } from './project'
import { Message } from 'element-ui'

let stopWatchHandler: () => void
let timerHandler: number
const setTimer = () => {
  timerHandler = setTimeout(unlock, 5 * 60 * 1000)
}
export const lock = async () => {
  console.log('add lock and start time !')
  updateProject({ lockedBy: Vue.prototype.$native.name })
  await saveProject(true)
  setTimer()
  stopWatchHandler = watch(() => project, (val) => {
    if (timerHandler) {
      console.log('clearTimeout reset lock time !')
      clearTimeout(timerHandler)
      setTimer()
    }
    console.dir(val)
  }, { deep: true, lazy: true })
}

export const unlock = async (active?: boolean) => {
  if (stopWatchHandler) {
    stopWatchHandler()
    // @ts-ignore
    stopWatchHandler = null
    if (timerHandler) {
      clearTimeout(timerHandler)
      timerHandler = 0
      console.log('save project and unlock project')
      updateProject({ lockedBy: '' })
      await saveProject(true)
      if (!active) {
        Message.info('项目 5min 未编辑，已自动解锁')
        setTimeout(() => {
          history.back()
        }, 2000)
      }
    }
  }
}
