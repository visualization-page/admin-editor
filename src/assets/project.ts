import Vue from 'vue'
import { reactive, watch } from '@vue/composition-api'
import { loadItem } from '@/components/mobile-render/render/utils'
import { Page, setCurrentPage } from './page'
import { NodeItemBasic } from './node'

export type Project = {
  // id: number
  env: 'dev' | 'pro'
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
    options: string
  }
  url: string
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
    }
    pro: {
      baseUrl: string
      componentAbsoluteUrl: string
    }
  }
}

export const project: Project = reactive({
  // id: 1,
  // 环境 默认 dev，可切换 pro，目前只关联了 config 字段
  env: 'dev',
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
  url: '',
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
      baseUrl: 'http://localhost:8080',
      componentAbsoluteUrl: 'http://localhost:3000'
    },
    pro: {
      baseUrl: '/',
      componentAbsoluteUrl: 'https://statics.e.uban360.com/'
    }
  },
  info: {
    userName: '',
    remark: '',
    time: 0
  }
})

export const updateProject = (obj: typeof project) => {
  Object.keys(obj).forEach(key => {
    // @ts-ignore
    if (project[key] !== undefined && project[key] !== obj[key]) {
      // @ts-ignore
      project[key] = obj[key]
    } else {
      // @ts-ignore
      Vue.set(project, key, obj[key])
    }
  })
}

export const exportProjectLocal = () => {
  localStorage.setItem('local', JSON.stringify(project))
}

export const importProjectLocal = async (parseItem: Project) => {
  if (parseItem) {
    // 下载资源
    if (parseItem.componentDownload) {
      await diffDownloadDeps(parseItem.componentDownload)
    }
    updateProject(parseItem)
    if (parseItem.pages.length) {
      setCurrentPage(parseItem.pages[0])
    }
  }
}

export const diffDownloadDeps = async (items: NodeItemBasic[]) => {
  const res = items.filter(x => project.componentDownload.every(y => y.name !== x.name))
  if (res.length) {
    await Promise.all(res.map(loadItem))
  }
}

export const initProject = async (item?: Project) => {
  watch(() => project, val => {
    console.dir(val)
  }, { lazy: true, deep: true })

  if (item) {
    await importProjectLocal(item)
  } else {
    const localItem = localStorage.getItem('local')
    if (localItem) {
      await importProjectLocal(JSON.parse(localItem))
    }
  }
}
