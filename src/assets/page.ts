import Vue from 'vue'
import { ref } from '@vue/composition-api'
import { project } from './project'
import { rootNode, setCurrentNode, NodeItem } from './node'
import { deepClone } from '@/assets/util'

export type Page = {
  title: string
  url: string
  id: string
  nodes: NodeItem[]
  state: string
  events: any[]
  hasShare: boolean
  share: {
    title: string
    desc: string
    pic: string
    link: string
    linkMain: string
  },
  methods: string
}

export const currentPage = ref<Page | null>(null)

export const setCurrentPage = (item: Page | null) => {
  currentPage.value = item
}

export const addPage = () => {
  const index = project.pages.length
  Vue.set(project.pages, index, {
    title: '',
    url: '',
    id: `page-${Date.now()}`,
    nodes: [],
    hasShare: false,
    share: {
      title: '',
      desc: '',
      pic: '',
      link: '',
      linkMain: ''
    },
    events: [],
    state: '(function () {\n  return {\n    test: true\n  }\n})()',
    methods: '(function () {\n  return {\n    common: () => {}\n  }\n})()'
  })
  setCurrentPage(project.pages[index])
  if (index === 0) {
    setCurrentNode(rootNode)
  }
}

export const copyPage = (page: Page) => {
  const index = project.pages.length
  const newId = `page-${Date.now()}`
  Vue.set(project.pages, index, Object.assign(deepClone(page), {
    id: newId,
    title: page.title ? `${page.title}_copy` : '',
    url: ''
  }))
  setCurrentPage(project.pages[index])
  // project.componentDownload 也要复制到相应的页面一份
  project.componentDownload.filter(x => x.pageId === page.id).forEach(it => {
    project.componentDownload.push({
      ...it,
      pageId: newId
    })
  })
}

export const delPage = (target: { pageIndex?: number, pageId?: string }) => {
  if (target.pageId) {
    target.pageIndex = project.pages.findIndex((x: Page) => x.id === target.pageId)
  }
  if (target.pageIndex !== undefined && target.pageIndex > -1) {
    const page = project.pages[target.pageIndex]
    const get = () => project.componentDownload.findIndex(x => x.pageId === page.id)
    project.pages.splice(target.pageIndex, 1)
    let index = get()
    while (index > -1) {
      console.log('del page deps')
      project.componentDownload.splice(index, 1)
      index = get()
    }
  }
  setCurrentPage(null)
  setCurrentNode(null)
}

export const updatePages = (target: { pageId?: string, pageIndex?: number }, obj: Page) => {
  let { pageId, pageIndex } = target
  if (pageId) {
    pageIndex = project.pages.findIndex((x: Page) => x.id === pageId)
  }
  if (pageIndex !== undefined && pageIndex > -1) {
    Vue.set(project.pages, pageIndex, { ...project.pages[pageIndex], ...obj })
  }
}
