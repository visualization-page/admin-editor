// import Vue from 'vue'
import Component from './index.vue'
import { common } from '../common'
// Vue.component(Component.name, Component)

export default {
  ...common,
  componentName: Component.name,
  title: '万能容器',
  cover: 'el-icon-folder-opened',
  type: 'div',
  style: {
    ...common.style,
    height: undefined
  }
}

export const schema = [
]
