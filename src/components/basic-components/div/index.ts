import Vue from 'vue'
import Component from './index.vue'
Vue.component(Component.name, Component)

export default {
  id: 1,
  version: '0.0.1',
  componentName: Component.name,
  title: '万能容器',
  cover: '',
  type: 'div',
  className: '',
  createdUser: {
    id: 0,
    name: 'jmingzi'
  },
  props: {
    buttonText: '立即提交'
  },
  events: [],
  style: {}
}

export const schema = [
  {
    type: 'input',
    label: '按钮',
    field: 'props.buttonText',
    rules: [
      { required: true, message: '请输入项目目录名称', trigger: 'blur' }
    ]
  }
]
