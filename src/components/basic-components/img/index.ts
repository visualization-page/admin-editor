import Vue from 'vue'
import Component from './index.vue'
import common from '../common-config'
Vue.component(Component.name, Component)

export default {
  componentName: Component.name,
  title: '图片',
  type: 'img',
  ...common,
  props: {
    width: '',
    height: ''
  }
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
