import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// @ts-ignore
import Native from '@xm/native'
import './plugins/element'
import 'tcon'
import { initProject } from '@/assets/project'

const native = Vue.prototype.$native = new Native()
if (!native.uid) {
  location.href = `//admin.jituancaiyun.${location.protocol === 'https:' ? 'com' : 'net'}/power/user/view/login.html?referPageUrl=${decodeURIComponent(location.href)}`
} else {
  native.name = native.cookie('userName')
}

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
    readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] }
  }
}

declare global {
  interface Window {
    require: () => void
    // $$global: {
    //   constant: any
    //   state: any
    //   getNodeProperty?: (id: string, property: string) => any
    //   setNodeProperty?: (id: string, property: string, val: unknown) => any
    // }
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
