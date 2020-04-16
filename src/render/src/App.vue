<template>
  <div id="app" :style="{ overflow: isPc && 'auto' }">
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
@import '../../hack-vant-form.less';
@import '~esc-ui/lib/button/index.css';
@import '~esc-ui/lib/page-button/index.css';
html, body, #app {
  height: 100%;
}
.pc-box {
  width: 450px;
  margin: 0 auto;
  transform: translateZ(0);
  &__notice {
    position: absolute;
    top: 100px;
    right: calc(50% - 400px);
    // transform: translateX(0, -50%);
    border: 1px #eee solid;
  }
}
</style>
