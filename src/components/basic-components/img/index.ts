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
  className: '',
  createdUser: {
    id: 0,
    name: 'jmingzi'
  },
  events: [],
  props: {
    width: '',
    height: ''
  },
  style: {}
}

export const schema = [
  {
    type: 'input',
    label: '宽度',
    field: 'props.width',
    rules: [
    ],
    placeholder: '例如 100px，不填为 auto'
  },
  {
    type: 'input',
    label: '高度',
    field: 'props.height',
    rules: [
    ],
    placeholder: '例如 100px，不填为 auto'
  }
]
