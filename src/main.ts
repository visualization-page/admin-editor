import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'tcon'
import './style/app.less'
import { http } from './api'
import logs from './changelog'
import { MessageBox, Notification } from 'element-ui'
import { parseCodeValid } from './assets/util'

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
    Native: any
    [k: string]: any
  }
}

Vue.config.productionTip = false
Vue.config.errorHandler = function (err, vm, info) {
  console.log(err, vm, info)
}
const nativeInstance = Vue.prototype.$native = new window.Native()
Vue.prototype.$version = process.env.VUE_APP_VERSION
Vue.prototype.$notice = (content: string, error: boolean) => {
  if (!error) {
    Notification({
      title: '成功',
      type: 'success',
      message: content,
      position: 'top-left',
      duration: 2000
    })
  } else {
    Notification({
      title: '错误',
      type: 'error',
      message: content,
      position: 'top-left',
      duration: 2000
    })
  }
}

if (!nativeInstance.cookie('sso_u')) {
  location.href = `${process.env.VUE_APP_SSO}${location.href}`
} else {
  Promise.all([
    http.get('login/user'),
    http.get('system')
  ]).then(([res, config]) => {
    Vue.prototype.$system = parseCodeValid(`$$global.export = ${config.data}`).value
    nativeInstance.name = res.data.name_
    nativeInstance.uid = res.data.uid_
    window.globalApp = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  })
}

// 更新提示
const log: string[] = (logs as { [k: string]: string[] })[process.env.VUE_APP_VERSION]
if (log) {
  const key = 'butterfly-update'
  const localVersion = localStorage.getItem(key)
  if (!localVersion || localVersion !== process.env.VUE_APP_VERSION) {
    const h = window.vueCompositionApi.createElement
    MessageBox({
      title: '更新提示',
      message: h('div', null, [
        h('p', null, '🧨 有更新啦！'),
        h('ul', { style: { 'list-style': 'decimal', 'padding-left': '2em' } }, log.map(s => h('li', null, s)))
      ]),
      confirmButtonText: '我知道了',
      beforeClose (_1, _2, done) {
        localStorage.setItem(key, process.env.VUE_APP_VERSION)
        done()
      }
    })
  }
}
