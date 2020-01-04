<template>
  <div class="node-property">
    <schema-form
      v-if="detail"
      :schema="local"
      :schema-data="detail"
      @updateByField="updateNodeByField"
    />
    <div v-else class="flex-center p30">
      <p class="c-999">请选中组件</p>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentNode } from '@/assets/node'
import { updateByField } from '@/assets/util'

export default {
  components: {
    SchemaForm
  },
  setup () {
    const detail = computed(() => currentNode.value)
    return {
      local,
      detail,
      updateNodeByField (field, val) {
        updateByField(currentNode.value, field, val)
      }
    }
  }
}
</script>
