import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// @ts-ignore
import Native from '@xm/native'
import './plugins/element'
import 'tcon'
import { MessageBox } from 'element-ui'

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
const native = Vue.prototype.$native = new Native()
native.name = native.cookie('userName')

if (!native.name) {
  let doReload = false
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      if (doReload) {
        MessageBox.close()
      }
    } else {
      location.reload()
    }
  })
  new Vue({
    render: h => h('p', { class: 'tc pt50 mt50 f32 c-999' }, ['登录中...']),
    mounted () {
      this.showLogin()
    },
    methods: {
      showLogin () {
        MessageBox.alert('当前状态未登录，即将跳转 web 版彩云选择一家企业登录').then(() => {
          doReload = true
          window.open(`//web.jituancaiyun.${location.protocol === 'https:' ? 'com' : 'net'}`)
        }).catch(this.showLogin)
      }
    }
  }).$mount('#app')
} else {
  document.addEventListener('DOMContentLoaded', () => {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}
