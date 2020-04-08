import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// @ts-ignore
import Native from '@xm/native'
import './plugins/element'
import 'tcon'
import { MessageBox, Message } from 'element-ui'
import { http } from '@/api'

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
  new Vue({
    render: h => h('p', { class: 'tc pt50 mt50 f32 c-999' }, ['登录中...']),
    mounted () {
      this.showLogin()
    },
    methods: {
      showLogin () {
        MessageBox.prompt(
          '请输入【手机号/密码】，密码不填默认是a1234567',
          '测试环境web版登录',
          {
            inputValue: localStorage.getItem('local-login') || ''
          }
        ).then(({ value }: any) => {
          const arr = value.split('/')
          if (/^1\d{10}$/.test(arr[0])) {
            const password = arr[1] || 'a1234567'
            http.post('login/login', {
              mobile: value,
              password,
              url: 'http://web.jituancaiyun.net/access/IMLogin/webCypherLogin'
            }, { notify: false }).then(res => {
              localStorage.setItem('local-login', value)
              Message.success('登录成功')
              document.cookie = `userName=${encodeURIComponent(res.data.name)}; path=/; domain= .jituancaiyun.net`
              setTimeout(() => {
                location.reload()
              }, 1000)
            }).catch(() => {
              localStorage.setItem('local-login', value)
              Message.error('手机号或密码不正确')
            })
          } else {
            Message.error('请输入正确的手机号')
          }
        })
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
