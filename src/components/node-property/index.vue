<template>
  <div class="node-property">
    <div class="flex-center p30" v-if="false && !isEdit()">
      <p class="c-999">请切换为编辑模式</p>
    </div>
    <template v-else-if="currentNode && currentNode.id !== '-1'">
      <schema-form
        :schema="schema"
        :schema-data="currentNode"
        @updateByField="updateNodeByField"
      />
      <div v-if="false" class="tc mt20">
        <el-button type="primary" plain @click="handleCopy">复制到剪切板</el-button>
        <el-button type="danger" @click="handleDel">删除节点</el-button>
      </div>
    </template>
    <div v-else class="flex-center p30">
      <p class="c-999">请选中非根节点</p>
    </div>
  </div>
</template>

<script>
import { computed, watch } from '@vue/composition-api'
import SchemaForm from '../schema/index.vue'
import local from './config'
import { currentNode, delNode, setCurrentNode } from '@/assets/node'
import { updateByField } from '@/assets/util'
import { isEdit } from '@/assets/render'
import { currentPage } from '@/assets/page'
import { basicSchemaMap } from '../basic-components'
import Vue from 'vue'

export default {
  components: {
    SchemaForm
  },
  setup () {
    // 页面切换时，清空 node
    watch(() => currentPage.value, () => {
      setCurrentNode(null)
    }, { lazy: true })
    // 根据当前 node 合并通用 schema 和组件特有的 schema
    const schema = computed(() => {
      const node = currentNode.value
      if (node && node.id !== '-1') {
        let schema = []
        if (node.nodeType === 1 << 0) {
          const winSchema = node.name && window[node.name] && window[node.name].schema
          schema = winSchema || basicSchemaMap[node.subType || node.type]
          if (!schema) {
            // eslint-disable-next-line no-new
            new Error('schema is not found from node-property')
          } else {
            schema = schema.map(x => ({
              ...x,
              model: x.model || (x.type === 'input' ? 'blur' : 'input')
            }))
          }
        } else if (node.nodeType === 1 << 2) {
          schema = [
            {
              label: 'render',
              field: 'renderString',
              block: false,
              type: 'code',
              'code-language': node.subType === 'spa' ? 'html' : undefined
            }
          ]
        }
        return [ ...local, ...schema ]
      }
      return []
    })
    return {
      schema,
      currentNode,
      isEdit,
      updateNodeByField (field, val) {
        updateByField(currentNode.value, field, val)
      },
      handleDel () {
        delNode({ nodeId: currentNode.value.id })
      },
      handleCopy () {
        localStorage.setItem('butterfly-copy-node', JSON.stringify(currentNode.value))
        Vue.prototype.$notice('复制组件到剪切板成功')
      }
    }
  }
}
</script>
