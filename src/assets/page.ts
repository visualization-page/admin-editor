import Vue from 'vue'
import Composition, { reactive, ref } from '@vue/composition-api'
import { project } from './project'
import { rootNode, setCurrentNode, NodeItem } from './node'
Vue.use(Composition)

export type Page = {
  title: string
  url: string
  id: string
  nodes: NodeItem[]
}

export const currentPage = ref<Page | null>(null)

export const setCurrentPage = (item: any) => {
  currentPage.value = item
}

export const addPage = () => {
  const index = project.pages.length
  Vue.set(project.pages, index, {
    title: '',
    url: '',
    id: `page-${Date.now()}`,
    nodes: []
  })
  setCurrentPage(project.pages[index])
  if (index === 0) {
    setCurrentNode(rootNode)
  }
}

export const delPage = (target: { pageIndex?: number, pageId?: string }) => {
  if (target.pageId) {
    target.pageIndex = project.pages.findIndex((x: Page) => x.id === target.pageId)
  }
  if (target.pageIndex !== undefined && target.pageIndex > -1) {
    project.pages.splice(target.pageIndex, 1)
  }
}

export const updatePages = (target: { pageId?: string, pageIndex?: number }, obj: Page) => {
  let { pageId, pageIndex } = target
  if (pageId) {
    pageIndex = project.pages.findIndex((x: Page) => x.id === pageId)
  }
  if (pageIndex !== undefined && pageIndex > -1) {
    // @ts-ignore
    Vue.set(project.pages, pageIndex, { ...project.pages[pageIndex], ...obj })
  }
}
