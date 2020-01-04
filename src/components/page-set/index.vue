<template>
  <div class="page-set">
    <schema-form
      v-if="showSchema"
      :schema="local"
      :schema-data="detail"
      @updateByField="updatePageByField"
    />
    <div v-else class="flex-center p30">
      <p class="c-999">请新建页面</p>
    </div>
  </div>
</template>

<script>
import { createComponent, computed } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentPage } from '@/assets/page'
import { updateByField } from '@/assets/util'

export default createComponent({
  components: {
    SchemaForm
  },
  setup () {
    const showSchema = computed(() => !!currentPage.value)
    return {
      local,
      showSchema,
      detail: currentPage,
      updatePageByField (field, val) {
        updateByField(currentPage.value, field, val)
      }
    }
  }
})
</script>

<style lang="less">

</style>
