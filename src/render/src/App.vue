<template>
  <div v-if="isPc" class="pc-box height-100">
    <div class="height-100 relative" overflow-a>
      <router-view />
    </div>
    <div class="pc-box__notice">
      <vue-qrcode :value="codeUrl" tag="img" :options="{ width: 150 }"/>
      <p class="f12 c-999 tc pb10">用手机扫一扫</p>
    </div>
  </div>
  <div v-else id="app" class="oa">
    <router-view />
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
  methods: {
    checkPc (noSign) {
      const isPc = !/android|iphone|ipad/i.test(navigator.userAgent)
      return noSign ? isPc : (this.isPc = isPc)
    }
  }
}
</script>

<style lang="less">
@import '../../style/hack-vant-form.less';
@import '~esc-ui/lib/button/index.css';
@import '~esc-ui/lib/page-button/index.css';
html, body, #app {
  height: 100%;
}
.pc-box {
  width: 375px;
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
