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
        :default-expand-all="false"
        :default-expanded-keys="currentNode ? [currentNode.id] : []"
        highlight-current
        draggable
        ref="tree"
        @node-click="handleNodeClick"
        @node-drop="handleDrop"
      >
        <div class="flex-center-between width-100" slot-scope="{ node, data }">
          <span>{{ node.label }}<span v-if="!data.show">(隐藏)</span></span>
          <div @click.stop="" v-if="data.id !== '-1'">
            <el-button
              type="text"
              size="mini"
              @click="handleDel(data, node.parent)">
              <span style="color:red">删除</span>
            </el-button>
            <el-tooltip effect="dark" content="克隆成为下一个节点" placement="top">
              <el-button
                type="text"
                size="mini"
                @click="handleClone(data, node.parent)">
                克隆
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="复制到剪切板" placement="top">
              <el-button
                type="text"
                size="mini"
                @click="handleCopy(data, node.parent)">
                复制
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="粘贴剪切板组件成为下一个节点" placement="top">
              <el-button
                type="text"
                size="mini"
                @click="handlePaste(data, node.parent)">
                粘贴
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="封装节点为公共节点组件" placement="top">
              <el-button
                v-if="data.type === 'div'"
                type="text"
                size="mini"
                @click="handleExport(data, node.parent)">
                封装
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </el-tree>
    </template>
    <div v-else class="flex-center p30">
      <p class="c-999">请选中一个页面</p>
    </div>
    <compose-dialog
      :show.sync="composeState.show"
      :name="composeState.name"
      :cover="composeState.cover"
      :callback="composeState.callback"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, reactive, watch } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { project } from '@/assets/project'
import { rootNode, currentNode, setCurrentNode, deepCopyNode, NodeItem, NodeItemBasic, delNode } from '@/assets/node'
import { MessageBox } from 'element-ui'
import { http } from '@/api'
import { setTabName, tabName } from '@/assets/tab'
import { editWrapCacheNode } from '@/assets/render'
import ComposeDialog from '@/components/component-compose/compose-dialog.vue'

export default defineComponent({
  components: {
    ComposeDialog
  },
  setup (props, ctx) {
    const composeState = reactive({
      show: false,
      name: '',
      cover: '',
      callback: (name: string, cover: string) => {}
    })
    watch(() => currentNode.value && currentNode.value.id, val => {
      if (val) {
        // @ts-ignore
        ctx.refs.tree.setCurrentKey(val === '-1' ? null : val)
      }
    }, { lazy: true })
    const handleNodeClick = (data: any) => {
      setCurrentNode(data)
      setTabName(['', '', tabName.nodeProperty, '', '', tabName.nodeSetProperty])
    }
    const handleClone = (data: any, parent: any) => {
      if (parent.parent === null) {
        const index = parent.data.findIndex((x: any) => x.id === data.id)
        const target = parent.data
        target.splice(
          index + 1,
          0,
          deepCopyNode(data)
        )
      } else {
        const index = parent.data.children.findIndex((x: any) => x.id === data.id)
        const target = parent.data.children
        // if (parent.data.id === '-1') {
        //   target = currentPage.value!.nodes
        // }
        // 复制时，需要递归所有节点，生成新的 id
        target.splice(
          index + 1,
          0,
          deepCopyNode(data)
        )
      }
    }
    const handlePaste = async (data: any, parent: any) => {
      const local = localStorage.getItem('butterfly-copy-node')
      if (local) {
        try {
          const localParse = JSON.parse(local)
          await Vue.prototype.$msgbox.confirm(`即将粘贴剪切板组件：${localParse.title || localParse.id}，确定吗？`)
          localParse.id = data.id
          handleClone(localParse, parent)
        } catch (e) {
          Vue.prototype.$notice('剪切板无有效的复制组件', true)
        }
      } else {
        Vue.prototype.$notice('剪切板无复制的组件', true)
      }
    }
    const handleDel = (item: any) => {
      delNode({ nodeId: item.id })
    }
    const handleExport = (data: any, parent: any) => {
      // 遍历组件收集类型依赖，并检测名字唯一
      composeState.show = true
      composeState.callback = (name: string, cover: string) => {
        // console.log(name, cover)
        const componentDeps: NodeItemBasic[] = []
        const _dep = (node: NodeItem) => {
          if (node.nodeType === 1 << 0) {
            const it = project.componentDownload.find(x =>
              x.name === node.name &&
              x.pageId === currentPage.value!.id
            )
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
        const _post = (force?: boolean) => {
          http.post('component/export', {
            type: 'compose',
            componentDeps,
            name,
            cover,
            node: data,
            userName: Vue.prototype.$native.name,
            force
          }, {
            successMessage: '封装组件成功，快去刷新列表吧',
            codeCallback: {
              60001: async (err: any) => {
                await MessageBox.confirm(err.msg)
                _post(true)
              }
            }
          })
        }
        _post()
      }
    }
    return {
      currentPage,
      currentNode,
      rootNode,
      composeState,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      handleDrop (draggingNode: any, dropNode: any, dropType: any, ev: any) {
        console.log('tree drag', draggingNode.data.id, 'tree drop: ', dropNode.data.id, dropType)
        // dragNode(draggingNode.data, dropNode.data, dropType)
        editWrapCacheNode[dropNode.data.id] = null
        editWrapCacheNode[draggingNode.data.id] = null
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
      handleClone,
      handleExport,
      handlePaste,
      handleCopy () {
        localStorage.setItem('butterfly-copy-node', JSON.stringify(currentNode.value))
        Vue.prototype.$notice('复制组件到剪切板成功')
      }
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
