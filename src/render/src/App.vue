<template>
  <div
    v-if="inAdminPlatform"
    class="pc-box height-100"
    :style="{ width: projectData.config.vwBase + 'px' }"
  >
    <div class="height-100 relative" overflow-a>
      <router-view />
    </div>
    <div v-if="showCode" class="pc-box__notice">
      <vue-qrcode :value="codeUrl" tag="img" :options="{ width: 150 }"/>
      <p class="f12 c-999 tc pb10" v-html="isMp ? '用支持讯盟小程序<br>的App扫一扫' : '用手机扫一扫'" />
    </div>
  </div>
  <div v-else id="app">
    <router-view />
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { project } from '@/assets/project'
import { watch } from '@vue/composition-api'
import { isPc } from '@/components/mobile-render/render/utils'
import { inAdminPlatform } from '@/assets/util'

export default {
  components: {
    VueQrcode
  },
  data () {
    return {
      isMp: false,
      inAdminPlatform
    }
  },
  computed: {
    projectData () {
      return window.globalProject ? window.globalProject.project : project
    },

    showCode () {
      if (window.globalProject) {
        return window.globalProject.project.config.previewQrcode !== false
      }
      if (project.dir === this.$route.params.dir) {
        return project.config.previewQrcode !== false
      }
      return false
    },

    codeUrl () {
      const navColor = project.config.navColor
      return this.isMp ? JSON.stringify({
        data: {
          url: navColor
            ? location.href.replace('render.html', 'render.html?navibar=h5&navibarColor=' + navColor.substr(1))
            : location.href,
          appId: -10000
        },
        target: 'smallApp',
        isExperienceVersion: true
      }) : location.href
    }
  },

  created () {
    watch(() => project.interactiveType, type => {
      this.isMp = type === 'xmmp'
    }, { lazy: true, deep: false })
    watch(() => project.config.navColor, val => {
      const h = val ? 'initial' : ''
      document.documentElement.style.height = h
      document.body.style.height = h
    })
    if (isPc) {
      console.log('\n\n%cButterfly\n\n%c产品运营也能用的 H5 在线开发平台 !\n\n支持:\n  1.讯盟小程序\n  2.彩云 native h5\n  3.复杂表单\n  4.一键发布等\n\n%c👋 立即体验: https://tms.uban360.com/butterfly-fe/index.html\n\n', 'font-weight:bolder;color:rgb(253,129,36)', 'color: rgba(253,129,36,0.5)', 'color:#3b8ff6')
    }
  },

  methods: {
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
