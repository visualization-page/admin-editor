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

export const getNewNode = (item: any, obj?: any): NodeItem => ({
  ...deepClone(item),
  ...(obj || {}),
  id: `node-${Date.now()}`
})

export const getNewNodeParent = () => {
  let target: Array<NodeItem> = currentPage.value!.nodes
  if (currentNode.value && currentNode.value.id !== -1) {
    target = currentNode.value.children
  }
  return target
}

export const addNode = (item: any) => {
  if (currentPage.value) {
    const newNode = getNewNode(item)
    getNewNodeParent().push(newNode)
    // el-tree 中的更新逻辑在下一个 task 后
    setTimeout(() => {
      setCurrentNode(newNode)
    })
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
      setCurrentNode(nodes[target.nodeIndex])
    }
  }
}

export const updateNodeStyle = (obj: { width?: string, height?: string }) => {
  Object.assign(currentNode.value!.style, obj)
}

export const updateNodePosition = (dir: 'top' | 'left', val: string) => {
  if (currentNode.value!.style.position[dir] === undefined) {
    Vue.set(currentNode.value!.style.position, dir, val)
  } else {
    currentNode.value!.style.position[dir] = val
  }
}
