import Vue from 'vue'
import { reactive, watch } from '@vue/composition-api'
import { loadItem } from '@/components/mobile-render/render/utils'
import { Page, setCurrentPage } from './page'
import { NodeItemBasic } from './node'

type Project = {
  id: number
  desc: string
  dir: string
  thumbCover: string
  interactiveType: string
  httpOptions: {
    baseUrl: string
    contentType: string
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
}

export const project: Project = reactive({
  id: 1,
  desc: '',
  dir: '',
  thumbCover: '',
  interactiveType: 'long-page',
  httpOptions: {
    baseUrl: '',
    contentType: 'application/json',
    urlMap: {
      test: '/path/to/get'
    },
    options: '(function () {\n  return {\n    test: \'test\'\n  }\n})()'
  },
  url: '',
  pages: [],
  constant: '(function () {\n  return {\n    test: \'test\'\n  }\n})()',
  componentLibrary: {
    // vant: ['Button']
  },
  componentDownload: [
    // {
    //   name: '',
    //   cssUrl: '',
    //   jsUrl: ''
    // }
  ]
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

export const importProjectLocal = async (item: string) => {
  if (item) {
    const parseItem = JSON.parse(item)
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

export const initProject = async () => {
  watch(() => project, val => {
    console.dir(val)
  }, { lazy: true, deep: true })

  const localItem = localStorage.getItem('local')
  if (localItem) {
    await importProjectLocal(localItem)
  }
}
