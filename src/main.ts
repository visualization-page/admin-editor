import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Native from '@xm/native'
import './plugins/element'
import 'tcon'
import './style/app.less'
import Login from './views/login.vue'
import { http } from './api'

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
    readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] }
  }
}

declare global {
  interface Window {
    require: () => void
    globalApp: any
    vant: {
      Toast: (msg: string) => void
    }
    [k: string]: any
    // $$global: {
    //   constant: any
    //   state: any
    //   getNodeProperty?: (id: string, property: string) => any
    //   setNodeProperty?: (id: string, property: string, val: unknown) => any
    // }
  }
}

Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
  console.log(err, vm, info)
}
const native = Vue.prototype.$native = new Native()

if (!native.cookie('sso_u')) {
  new Vue({
    render: h => h(Login)
  }).$mount('#app')
} else {
  http.get('login/user').then(res => {
    native.name = res.data.name_
    native.uid = res.data.uid_
    window.globalApp = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
  // document.addEventListener('DOMContentLoaded', () => {
  // })
}
