import Vue from 'vue'
import Component from './index.vue'
import common from '../common-config'
Vue.component(Component.name, Component)

export default {
  componentName: Component.name,
  title: '富文本',
  type: 'rich-text',
  ...common,
  style: {
    ...common.style,
    height: '100px'
  },
  props: {
    content: '富文本'
  }
}

export const schema = [
  {
    type: 'rich-text',
    label: '文本内容',
    block: true,
    field: 'props.content'
  }
]
