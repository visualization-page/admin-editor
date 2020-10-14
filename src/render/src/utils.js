import { setRenderPreview } from '@/assets/render'
import { initGlobalConfig } from '@/components/mobile-render/render/utils'
import { initProject } from '@/assets/project'
import { loadSdk, loadSdkSystem } from '@/assets/util'

export const loadVConsole = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'vconsole/index.js'
    script.id = 'vconsole'
    script.onload = () => {
      // eslint-disable-next-line no-new
      new VConsole()
      resolve()
    }
    script.onerror = () => {
      reject(new Error('vconsole load error'))
    }
    document.body.appendChild(script)
  })
}

let http = null
export const getProject = async (dir) => {
  setRenderPreview()
  // 正式环境
  if (window.globalProject) {
    if (window.globalProject.project.config.openConsole) {
      if (window.VConsole) {
        // eslint-disable-next-line no-new
        new VConsole()
      } else {
        console.warn('VConsole is not defined')
      }
    }
    await initProject(window.globalProject.project)
    // window._PUBLIC_PATH = window.globalProject.project.config.pro.publicPath
    return window.globalProject.project
  }
  // 非正式环境
  if (!http) {
    const global = initGlobalConfig(null)
    global.initHttp({
      baseUrl: JSON.stringify(process.env.VUE_APP_FILE_SERVER),
      urlMap: {
        get: '/butterfly/project/:dir'
      },
      contentType: 'application/json',
      options: '{ loadingMethods: $$global.loading, notify: $$global.toast }'
    }, { $$global: global })
    http = global.http
  }
  const { data: { project } } = await http.get('get', { dir, preview: 1 })
  // 20000
  const arr = [loadSdk(project.interactiveType)]
  // 如果是小程序，检查 sdklist
  if (
    project.interactiveType === 'xmmp' &&
    project.config.sdklist &&
    project.config.sdklist.length
  ) {
    Array.prototype.push.apply(arr, loadSdkSystem(project.config.sdklist))
  }
  if (project.config.openConsole) {
    arr.push(loadVConsole())
  }
  await Promise.all(arr)
  await initProject(project)
  window._PUBLIC_PATH = project.config.dev.publicPath
  return project
}
