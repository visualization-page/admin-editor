import Vue from 'vue'
import {
  Button,
  Tabs,
  TabPane,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Checkbox,
  Dialog,
  Tree
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 }
Vue.use(Button)
  .use(Tabs)
  .use(TabPane)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Select)
  .use(Option)
  .use(Checkbox)
  .use(Dialog)
  .use(Tree)
