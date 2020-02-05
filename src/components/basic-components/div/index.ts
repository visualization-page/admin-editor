import Vue from 'vue'
import Component from './index.vue'
import common from '../common-config'
Vue.component(Component.name, Component)

export default {
  componentName: Component.name,
  title: '万能容器',
  cover: '',
  type: 'div',
  ...common,
  style: {
    ...common.style,
    height: undefined
  }
}

export const schema = [
]
