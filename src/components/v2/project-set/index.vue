<template>
  <schema-form
    :schema="schema"
    :schema-data="project"
    @updateByField="updateProjectByField"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import SchemaForm from '../../schema/index.vue'
import { project } from '@/assets/project'
import { updateByField } from '@/assets/util'

export default defineComponent({
  components: {
    SchemaForm
  },

  props: {
    schema: Array
  },

  setup (props) {
    return {
      project,
      schema: props.schema,
      updateProjectByField (field: string, val: any) {
        updateByField(project, field, val)
      }
    }
  }
})
</script>
