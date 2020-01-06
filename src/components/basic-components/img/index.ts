import Vue from 'vue'
import Component from './index.vue'
Vue.component(Component.name, Component)

export default {
  id: 2,
  version: '0.0.1',
  componentName: Component.name,
  title: '图片',
  type: 'img',
  cover: '',
  createdUser: {
    id: 0,
    name: 'jmingzi'
  },
  events: []
}
