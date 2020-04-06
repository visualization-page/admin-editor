<template>
  <div class="flex-center bg-333" style="height: 100vh">
    <div>
      <div class="flex">
        <div class="tc">
          <p class="f40 c-fff">Butterfly</p>
          <p class="c-aaa f14 mt10">快速搭建h5 @讯盟FE</p>
        </div>
        <img class="ml20" height="14px" src="https://img.shields.io/badge/-beta 0.0.1-orange" alt="">
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
@import '../button';
</style>
