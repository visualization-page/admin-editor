import { reactive, ref } from '@vue/composition-api'

export const tabName = {
  projectSet: 'project-set',
  pageList: 'page-list',
  pageTemplate: 'page-template',
  nodeTree: 'node-tree',
  basicComponent: 'basic-component',
  highComponent: 'high-component',
  uploadComponent: 'upload-component',
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

export const tabCurrent = reactive<{
  [k: string]: string
}>({
  tab1: tabName.projectSet,
  tab2: tabName.basicComponent,
  tab3: tabName.pageSet,
  tab4: tabName.previewArea
})
export const setTabName = (arr: any) => {
  if ((arr[0] && arr[1]) || arr[1]) {
    hideComponent(false)
  } else if (arr[0]) {
    hideComponent(true)
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
