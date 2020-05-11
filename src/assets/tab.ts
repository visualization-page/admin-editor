import { reactive, ref } from '@vue/composition-api'

export const tabName = {
  projectSet: 'project-set',
  pageList: 'page-list',
  pageTemplate: 'page-template',
  globalUtils: 'global-utils',
  nodeTree: 'node-tree',
  basicComponent: 'basic-component',
  highComponent: 'high-component',
  uploadComponent: 'upload-component',
  libraryComponent: 'library-component',
  fx: 'fx',
  umdComponent: 'umd-component',
  pageSet: 'page-set',
  nodeProperty: 'node-property',
  nodeStyle: 'node-style',
  nodeAnimate: 'node-animate',
  previewArea: 'preview-area',
  codeEdit: 'code-edit',
  eventEdit: 'event-edit'
}

export const tabCurrent = reactive<{
  [k: string]: string
}>({
  tab1: tabName.projectSet,
  tab2: tabName.basicComponent,
  tab3: tabName.pageSet,
  tab4: tabName.previewArea
})
export const setTabName = (arr: any[]) => {
  if (arr[0]) {
    if (arr[0] === tabCurrent.tab1) {
      hideComponent(!isHideComponent.value)
    } else {
      hideComponent(true)
    }
  } else if (arr[1]) {
    // if (arr[1] === tabCurrent.tab2) {
    //   hideComponent(!isHideComponent.value)
    // } else {
    hideComponent(false)
    // }
  }
  arr.forEach((name: string, i: number) => {
    if (name) {
      tabCurrent[`tab${i + 1}`] = name
    }
  })
}

export const isHideComponent = ref(false)
export const hideComponent = (type: boolean = false) => {
  isHideComponent.value = type
}
