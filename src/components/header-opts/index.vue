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
        <span>教程</span>
      </div>
      <div class="editor-v2__line" />
      <div class="editor-v2__header-item" @click="handleBug">
        <span>吐槽</span>
      </div>
      <div class="editor-v2__line" />
      <div class="editor-v2__header-item" @click="changeMode">
        <span v-if="isDev">极简版</span>
        <span v-else>开发版</span>
        <i class="el-icon-caret-bottom" />
      </div>
    </div>
    <div class="flex-center-align">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
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
      window.open('./render.html#/project/butterfly-about')
    },
    handleTourism () {
      window.open('https://docs.uban360.com/#/project-detail/17/18')
    },
    handleBug () {
      this.$router.push('/suggest')
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
