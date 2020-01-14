import Vue from 'vue'
import Composition from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import 'tcon'

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
    readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] }
  }
}

declare global {
  interface Window {
    require: () => void
  }
}

Vue.config.productionTip = false
Vue.use(Composition)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
