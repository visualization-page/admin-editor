import Vue from 'vue'
import { reactive } from '@vue/composition-api'
import { loadItem, loadItemUmd } from '@/components/mobile-render/render/utils'
import { Page, setCurrentPage, currentPage } from './page'
import { NodeItemBasic, NodeUmd, setCurrentNode } from './node'
import { deepClone, loadSdkSystem, inAdminPlatform, isInEditor } from '@/assets/util'
import { setState as setCodeState, setStateNew as setCodeStateNew } from '@/assets/code-edit'
import { http } from '@/api'
import { Message } from 'element-ui'

export type Project = {
  depLoaded: boolean
  env: 'dev' | 'pro'
  lockedBy: string
  url: string
  desc: string
  dir: string
  thumbCover: string
  interactiveType: string
  httpOptions: {
    baseUrl: string
    contentType: 'application/x-www-form-urlencoded' | 'application/json'
    urlMap: {
      [k: string]: string
    }
    options?: string
  }
  pages: Array<Page>
  constant: string
  componentLibrary: {
    [k: string]: string[]
  }
  componentDownload: NodeItemBasic[]
  componentUmd: NodeUmd[]
  syncFile: boolean
  config: {
    appType: Number
    path: string
    openConsole: boolean
    dev: {
      baseUrl: string
      componentAbsoluteUrl: string
      publicPath: string
    }
    pro: {
      baseUrl: string
      publicPath: string
      syncPath: string
      onlineUrl: string
    },
    proArr: Array<{
      baseUrl: string
      publicPath: string
      [k: string]: string
    }>
    iocSync?: boolean
    sdklist?: string[]
    previewQrcode: boolean
    vwBase: number
    navColor?: string
  }
  createUser: string
  info: {
    userName: string
    remark: string
    time: number
    whitelist: string
  }
  css: string
  utils: string
  initScripts: string
  [k: string]: any
}

export const defaultProject: Project = {
  url: '',
  depLoaded: true,
  // 环境 默认 dev，可切换 pro，目前只关联了 config 字段
  env: 'dev',
  lockedBy: '',
  desc: '',
  dir: '',
  thumbCover: '',
  interactiveType: 'long-page',
  httpOptions: {
    baseUrl: '$$global.config.baseUrl',
    contentType: 'application/json',
    urlMap: {
      test: '/path/to/get'
    },
    options: 'function opt () {\n  return {\n    // EscHttpOptions\n    successRequestAssert: res => res.success,\n    beforeRequest: (data, attaches) => data\n  }\n}\n\n$$global.export = opt()'
  },
  // url: '',
  pages: [],
  constant: 'function consWrap () {\n  return {\n    test: \'\'\n  }\n}\n\n$$global.export = consWrap()',
  componentLibrary: {
    // vant: ['Button']
  },
  componentDownload: [
    // {
    //   name: '',
    //   cssUrl: '',
    //   jsUrl: ''
    // }
  ],
  componentUmd: [
  ],
  syncFile: false,
  config: {
    appType: 1,
    path: '',
    openConsole: true,
    dev: {
      baseUrl: process.env.VUE_APP_FILE_SERVER,
      componentAbsoluteUrl: process.env.VUE_APP_FILE_SERVER,
      publicPath: './'
    },
    pro: {
      baseUrl: '/',
      publicPath: './',
      // 目标机器目录
      syncPath: '',
      // 线上地址
      onlineUrl: ''
    },
    proArr: [],
    previewQrcode: true,
    vwBase: 375,
    navColor: undefined
  },
  // 后台第一次创建时赋值
  createUser: '',
  info: {
    userName: '',
    remark: '',
    time: 0,
    whitelist: ''
  },
  css: '',
  utils: 'function utils () {\n  return {\n    deepClone: (obj) => JSON.parse(JSON.stringify(obj))\n  }\n}\n\n$$global.export = utils()',
  initScripts: 'function wrap () {\n  return {\n    test: \'\'\n  }\n}\n\n$$global.export = wrap()'
}

export const project: Project = reactive(deepClone(defaultProject))

export const updateProject = (obj: Partial<Project>) => {
  Object.keys(obj).forEach(key => {
    if (project[key] !== undefined && project[key] !== obj[key]) {
      project[key] = obj[key]
    } else {
      Vue.set(project, key, obj[key])
    }
  })
}

export const exportProjectLocal = (item?: Project) => {
  localStorage.setItem('local', JSON.stringify(item || project))
}

export const saveProject = (
  force?: boolean,
  remark?: string,
  notify?: boolean
) => {
  return http.post('project/save', {
    dir: project.dir,
    force,
    project: {
      ...project,
      info: {
        ...project.info,
        remark,
        userName: Vue.prototype.$native.name,
        time: Date.now()
      }
    }
  }, {
    codeCallback: {
      6001: async () => {
        // await MessageBox.confirm('项目已存在，不允许覆盖！')
        // await handleSave(true)
        Message.error('项目已存在')
      }
    },
    notify: notify !== false
  })
}

async function downloadUmdWrap (cb: any) {
  if (!window.defineBak && window.define) {
    window.defineBak = window.define
  }
  window.define = null
  await cb()
  window.define = window.defineBak
}

export const importProject = async (parseItem: Project) => {
  if (parseItem) {
    parseItem.depLoaded = false
    updateProject(parseItem)
    if (inAdminPlatform && parseItem.componentUmd) {
      await downloadUmdWrap(async () => {
        // umd 的下载也是有顺序的
        for (let i = 0; i < parseItem.componentUmd.length; i++) {
          await loadItemUmd(parseItem.componentUmd[i])
        }
      })
    }
    // 下载资源
    if (inAdminPlatform && parseItem.componentDownload) {
      await diffDownloadDeps([], true)
    }
    // 小程序 sdk
    if (
      isInEditor() &&
      parseItem.interactiveType === 'xmmp' &&
      parseItem.config.sdklist &&
      parseItem.config.sdklist.length
    ) {
      await downloadUmdWrap(() => loadSdkSystem(parseItem.config.sdklist!, Vue.prototype.$system.localXmmpSdk))
    }
    updateProject({ depLoaded: true })
    if (parseItem.pages.length) {
      const indexPage = parseItem.pages.find(x => x.isIndex)
      setCurrentPage(indexPage || parseItem.pages[0])
    }
  }
}

export const diffDownloadDeps = async (items: NodeItemBasic[], init = false) => {
  if (init) {
    return Promise.all(project.componentDownload.map(loadItem))
  }

  const res: any = []
  // 将依赖存进当前页面
  items.forEach(it => {
    // debugger
    const currentPageDeps = project.componentDownload.filter(x => x.pageId === currentPage.value!.id)
    const dep = currentPageDeps.find(x => x.name === it.name)
    if (dep) {
      // console.log('old num ++')
      dep.refNum += 1
    } else {
      res.push(it)
      // console.log('new compose')
      project.componentDownload.push({
        ...it,
        pageId: currentPage.value!.id,
        refNum: 1
      })
    }
  })
  await Promise.all(res.map(loadItem))
}

export const initProject = async (item?: Project) => {
  if (item) {
    await importProject(item)
  } else {
    const localItem = localStorage.getItem('local')
    if (localItem) {
      await importProject(JSON.parse(localItem))
    }
    return localItem
  }
}

export const resetProject = () => {
  updateProject(deepClone(defaultProject))
  setCurrentPage(null)
  setCurrentNode(null)
  setCodeState(false)
  setCodeStateNew(false)
}

// watch(() => project, val => {
//   console.dir(val)
// }, { lazy: true, deep: true })
