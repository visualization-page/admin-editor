<template>
  <div class="node-style">
    <div class="flex-center p30" v-if="false && !isEdit()">
      <p class="c-999">请切换为编辑模式</p>
    </div>
    <template v-else-if="currentNode && currentNode.id !== '-1'">
      <el-alert
        class="mb10"
        title="所有尺寸输入框，都可以通过方向上下键调整尺寸！"
        type="success">
      </el-alert>
      <schema-form
        :schema="schema"
        :schema-data="currentNode"
        @updateByField="updateNodeByField"
      />
    </template>
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
import { removeCenter } from '../node-style-tools/config'
import { isEdit } from '@/assets/render'

export default {
  components: {
    SchemaForm
  },
  setup () {
    return {
      // ...toRefs(state),
      schema: local,
      // detail,
      isEdit,
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
