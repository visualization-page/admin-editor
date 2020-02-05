<template>
  <div class="app__box-center absolute z2">
    <div class="app__mobile">
      <div class="app__mobile-header relative bb bd-eee">
        <img src="http://file.iming.work/85bcf0d2af175231da45.png" width="100%" alt="">
        <span class="absolute l0 b0 width-100 pb10 tc f16">
          {{ currentPage ? (currentPage.title || '请输入标题') : '未创建页面' }}
        </span>
      </div>
      <div class="app__mobile-webview relative">
        <div class="app__mobile-webview-mock">
          <render />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import Render from './render/index.vue'

export default createComponent({
  components: {
    Render
  },

  setup () {
    // const title = computed(() => currentPage.value && currentPage.value.title)
    return {
      currentPage
    }
  }
})
</script>

<style lang="less">
.app__mobile {
  user-select: none;
}
.app__box-center {
  width: 320px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .app__mobile {
    width: 100%;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,.1);
    &-header {
    }
    &-webview {
      height: 480px;
      background-color: #eee;
      margin: 0 -10px;
      padding: 0 10px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
      &-mock {
        min-height: 100%;
        background-color: #fff;
        transform: translate3d(0, 0, 0);
        box-shadow: 0 4px 10px 0 rgba(0,0,0,.1);
      }
    }
  }
}
</style>
