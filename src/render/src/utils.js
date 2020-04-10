import { setRenderPreview } from '../../assets/render'
import { initGlobalConfig } from '../../components/mobile-render/render/utils'
import { initProject } from '@/assets/project'

const loadVConsole = () => {
  const script = document.createElement('script')
  script.src = '//unpkg.com/vconsole'
  script.onload = () => {
    // eslint-disable-next-line no-new
    new VConsole()
  }
  document.body.appendChild(script)
}

let http = null
export const getProject = async (dir) => {
  setRenderPreview()
  // 预览走本地
  // if (isPreview) {
  //   const local = await initProject()
  //   return local ? JSON.parse(local) : null
  // }
  // 正式环境
  if (window.globalProject) {
    await initProject(window.globalProject.project)
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
  if (project.env === 'dev') {
    loadVConsole()
  }
  await initProject(project)
  return project
}
