<template>
  <div class="render" v-if="currentPage">
    <render-item
      :nodes="currentPage.nodes"
    />
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import RenderItem from './render-item.vue'

export default createComponent({
  components: {
    RenderItem
  },
  setup () {
    return {
      currentPage
    }
  }
})
</script>
