<template>
  <div class="app__box-center absolute z2">
    <div class="app__mobile">
      <div class="app__mobile-header relative bb bd-eee">
        <img src="http://file.iming.work/85bcf0d2af175231da45.png" width="100%" alt="">
        <span class="absolute l0 b0 width-100 pb10 tc f16">
          {{ currentPage ? (currentPage.title || '请输入标题') : '未创建页面' }}
        </span>
      </div>
      <div class="app__mobile-webview"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { currentPage } from '@/assets/page'

export default createComponent({
  setup () {
    // const title = computed(() => currentPage.value && currentPage.value.title)
    return {
      currentPage
    }
  }
})
</script>
