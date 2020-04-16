<template>
  <div class="node-tree">
    <template v-if="currentPage">
      <p
        class="cp node-tree__root"
        :style="{
          background: (!currentNode || currentNode.id === '-1') ? '#f0f7ff' : undefined
        }"
        @click="handleNodeClick(rootNode)"
      >{{ rootNode.title }}</p>
      <el-tree
        :data="currentPage.nodes"
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
          <div @click.stop="" v-if="data.id !== '-1'">
            <el-button
              type="text"
              size="mini"
              @click="handleDel(data, node.parent)">
              <span style="color:red">删除</span>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleCopy(data, node.parent)">
              复制
            </el-button>
            <el-button
              v-if="data.type === 'div'"
              type="text"
              size="mini"
              @click="handleExport(data, node.parent)">
              封装组件
            </el-button>
          </div>
        </div>
      </el-tree>
    </template>
    <div v-else class="flex-center p30">
      <p class="c-999">请选中一个页面</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { project } from '@/assets/project'
import { rootNode, currentNode, setCurrentNode, deepCopyNode, NodeItem, NodeItemBasic, delNode } from '@/assets/node'
import { MessageBox } from 'element-ui'
import { http } from '@/api'
import { setTabName, tabName } from '@/assets/tab'

export default defineComponent({
  setup (props, ctx) {
    watch(() => currentNode.value && currentNode.value.id, val => {
      if (val) {
        // @ts-ignore
        ctx.refs.tree.setCurrentKey(val === '-1' ? null : val)
      }
    }, { lazy: true })
    const handleNodeClick = (data: any) => {
      setCurrentNode(data)
      setTabName(['', '', tabName.nodeProperty])
    }
    const handleCopy = (data: any, parent: any) => {
      const index = parent.data.children.findIndex((x: any) => x.id === data.id)
      let target = parent.data.children
      if (parent.data.id === '-1') {
        target = currentPage.value!.nodes
      }
      // 复制时，需要递归所有节点，生成新的 id
      target.splice(
        index + 1,
        0,
        deepCopyNode(data)
      )
    }
    const handleDel = (item: any) => {
      delNode({ nodeId: item.id })
    }
    const handleExport = (data: any, parent: any) => {
      // 遍历组件收集类型依赖，并检测名字唯一
      MessageBox.prompt('请输入封装的组件名、字母数字组成').then(({ value }: any) => {
        const componentDeps: NodeItemBasic[] = []
        const _dep = (node: NodeItem) => {
          if (node.nodeType === 1 << 0) {
            const it = project.componentDownload.find(x => x.name === node.name)
            if (it) {
              componentDeps.push(it)
            }
          }
          if (node.children) {
            node.children.forEach(n => {
              _dep(n)
            })
          }
        }
        _dep(data)
        http.post('component/export', {
          type: 'compose',
          componentDeps,
          name: value,
          node: data
        }, { successMessage: '封装成功！' })
      })
    }
    return {
      currentPage,
      currentNode,
      rootNode,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      handleDrop (draggingNode: any, dropNode: any, dropType: any, ev: any) {
        console.log('tree drop: ', dropNode, dropType)
        // dragNode(draggingNode.data, dropNode.data, dropType)
      },
      allowDrop (draggingNode: any, dropNode: any, dropType: any) {
        const { id, type } = dropNode.data
        return id !== '-1' && ((type !== 'div' && dropType !== 'inner') || type === 'div')
      },
      allowDrag (draggingNode: any) {
        return draggingNode.data.id !== '-1'
      },
      handleNodeClick,
      handleDel,
      handleCopy,
      handleExport
    }
  }
})
</script>

<style lang="less">
.node-tree {
  &__root {
    line-height: 28px;
    padding-left: 10px;
    color: #444;
    &:hover {
      background-color: #F5F7FA;
    }
  }
}
</style>
