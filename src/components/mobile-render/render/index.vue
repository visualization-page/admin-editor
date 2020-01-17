<template>
  <render-item
    v-if="currentPage"
    :nodes="deepClone(currentPage.nodes)"
  />
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { deepClone } from '@/assets/util'
import RenderItem from './render-item.vue'

export default createComponent({
  components: {
    RenderItem
  },
  setup () {
    return {
      currentPage,
      deepClone
    }
  }
})
</script>
