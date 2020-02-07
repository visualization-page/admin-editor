<template>
  <div class="node-property">
    <template v-if="detail && detail.id !== -1">
      <schema-form
        :schema="schema"
        :schema-data="detail"
        @updateByField="updateNodeByField"
      />
      <div class="tc mt20">
        <el-button class="width-100" type="danger" @click="handleDel">删除节点</el-button>
      </div>
    </template>
    <div v-else class="flex-center p30">
      <p class="c-999">请选中非根组件</p>
    </div>
  </div>
</template>

<script>
import { computed, reactive, watch, toRefs } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentNode, delNode } from '@/assets/node'
import { updateByField } from '@/assets/util'
import schema from '@/components/basic-components/props-schema'
import { MessageBox } from 'element-ui'
// import Vue from 'vue'

export default {
  components: {
    SchemaForm
  },
  setup () {
    const state = reactive({
      schema: []
    })
    const detail = computed(() => currentNode.value)
    // 根据当前 node 合并通用 schema 和组件特有的 schema
    watch(() => currentNode.value, node => {
      state.schema = node && node.id !== -1
        ? [ ...local, ...(schema[node.type] || {}) ]
        : []
    })
    return {
      ...toRefs(state),
      detail,
      updateNodeByField (field, val) {
        updateByField(currentNode.value, field, val)
        // currentNode.value[field] = val
        // console.log(currentNode.value[field])
        // console.log(field, currentNode.value)
        // currentNode.value.title = '111'
      },
      async handleDel () {
        await MessageBox.confirm('确定要删除吗')
        delNode({ nodeId: currentNode.value.id })
      }
    }
  }
}
</script>
