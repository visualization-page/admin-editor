import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'tcon'
import { useBasicComponents } from '@/components/basic-components'

useBasicComponents()
Vue.config.productionTip = false
Vue.prototype.$native = window.Native ? new Native() : {}
document.addEventListener('DOMContentLoaded', async () => {
  window._domloadTime = Date.now()
  console.log('DOMContentLoaded time', ((_domloadTime - window._entryTime) / 1000), '秒')
  window.globalApp = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
