import Vue from 'vue'
import Composition, { reactive, ref } from '@vue/composition-api'
import { currentPage } from './page'
import { deepClone } from './util'

Vue.use(Composition)

export type NodeItem = {
  id: string | number
  title: string,
  children: Array<NodeItem>
  [key: string]: any
}

export const rootNode: NodeItem = {
  id: -1,
  title: '根节点',
  type: 'div',
  children: []
}

export const currentNode = ref<NodeItem | null>(null)

export const setCurrentNode = (item?: any) => {
  currentNode.value = item
}

export const addNode = (item: any) => {
  if (currentPage.value) {
    let target: Array<NodeItem> = currentPage.value.nodes
    if (currentNode.value && currentNode.value.id !== -1) {
      target = currentNode.value.children
    }
    const index = target.length
    Vue.set(target, index, {
      ...deepClone(item),
      id: `node-${Date.now()}`
    })
    setCurrentNode(target[index])
  }
}

export const delNode = (target: { nodeIndex?: number, nodeId?: string }) => {
  if (currentPage.value) {
    const { nodes } = currentPage.value
    if (target.nodeId) {
      target.nodeIndex = nodes.findIndex((x: any) => x.id === target.nodeId)
    }
    if (target.nodeIndex !== undefined && target.nodeIndex > -1) {
      nodes.splice(target.nodeIndex, 1)
    }

    setCurrentNode(rootNode)
  }
}

export const updateNode = (target: { nodeIndex?: number, nodeId?: string }, obj: any) => {
  if (currentPage.value) {
    const { nodes } = currentPage.value
    if (target.nodeId) {
      target.nodeIndex = nodes.findIndex((x: any) => x.id === target.nodeId)
    }
    if (target.nodeIndex !== undefined && target.nodeIndex > -1) {
      Vue.set(nodes, target.nodeIndex, {
        ...nodes[target.nodeIndex],
        ...obj
      })
    }
  }
}
