import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Native from '@xm/native'
import 'tcon'
import { useBasicComponents } from '@/components/basic-components'

useBasicComponents()

window.ELEMENT = {
  Message () {},
  MessageBox () {}
}

Vue.config.productionTip = false
Vue.prototype.$native = new Native()
window.globalApp = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
