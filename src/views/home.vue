<template>
  <div class="flex-center bg-333" style="height: 100vh">
    <div>
      <div class="flex">
        <div class="tc">
          <p class="f40 c-fff">Butterfly</p>
          <p class="c-aaa f14 mt10">快速搭建h5 @讯盟FE</p>
        </div>
        <svg class="ml10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="67" height="20">
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
<!--        <img class="ml20" height="14px" src="https://img.shields.io/badge/-beta 0.0.1-orange" alt="">-->
      </div>
      <div class="tc mt50 pt50 flex pl30">
        <div
          class="cp c-button button--tamaya button--border-medium"
          data-text="立即开始"
          @click="$router.push('/project/list')"
        >
          <span>立即开始</span>
        </div>
        <div v-if="false" class="ml20 cp c-button button--nina" data-text="项目列表">
          <span>项</span>
          <span>目</span>
          <span>列</span>
          <span>表</span></div>
      </div>
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
@import '../style/button';
</style>
