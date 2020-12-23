import Vue from 'vue'
import { http } from '@/api'
import { onUnmounted, ref } from '@vue/composition-api'
// import router from '../router'

export const lock = async (dir: string, isLock: boolean = true) => {
  return http.post(
    'project/lock',
    { dir, type: isLock, name: Vue.prototype.$native.name }
    // { successMessage: isLock ? '项目自动加锁成功' : '项目解锁成功' }
  )
}

export const unlock = async (dir: string) => {
  return lock(dir, false)
}

const timer = ref(0)

export function clearTimer () {
  if (timer.value) {
    clearTimeout(timer.value)
  }
}

export function addTimer () {
  timer.value = setTimeout(async () => {
    // await unlock(router.currentRoute.params.dir)
    await Vue.prototype.$msgbox.alert('请重新进入编辑', { showClose: false })
    history.back()
  }, 1000 * 7 * 60)
}

export function useLock () {
  // onMounted(() => {
  //   document.addEventListener('mousemove', handleMove)
  // })
  // clearTimer()
  addTimer()
  onUnmounted(() => {
    clearTimer()
    // document.removeEventListener('mousemove', handleMove)
  })
}
