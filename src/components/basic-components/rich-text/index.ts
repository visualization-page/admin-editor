import Vue from 'vue'
import Component from './index.vue'
import { common } from '../common'
Vue.component(Component.name, Component)

export default {
  componentName: Component.name,
  title: '富文本',
  type: 'rich-text',
  ...common,
  style: {
    ...common.style,
    height: undefined
  },
  props: {
    content: '',
    bindState: ''
  }
}

export const schema = [
  {
    type: 'input',
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
    field: 'props.color'
  },
  {
    type: 'rich-text',
    label: '文本内容',
    block: true,
    field: 'props.content'
  }
]
