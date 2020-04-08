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
  // 测试环境预览才需要，正式环境直接走文件
  setRenderPreview()
  // 正式环境
  if (location.protocol === 'https') {
    return window.globalProject
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
  // @ts-ignore
  const { data: { project } } = await http.get('get', { dir })
  if (project.env) {
    loadVConsole()
  }
  await initProject(project)
  return project
}
