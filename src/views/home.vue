<template>
  <div class="flex-center bg-333" style="height: 100vh">
    <div style="margin-top: -100px">
      <div class="flex relative">
        <div class="tc" v-if="false">
          <p class="c-fff" style="font-size: 50px">Butterfly</p>
        </div>
        <div class="tc">
          <img src="../assets/img/logo_home.png" alt="" width="380px">
          <p class="c-999 f14 mt10">产品运营也能用的 H5 在线开发平台</p>
        </div>
        <svg v-if="false" class="ml10 absolute t0" style="right: -50px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="67" height="20">
          <linearGradient id="b" x2="0" y2="100%">
            <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
            <stop offset="1" stop-opacity=".1"/>
          </linearGradient>
          <clipPath id="a">
            <rect width="67" height="20" rx="3" fill="#fff"/>
          </clipPath>
          <g clip-path="url(#a)">
            <path fill="#fe7d37" d="M0 0h0v20H0z"/>
            <path fill="#fe7d37" d="M0 0h67v20H0z"/>
            <path fill="url(#b)" d="M0 0h67v20H0z"/>
          </g>
          <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">
            <text x="335" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="570">
              {{ $version }}
            </text>
            <text x="335" y="140" transform="scale(.1)" textLength="570">
              {{ $version }}
            </text>
          </g>
        </svg>
      </div>
      <div class="tc mt50">
        <div
          class="dib f12 c-fff ptb10 plr20 br4 cp"
          :style="{ background: 'linear-gradient(90deg, #ff7d00 20%, #ffb400)' }"
          @click="$router.push('/project/list')"
        >立即体验</div>
      </div>
      <div v-if="false" class="tc mt50 pt50 flex-center">
        <div
          class="cp c-button button--tamaya button--border-medium"
          data-text="立即体验"
          @click="$router.push('/project/list')"
        >
          <span>立即体验</span>
        </div>
        <div v-if="false" class="ml20 cp c-button button--nina" data-text="项目列表">
          <span>项</span>
          <span>目</span>
          <span>列</span>
          <span>表</span></div>
      </div>
    </div>

    <div class="fixed width-100 tc b10">
      <p class="c-666 f12 mt10">Designed by 讯盟FE - 前端运营商组 <br> 特别鸣谢 UI - 智慧城市业务组</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {
  }
}
</script>

<style lang="less">
// @import '../style/button';
</style>
