<template>
  <div class="node-tree">
    <el-tree
      v-if="nodes"
      :data="nodes"
      :props="defaultProps"
      :expand-on-click-node="false"
      node-key="id"
      default-expand-all
      highlight-current
      ref="tree"
      @node-click="handleNodeClick"
    />
    <div v-else class="flex-center p30">
      <p class="c-999">请新建页面</p>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, computed, watch } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { rootNode, currentNode, setCurrentNode } from '@/assets/node'

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
      ctx.refs.tree.setCurrentKey(val)
    }, { lazy: true })
    const handleNodeClick = (data: any) => {
      setCurrentNode(data)
    }
    return {
      nodes,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      handleNodeClick
    }
  }
})
</script>

<style lang="less">
</style>
