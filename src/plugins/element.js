import Vue from 'vue'
import { Button, Tabs, TabPane } from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 }
Vue.use(Button)
  .use(Tabs)
  .use(TabPane)
