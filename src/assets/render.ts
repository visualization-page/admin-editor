import Vue from 'vue'
import Composition, { reactive, ref, watch } from '@vue/composition-api'
Vue.use(Composition)

export const renderStatus = ref(0) // 0 编辑中 1 预览
export const isEdit = () => renderStatus.value === 0
export const setRenderEdit = () => {
  renderStatus.value = 0
}
export const setRenderPreview = () => {
  renderStatus.value = 1
}
