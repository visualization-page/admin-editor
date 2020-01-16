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
  props: {
    buttonText: '立即提交'
  }
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
