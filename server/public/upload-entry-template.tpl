import Vue from 'vue'
import Component from '{{entryVue}}'
import { common } from '@/assets/node.ts'
Vue.component(Component.name, Component)

export default {
  ...common,
  ...{{props}}
}

export const schema = {{schema}}
