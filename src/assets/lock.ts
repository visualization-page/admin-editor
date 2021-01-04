import Vue from 'vue'
import { http } from '@/api'
import { onUnmounted, ref } from '@vue/composition-api'
import router from '../router'
import { saveProject } from '@/assets/project'

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

const setLockTimer = ref(0)
function setLock () {
  handleMouseMove()
  setLockTimer.value = setInterval(() => {
    lock(router.currentRoute.params.dir)
  }, 3 * 1000 * 60)
}

const noUserMouseTimer = ref(0)
function addMouseListen () {
  // 鼠标 5 分钟内无响应
  // 保存当前项目
  // 停止轮询设置锁
  // 解锁并强制退出
  noUserMouseTimer.value = setTimeout(async () => {
    clearInterval(setLockTimer.value)
    await saveProject(true, 'system auto save', false)
    await unlock(router.currentRoute.params.dir)
    cancel()
    await Vue.prototype.$msgbox.alert('由于您长时间未操作，系统已为您自动保存，请重新进入编辑', { showClose: false })
    // @ts-ignore
    router.currentRoute.query.timeout = 1
    history.back()
  }, 5 * 1000 * 60)
  // }, 1000)
}

function handleMouseMove () {
  clearTimeout(noUserMouseTimer.value)
  addMouseListen()
}

function cancel () {
  clearTimeout(noUserMouseTimer.value)
  clearInterval(setLockTimer.value)
  document.removeEventListener('mousemove', handleMouseMove)
}

export function useLock () {
  setLock()
  document.addEventListener('mousemove', handleMouseMove)
  onUnmounted(() => {
    cancel()
  })
}
