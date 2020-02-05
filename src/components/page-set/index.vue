<template>
  <div class="page-set">
    <template v-if="showSchema">
      <schema-form
        :schema="local"
        :schema-data="currentPage"
        from="page"
        @updateByField="updatePageByField"
      />
      <div class="tc">
        <el-button class="width-100" type="danger" @click="handleDel">删除页面</el-button>
      </div>
    </template>
    <div v-else class="flex-center p30">
      <p class="c-999">请新建页面</p>
    </div>
  </div>
</template>

<script>
import { createComponent, computed } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentPage, delPage } from '@/assets/page'
import { updateByField } from '@/assets/util'
import { MessageBox } from 'element-ui'

export default createComponent({
  components: {
    SchemaForm
  },
  setup () {
    const showSchema = computed(() => !!currentPage.value)
    return {
      local,
      showSchema,
      currentPage,
      updatePageByField (field, val) {
        updateByField(currentPage.value, field, val)
      },
      async handleDel () {
        await MessageBox.confirm('确定要删除页面吗')
        delPage({ pageId: currentPage.value.id })
      }
    }
  }
})
</script>

<style lang="less">

</style>
