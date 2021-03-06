// import Vue from 'vue'
import Component from './index.vue'
import { common } from '../common'
// Vue.component(Component.name, Component)

export default {
  ...common,
  componentName: Component.name,
  title: '图片',
  type: 'img',
  cover: 'el-icon-picture-outline',
  nodeType: 1 << 0,
  style: {
    ...common.style,
    width: undefined,
    height: undefined
  },
  props: {
    src: ''
  }
}

export const schema = [
  {
    type: 'image',
    label: '图片地址',
    field: 'props.src',
    rules: [
    ],
    placeholder: ''
  }
]
