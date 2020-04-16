import Vue from 'vue'
import { reactive, watch } from '@vue/composition-api'
import { loadItem } from '@/components/mobile-render/render/utils'
import { Page, setCurrentPage } from './page'
import { NodeItemBasic, setCurrentNode } from './node'
import { deepClone } from '@/assets/util'
import { http } from '@/api'
import { Message } from 'element-ui'

export type Project = {
  depLoaded: boolean
  env: 'dev' | 'pro'
  lockedBy: string
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
  config: {
    dev: {
      baseUrl: string
      componentAbsoluteUrl: string
      publicPath: string
    }
    pro: {
      baseUrl: string
      publicPath: string
    }
  }
  createUser: string
  info: {
    userName: string
    remark: string
    time: number
    whitelist: string
  }
  css: string
  [k: string]: any
}

const defaultProject: Project = {
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
    options: '(function () {\n  return {\n    // EscHttpOptions\n    successRequestAssert: res => res.success,\n    beforeRequest: (data, attaches) => data\n  }\n})()'
  },
  // url: '',
  pages: [],
  constant: '(function () {\n  return {\n    test: \'\'\n  }\n})()',
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
  config: {
    dev: {
      baseUrl: process.env.VUE_APP_FILE_SERVER,
      componentAbsoluteUrl: process.env.VUE_APP_FILE_SERVER,
      publicPath: './'
    },
    pro: {
      baseUrl: '/',
      publicPath: './'
    }
  },
  // 后台第一次创建时赋值
  createUser: '',
  info: {
    userName: '',
    remark: '',
    time: 0,
    whitelist: ''
  },
  css: ''
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
) => http.post('project/save', {
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

export const importProject = async (parseItem: Project) => {
  if (parseItem) {
    parseItem.depLoaded = false
    updateProject(parseItem)
    // 下载资源
    if (project.env === 'dev' && parseItem.componentDownload) {
      // parseItem.componentDownload = [...new Set(parseItem.componentDownload)]
      const arr: any[] = []
      parseItem.componentDownload.forEach(x => {
        if (arr.every(y => y.name !== x.name)) {
          arr.push(x)
        }
      })
      project.componentDownload = arr
      await diffDownloadDeps(arr, true)
    }
    updateProject({ depLoaded: true })
    if (parseItem.pages.length) {
      setCurrentPage(parseItem.pages[0])
    }
  }
}

export const diffDownloadDeps = async (items: NodeItemBasic[], init = false) => {
  const res = init ? project.componentDownload : items.filter(x => project.componentDownload.every(y => y.name !== x.name))
  if (res.length) {
    await Promise.all(res.map(loadItem))
  }
}

export const initProject = async (item?: Project) => {
  // watch(() => project, val => {
  //   console.dir(val)
  // }, { lazy: true, deep: true })

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
  updateProject(defaultProject)
  setCurrentPage(null)
  setCurrentNode(null)
}
