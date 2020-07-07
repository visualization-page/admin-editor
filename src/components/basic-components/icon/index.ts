import Component from './index.vue'
import { common } from '../common'

export default {
  ...common,
  componentName: Component.name,
  title: 'iconfont',
  type: 'icon',
  cover: 'el-icon-brush',
  style: {
    ...common.style,
    width: '100%',
    height: undefined
  },
  props: {
    icon: ''
  }
}

export const schema = [
  {
    type: 'input',
    label: 'icon',
    field: 'props.icon',
    rules: [
    ],
    placeholder: '',
    model: 'blur'
  }
]
