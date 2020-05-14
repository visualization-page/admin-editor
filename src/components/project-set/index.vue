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
import { updateByField } from '@/assets/util'

export default defineComponent({
  components: {
    SchemaForm
  },

  setup (props, ctx) {
    watch(() => ctx.root.$route.params.dir, dir => {
      // @ts-ignore
      local.find(x => x.field === 'dir').elAttrs!.disabled = !!dir
      // @ts-ignore
      local.find(x => x.field === 'interactiveType').elAttrs!.disabled = !!dir
    })
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
