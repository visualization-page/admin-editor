<template>
  <div class="node-tree">
    <el-tree
      v-if="nodes"
      :data="nodes"
      :props="defaultProps"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :expand-on-click-node="false"
      node-key="id"
      default-expand-all
      highlight-current
      draggable
      ref="tree"
      @node-click="handleNodeClick"
      @node-drop="handleDrop"
    >
      <div class="flex-center-between width-100" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data.id !== -1">
          <el-button
            type="text"
            size="mini"
            @click="handleCopy(data, node.parent)">
            复制
          </el-button>
        </span>
      </div>
    </el-tree>
    <div v-else class="flex-center p30">
      <p class="c-999">请新建页面</p>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, computed, watch } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { rootNode, currentNode, setCurrentNode, getNewNode, NodeItem } from '@/assets/node'

export default createComponent({
  setup (props, ctx) {
    const nodes = computed(() => {
      if (currentPage.value) {
        const copy = JSON.parse(JSON.stringify(rootNode))
        copy.children.push.apply(copy.children, currentPage.value.nodes)
        return [copy]
      }
      return null
    })
    watch(() => currentNode.value && currentNode.value.id, val => {
      // @ts-ignore
      val && ctx.refs.tree.setCurrentKey(val)
    }, { lazy: true })
    const handleNodeClick = (data: any) => {
      setCurrentNode(data)
    }
    const deepCopyNode = (data: NodeItem) => {
      const item = getNewNode(data, { title: `${data.title}_copy` })
      if (item.children && item.children.length) {
        item.children = item.children.map(x => deepCopyNode(x))
      }
      return item
    }
    const handleCopy = (data: any, parent: any) => {
      const index = parent.data.children.findIndex((x: any) => x.id === data.id)
      let target = parent.data.children
      if (parent.data.id === -1) {
        target = currentPage.value!.nodes
      }
      // 复制时，需要递归所有节点，生成新的 id
      target.splice(
        index + 1,
        0,
        deepCopyNode(data)
      )
    }
    return {
      nodes,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      handleNodeClick,
      handleDrop (draggingNode: any, dropNode: any, dropType: any, ev: any) {
        console.log('tree drop: ', dropNode, dropType)
      },
      allowDrop (draggingNode: any, dropNode: any, dropType: any) {
        const { id, type } = dropNode.data
        return id !== -1 && ((type !== 'div' && dropType !== 'inner') || type === 'div')
      },
      allowDrag (draggingNode: any) {
        return draggingNode.data.id !== -1
      },
      handleCopy
    }
  }
})
</script>

<style lang="less">
</style>
