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
import { defineComponent } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import { local } from './config'
import { project } from '@/assets/project'
import { updateByField } from '@/assets/util'

export default defineComponent({
  components: {
    SchemaForm
  },

  setup (props, ctx) {
    local[1].elAttrs!.disabled = !!ctx.root.$route.params.dir
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
