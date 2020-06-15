<template>
  <div class="page-set">
    <schema-form
      :schema="local"
      :schema-data="detail"
      @updateByField="updateProjectByField"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import { local } from './config'
import { project } from '@/assets/project'
import { updateByField, loadSdk } from '@/assets/util'

export default defineComponent({
  components: {
    SchemaForm
  },

  setup (props, ctx) {
    watch(() => ctx.root.$route.params.dir, dir => {
      // @ts-ignore
      local.find(x => x.field === 'dir').elAttrs!.disabled = !!dir
      // @ts-ignore
      // local.find(x => x.field === 'interactiveType').elAttrs!.disabled = !!dir
    })
    // 为了防止本地开发时，引入 sdk 方法报错
    watch(() => project.interactiveType, type => {
      loadSdk(type)
    }, { lazy: true })
    return {
      local,
      detail: project,
      updateProjectByField (field: string, val: any) {
        updateByField(project, field, val)
      }
    }
  }
})
</script>
