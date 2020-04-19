<template>
  <div class="login">
    <div class="app-header">
      <header-opt
        :opts="[]"
      >
        <span class="c-fff">未登录</span>
      </header-opt>
    </div>
    <div class="tc" style="padding-top: 150px">
      <div>
        <p class="f18 c-666 mb10">抱歉，您未登录</p>
        <p class="c-999 flex-center">
          请先登录
          <a class="ml10" :href="url" target="_blank">{{ url }}</a>
          <span class="mlr10">|</span>
          <el-button type="text" @click="reload">刷新</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import HeaderOpt from '@/components/header-opts'

export default {
  components: {
    HeaderOpt
  },
  setup () {
    document.addEventListener('visibilitychange', () => {
      if (
        document.visibilityState === 'visible' &&
        Vue.prototype.$native.cookie('userName')
      ) {
        location.reload()
      }
    })
    return {
      url: location.protocol === 'https:' ? 'https://web.jituancaiyun.com' : 'http://web.jituancaiyun.net',
      reload () {
        location.reload()
      }
    }
  },
  methods: {
    // showLogin () {
    //   MessageBox.prompt(
    //     '请输入【手机号/密码】，密码不填默认是a1234567',
    //     '测试环境web版登录',
    //     {
    //       inputValue: localStorage.getItem('local-login') || '',
    //       inputPlaceholder: '例如：18358185826/a1234567'
    //     }
    //   ).then(({ value }: any) => {
    //     const arr = value.split('/')
    //     if (/^1\d{10}$/.test(arr[0])) {
    //       const password = arr[1] || 'a1234567'
    //       http.post('login/login', {
    //         mobile: arr[0],
    //         password
    //       }, { notify: false }).then(res => {
    //         localStorage.setItem('local-login', value)
    //         Message.success('登录成功')
    //         document.cookie = `userName=${encodeURIComponent(res.data.name)}; path=/; domain= .jituancaiyun.net`
    //         setTimeout(() => {
    //           location.reload()
    //         }, 1000)
    //       }).catch(() => {
    //         localStorage.setItem('local-login', value)
    //         Message.error('手机号或密码不正确')
    //       })
    //     } else {
    //       Message.error('请输入正确的手机号')
    //     }
    //   }).catch(() => {
    //     this.showLogin()
    //   })
    // }
  }
}
</script>
