import Vue from 'vue'
import Component from './index.vue'
import { common } from '@/assets/node.ts'
Vue.component(Component.name, Component)

export default {
  componentName: Component.name,
  title: '按钮',
  cover: '',
  type: 'button',
  ...common,
  style: {
    ...common.style,
    width: undefined,
    height: '45px',
    borderRadius: '4px',
    backgroundColor: '#999999',
    margin: {
      left: '30px',
      right: '30px'
    }
  },
  props: {
    buttonText: '立即提交',
    fontSize: '14px',
    color: '#ffffff'
  }
}

export const schema = [
  {
    type: 'input',
    label: '文案',
    field: 'props.buttonText',
    rules: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  },
  {
    type: 'unit-size',
    label: '字体大小',
    noAuto: true,
    field: 'props.fontSize',
    rules: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  },
  {
    type: 'color',
    label: '字体颜色',
    field: 'props.color'
  }
]
