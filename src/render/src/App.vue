<template>
  <div id="app">
    <RouterView />
    <div v-if="isPc" class="pc-box__notice">
      <vue-qrcode :value="codeUrl" tag="img" :options="{ width: 150 }"/>
      <p class="f12 c-999 tc pb10">用手机扫一扫</p>
    </div>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {
    VueQrcode
  },
  data () {
    return {
      isPc: this.checkPc(true),
      codeUrl: location.href
    }
  },
  created () {
    if (this.isPc) {
      document.body.classList.add('pc-box')
    }
    // window.addEventListener('resize', () => {
    //   this.checkPc()
    // })
  },
  methods: {
    checkPc (noSign) {
      const isPc = !/android|iphone/i.test(navigator.userAgent)
      return noSign ? isPc : (this.isPc = isPc)
    }
  }
}
</script>

<style lang="less">
html, body, #app {
  height: 100%;
}
.pc-box {
  width: 450px;
  margin: 0 auto;
  transform: translateZ(0);
  &__notice {
    position: absolute;
    top: 50%;
    right: calc(50% - 400px);
    transform: translate(0, -50%);
    border: 1px #eee solid;
  }
}
</style>
