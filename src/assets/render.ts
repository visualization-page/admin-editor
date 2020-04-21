import { ref, reactive } from '@vue/composition-api'
import { NodeItem } from './node'

export const renderStatus = ref(0) // 0 编辑中 1 预览
export const isEdit = () => renderStatus.value === 0
export const setRenderEdit = () => {
  renderStatus.value = 0
}
export const setRenderPreview = () => {
  renderStatus.value = 1
}

export type WrapState = {
  nodeItem: NodeItem | null
  style: {
    top: number
    left: number
    width: number
    height: number
    [k: string]: number
  } | null
}
export const editWrapState = reactive<WrapState>({
  nodeItem: null,
  style: null
})
export const setEditWrapState = (item: NodeItem, style: WrapState['style']) => {
  editWrapState.nodeItem = item
  editWrapState.style = style
}
export const editNode = ref(null)
export const setEditWrapNode = (el: any) => {
  editNode.value = el
}
export const updateEditWrapStyle = (field: string, val: number) => {
  if (editWrapState.style) {
    editWrapState.style[field] = val
  }
}

export const editWrapCacheNode: {
  [k: string]: any
} = {} // id => element
export const clearEditWrapCacheNode = () => {
  Object.keys(editWrapCacheNode).forEach(k => {
    editWrapCacheNode[k] = undefined
  })
}
