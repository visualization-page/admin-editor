<template>
  <div class="header-opt bg-333 height-100 flex-center-between pr20 f14">
    <div class="flex items-center">
      <img class="cp" height="60px" src="@/assets/img/logo_home.png" alt="" @click="$router.push('/')">
      <div class="editor-v2__line" />
      <div class="editor-v2__header-item" @click="handleAbout">
        <span>关于</span>
      </div>
      <div class="editor-v2__line" />
      <div class="editor-v2__header-item" @click="handleTourism">
        <span>场景案例</span>
      </div>
      <div class="editor-v2__line" />
      <div class="editor-v2__header-item" @click="handleSystemConfig">
        <span>系统配置</span>
      </div>
      <div class="editor-v2__line" />
      <div class="editor-v2__header-item" @click="$router.push('/mock')">
        <span>Mock 服务</span>
      </div>
      <div v-if="false" class="editor-v2__line" />
      <div v-if="false" class="editor-v2__header-item" @click="handleBug">
        <span>吐槽</span>
      </div>
      <div v-if="false" class="editor-v2__line" />
      <div v-if="false" class="editor-v2__header-item" @click="changeMode">
        <span v-if="isDev">极简版</span>
        <span v-else>开发版</span>
        <i class="el-icon-caret-bottom" />
      </div>
    </div>
    <div class="flex-center-align">
      <slot />
    </div>

    <code-editor />
  </div>
</template>

<script>
import { currentCode, setCodeState } from '@/assets/code-edit'
import { parseCodeValid } from '@/assets/util'
import CodeEditor from '@/components/v2/code-editor'
import { http } from '@/api'

export default {
  components: {
    CodeEditor
  },
  data () {
    return {
      mode: localStorage.getItem('butterfly-mode')
    }
  },
  computed: {
    isDev () {
      return this.mode === 'normal'
    }
  },
  methods: {
    changeMode () {
      let mode = 'normal'
      if (this.mode === 'normal') {
        mode = 'sample'
      }
      this.mode = mode
      this.$parent.isDev = mode === 'normal'
      localStorage.setItem('butterfly-mode', mode)
    },
    handleAbout () {
      window.open('https://docshare.uban360.com/share/897d1a604368484d6499b54085481569?documentId=44')
    },
    handleTourism () {
      window.open('https://docshare.uban360.com/share/897d1a604368484d6499b54085481569')
    },
    handleBug () {
      this.$router.push('/suggest')
    },
    handleSystemConfig () {
      const config = JSON.stringify(this.$system, null, 2)
      const prefix = '$$global.export = '
      setCodeState('系统配置', prefix + config, code => {
        const check = parseCodeValid(code)
        if (check.ok) {
          // 保存并更新
          http.post('system', { data: JSON.stringify(check.value), name: this.$native.name }).then(() => {
            this.$system = check.value
          })
        } else {
          window.globalApp.$notify({
            title: '错误',
            message: `${currentCode.title}存在语法错误，请检查`,
            type: 'error',
            duration: 2000,
            position: 'top-left'
          })
        }
        return check.ok
      })
    }
  }
}
</script>

<style lang="less">
.header-opt {
  &__line {
    width: 2px;
    height: 16px;
    // background: #999;
    /*margin: 0 10px;*/
  }
  &__btn {
    color: #999;
    &:hover {
      color: #ff7d00;
    }
  }
}
</style>
