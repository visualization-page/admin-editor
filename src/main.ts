import Vue from 'vue'
// import Composition from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import 'tcon'
import { initProject } from '@/assets/project'

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
    readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] }
  }
}

declare global {
  interface Window {
    require: () => void
    $$global: {
      constant: any
      state: any
    }
    $$system: {
      getNodeProperty: (id: string, property: string) => any
      setNodeProperty: (id: string, property: string, val: unknown) => any
    }
    getConstant: (key: string) => string
  }
}

Vue.config.productionTip = false
initProject()
document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
