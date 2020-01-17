<template>
  <div class="node-style">
    <schema-form
      v-if="currentNode && currentNode.id !== -1"
      :schema="schema"
      :schema-data="currentNode"
      @updateByField="updateNodeByField"
    />
    <div v-else class="flex-center p30">
      <p class="c-999">请选中非根组件</p>
    </div>
  </div>
</template>

<script>
// import { computed, reactive, watch, toRefs } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentNode } from '@/assets/node'
import { updateByField } from '@/assets/util'
// import * as schema from '@/components/basic-components/props-schema'
import { removeCenter } from '../node-style-tools/config'

export default {
  components: {
    SchemaForm
  },
  setup () {
    return {
      // ...toRefs(state),
      schema: local,
      // detail,
      currentNode,
      updateNodeByField (field, val) {
        if (field === 'style.position') {
          updateByField(currentNode.value, 'className', removeCenter(currentNode.value.className))
        }
        updateByField(currentNode.value, field, val)
      }
    }
  }
}
</script>
