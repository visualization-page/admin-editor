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
  created () {
    if (this.isPc) {
      console.log('\n\n%cButterfly\n\n%c产品运营也能用的 H5 在线开发平台 !\n\n支持:\n  1.小程序\n  2.彩云 native h5\n  3.复杂表单\n  4.一键发布等\n没有做不到只有想不到！\n\n%c👋 立即体验: https://tms.uban360.com/butterfly-fe/index.html\n\n', 'font-weight:bolder;color:rgb(253,129,36)', 'color: rgba(253,129,36,0.5)', 'color:#3b8ff6')
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
