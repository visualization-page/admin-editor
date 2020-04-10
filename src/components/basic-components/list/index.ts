import Vue from 'vue'
import Component from './index.vue'
import { common } from '../common'
Vue.component(Component.name, Component)

export default {
  componentName: Component.name,
  title: '列表容器',
  cover: '',
  type: 'div',
  subType: 'list',
  ...common,
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
]
