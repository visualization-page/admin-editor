import Vue from 'vue'
import Composition from '@vue/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import 'tcon'

Vue.config.productionTip = false
Vue.use(Composition)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
