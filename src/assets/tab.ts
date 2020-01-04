import Vue from 'vue'
import Composition, { reactive } from '@vue/composition-api'
Vue.use(Composition)

export const tabName = {
  projectSet: 'project-set',
  pageList: 'page-list',
  nodeTree: 'node-tree',
  basicComponent: 'basic-component',
  highComponent: 'high-component',
  fx: 'fx',
  pageSet: 'page-set',
  nodeProperty: 'node-property',
  nodeStyle: 'node-style',
  nodeAnimate: 'node-animate'
}

export const tabCurrent = reactive({
  tab1: tabName.projectSet,
  tab2: tabName.basicComponent,
  tab3: tabName.pageSet
})
export const setTabName = (arr: any) => {
  arr.forEach((name: string, i: number) => {
    if (name) {
      // @ts-ignore
      tabCurrent[`tab${i + 1}`] = name
    }
  })
}
