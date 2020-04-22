<template>
  <div class="avatar flex-center c-aaa" :class="[userName ? 'circle' : 'ml20']">
    <div class="avatar-img relative c-fff flex-center" overflow-h >
      {{ name.substr(-2) }}
      <div class="absolute t0 l0 b0 r0" :style="{ background: `url(${avatar}) center / cover no-repeat` }" />
    </div>
    <p v-if="userName" class="ml10">{{ name }}</p>
  </div>
</template>

<script>
export default {
  props: {
    userName: String,
    userId: [String, Number]
  },
  data () {
    return {
      avatar: process.env.VUE_APP_AVATAR + (this.userId || this.$native.uid),
      name: this.userName || this.$native.name
    }
  }
}
</script>

<style lang="less">
  .avatar-img {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    background-color: #488ff9;
  }
  .avatar.circle {
    .avatar-img {
      // border-radius: 50%;
    }
  }
</style>
