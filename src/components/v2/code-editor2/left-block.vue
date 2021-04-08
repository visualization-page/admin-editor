<template>
  <div class="left-block">
    <div class="flex-center-between">
      <p class="title f12 c-666">{{ title }}</p>
      <div class="title-right cp" style="color: #ff7d00" ref="right" @click="handleClick">
        <slot name="right" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: ['title'],

  data () {
    return {
      timer: 0
    }
  },

  methods: {
    handleClick () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      const _d = (isSet) => {
        const ref = this.$refs.right.style
        if (isSet) {
          ref.transition = 'all .3s linear'
          ref.transform = 'rotate(360deg)'
        } else {
          ref.transition = ''
          ref.transform = ''
        }
      }
      _d(true)
      this.timer = setTimeout(() => { _d(false) }, 300)
      this.$emit('on-refresh')
    }
  }
}
</script>

<style lang="less" scoped>
.left-block {
  .title {
    position: relative;
    padding: 10px 0;
    &:before {
      display: block;
      content: '';
      position: absolute;
      left: -8px;
      top: 12px;
      width: 2px;
      height: 12px;
      background-color: rgba(#ff7d00, .7);
    }
  }
  .title-right {
    // transition: all .3s linear;
  }
}
</style>
