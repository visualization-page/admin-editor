import Vue from 'vue'
import Composition, { reactive } from '@vue/composition-api'
Vue.use(Composition)

export const tabName = {
  projectSet: 'project-set',
  pageList: 'page-list',
  pageTemplate: 'page-template',
  nodeTree: 'node-tree',
  basicComponent: 'basic-component',
  highComponent: 'high-component',
  libraryComponent: 'library-component',
  fx: 'fx',
  pageSet: 'page-set',
  nodeProperty: 'node-property',
  nodeStyle: 'node-style',
  nodeAnimate: 'node-animate',
  previewArea: 'preview-area',
  codeEdit: 'code-edit',
  eventEdit: 'event-edit'
}

export const tabCurrent = reactive({
  tab1: tabName.projectSet,
  tab2: tabName.basicComponent,
  tab3: tabName.pageSet,
  tab4: tabName.previewArea
})
export const setTabName = (arr: any) => {
  arr.forEach((name: string, i: number) => {
    if (name) {
      // @ts-ignore
      tabCurrent[`tab${i + 1}`] = name
    }
  })
}
