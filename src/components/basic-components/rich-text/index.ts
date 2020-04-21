// import Vue from 'vue'
import Component from './index.vue'
import { common } from '../common'
// Vue.component(Component.name, Component)

export default {
  ...common,
  componentName: Component.name,
  title: '富文本',
  type: 'rich-text',
  cover: 'el-icon-edit-outline',
  style: {
    ...common.style,
    height: undefined,
    width: undefined
  },
  props: {
    content: '',
    bindState: ''
  }
}

export const schema = [
  {
    type: 'textarea',
    label: '文本绑定',
    field: 'props.bindState'
  },
  {
    type: 'input',
    label: '文本大小',
    field: 'props.fontSize'
  },
  {
    type: 'color',
    label: '文本颜色',
    field: 'props.color',
    props: {
      'show-alpha': true
    }
  },
  {
    type: 'rich-text',
    label: '文本内容',
    block: true,
    field: 'props.content'
  }
]
