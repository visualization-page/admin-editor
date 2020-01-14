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
import { computed, reactive, watch, toRefs } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentNode } from '@/assets/node'
import { updateByField } from '@/assets/util'
// import * as schema from '@/components/basic-components/props-schema'

export default {
  components: {
    SchemaForm
  },
  setup () {
    // const state = reactive({
    //   schema: []
    // })
    const detail = computed(() => currentNode.value)
    // 根据当前 node 合并通用 schema 和组件特有的 schema
    // watch(() => currentNode.value, node => {
    //   state.schema = node && node.id !== -1 && schema[node.type]
    //     ? [ ...local, ...schema[node.type] ]
    //     : []
    // })
    return {
      // ...toRefs(state),
      schema: local,
      // detail,
      currentNode,
      updateNodeByField (field, val) {
        console.log(val)
        updateByField(currentNode.value, field, val)
      }
    }
  }
}
</script>
