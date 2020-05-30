import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'tcon'
import './style/app.less'
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
    Native: any
  }
}

Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
  console.log(err, vm, info)
}
const nativeInstance = Vue.prototype.$native = new window.Native()
Vue.prototype.$version = process.env.VUE_APP_VERSION

if (!nativeInstance.cookie('sso_u')) {
  // new Vue({
  //   render: h => h(Login)
  // }).$mount('#app')
  location.href = `${process.env.VUE_APP_SSO}${location.href}`
} else {
  http.get('login/user').then(res => {
    nativeInstance.name = res.data.name_
    nativeInstance.uid = res.data.uid_
    window.globalApp = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}
