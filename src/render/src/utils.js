import { setRenderPreview } from '@/assets/render'
import { initGlobalConfig } from '@/components/mobile-render/render/utils'
import { initProject } from '@/assets/project'

const loadVConsole = () => {
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/vconsole'
  script.onload = () => {
    // eslint-disable-next-line no-new
    new VConsole()
  }
  document.body.appendChild(script)
}

let http = null
export const getProject = async (dir) => {
  setRenderPreview()
  // 正式环境
  if (window.globalProject) {
    await initProject(window.globalProject.project)
    if (window.globalProject.project.config.openConsole) {
      loadVConsole()
    }
    // window._PUBLIC_PATH = window.globalProject.project.config.pro.publicPath
    return window.globalProject.project
  }
  // 非正式环境
  if (!http) {
    const global = initGlobalConfig(null)
    global.initHttp({
      baseUrl: process.env.VUE_APP_FILE_SERVER,
      urlMap: {
        get: '/butterfly/project/:dir'
      },
      contentType: 'application/json',
      options: '{ loadingMethods: $$global.loading, notify: $$global.toast }'
    }, { $$global: global })
    http = global.http
  }
  const { data: { project } } = await http.get('get', { dir })
  if (project.config.openConsole) {
    loadVConsole()
  }
  await initProject(project)
  window._PUBLIC_PATH = project.config.dev.publicPath
  return project
}
