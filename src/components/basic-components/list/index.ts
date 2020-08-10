// import Vue from 'vue'
import Component from './index.vue'
import { common } from '../common'
// import {currentNode} from "@/assets/node";
// Vue.component(Component.name, Component)

export default {
  ...common,
  componentName: Component.name,
  title: '列表容器',
  cover: 'el-icon-s-fold',
  type: 'div',
  subType: 'list',
  nodeType: 1 << 0,
  style: {
    ...common.style,
    width: undefined,
    height: undefined,
    borderRadius: undefined,
    backgroundColor: undefined
  },
  bindState: ''
}

export const schema = [
  {
    label: '绑定状态',
    field: 'bindState',
    type: 'input-bind',
    elAttrs: {
      placeholder: '请输入'
    },
    model: 'blur',
    // relationCallback: (schema: any) => {
    //   return schema.label === '绑定状态' && currentNode.value && currentNode.value.subType === 'list'
    // },
    'info-icon': 'el-icon-warning-outline',
    info: '列表容器可以绑定视图模型，$$page.state.test，绑定后在列表容器的子节点中可以使用 $$listBind.item 获取遍历元素， $$listBind.index 获取遍历索引'
  }
]
