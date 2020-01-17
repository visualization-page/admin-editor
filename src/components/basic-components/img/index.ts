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
    src: ''
  }
}

export const schema = [
  {
    type: 'input',
    label: '图片地址',
    field: 'props.src',
    rules: [
    ],
    placeholder: ''
  }
]
