import { http } from '@/api'
export const lock = async (dir: string, isLock: boolean = true) => {
  return http.post(
    'project/lock',
    { dir, type: isLock },
    { successMessage: isLock ? '项目自动加锁成功' : '项目解锁成功' }
  )
}

export const unlock = async (dir: string) => {
  return lock(dir, false)
}
