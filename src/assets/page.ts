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
  }
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
    state: '(function () {\n  return {\n    test: true\n  }\n})()'
  })
  setCurrentPage(project.pages[index])
  if (index === 0) {
    setCurrentNode(rootNode)
  }
}

export const copyPage = (page: Page) => {
  const index = project.pages.length
  Vue.set(project.pages, index, Object.assign(deepClone(page), {
    id: `page-${Date.now()}`,
    title: page.title ? `${page.title}_copy` : '',
    url: ''
  }))
  setCurrentPage(project.pages[index])
}

export const delPage = (target: { pageIndex?: number, pageId?: string }) => {
  if (target.pageId) {
    target.pageIndex = project.pages.findIndex((x: Page) => x.id === target.pageId)
  }
  if (target.pageIndex !== undefined && target.pageIndex > -1) {
    project.pages.splice(target.pageIndex, 1)
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
