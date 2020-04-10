<template>
  <div class="page-set">
    <div class="flex-center p30" v-if="false && !isEdit()">
      <p class="c-999">请切换为编辑模式</p>
    </div>
    <template v-else-if="showSchema">
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
import { createComponent, computed, watch } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentPage, delPage } from '@/assets/page'
import { updateByField } from '@/assets/util'
import { MessageBox } from 'element-ui'
import { isEdit } from '@/assets/render'
import { project } from '@/assets/project'

export default createComponent({
  components: {
    SchemaForm
  },
  setup () {
    const showSchema = computed(() => !!currentPage.value)
    watch(() => currentPage.value, page => {
      if (page && !page.url) {
        page.url = process.env.VUE_APP_MOBILE + `#/page/${project.dir}/${currentPage.value.id}`
      }
    })
    return {
      local,
      isEdit,
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
