import Vue from 'vue'
import { ref } from '@vue/composition-api'
import { currentPage } from './page'
import { deepClone } from './util'
import { loadItem } from '@/components/mobile-render/render/utils'
import { setTabName, tabName } from '@/assets/tab'
import { isEdit } from '@/assets/render'
import { Message, MessageBox } from 'element-ui'
import { project } from '@/assets/project'

export const common = {
  id: 2,
  version: '0.0.1',
  cover: '',
  className: '',
  createdUser: {
    id: 0,
    name: 'jmingzi'
  },
  events: [],
  style: {
    width: '100%',
    height: '60px',
    positionType: 'absolute',
    position: {},
    margin: {},
    padding: {},
    zIndex: 0,
    code: '(function () {\n  return {\n  }\n})()'
  },
  children: [],
  show: true,
  outDocFlow: false,
  renderString: '(function (h) {\n  return {\n    option: {\n      props: {}\n    },\n    children: [\n    ]\n  }\n})(vueCompositionApi.createElement)'
}

// 1 << 0 基础组件
// 1 << 1 封装的组件
// 1 << 2 组件库组件
export type NodeItem = {
  id: string
  title: string
  children: Array<NodeItem>
  [key: string]: any
}
export type NodeItemBasic = {
  name: string
  jsUrl: string
  cssUrl: string
  existCss: boolean
  nodeType: number
}
export type NodeItemLibrary = {
  library: string
  nodeType: number
  name: string
  type: 'div'
}

export const rootNode: NodeItem = {
  id: '-1',
  title: '根节点',
  type: 'div',
  children: []
}

export const currentNode = ref<NodeItem | null>(null)

export const setCurrentNode = (item: NodeItem | null) => {
  currentNode.value = item
}

export function getUid () {
  return 'yxxxy-yxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const getNewNode = (item: any, obj?: any): NodeItem => ({
  ...deepClone(item),
  ...(obj || {}),
  id: `${getUid()}-${Date.now()}`
})

export const getNewNodeParent = () => {
  let target: Array<NodeItem> = currentPage.value!.nodes
  if (
    currentNode.value &&
    currentNode.value.id !== '-1' &&
    currentNode.value.children
  ) {
    target = currentNode.value.children
  }
  return target
}

export const findNode = (
  targetId: string,
  nodes = currentPage.value!.nodes
): { data: NodeItem, i: number, handle: NodeItem[] } | null => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === targetId) {
      return {
        data: nodes[i],
        i,
        handle: nodes
      }
    } else if (nodes[i].children) {
      const res = findNode(targetId, nodes[i].children)
      if (res) {
        return res
      }
    }
  }
  return null
}

export const addBeforeValidate = (): boolean => {
  if (!currentPage.value) {
    Message.info('请选中页面')
    setTabName([tabName.pageList])
    return false
  } else if (!isEdit()) {
    Message.error('请切换至编辑模式')
    return false
  } else if (currentNode.value && currentNode.value.type !== 'div') {
    Message.error('容器组件才能添加子组件')
    return false
  }
  return true
}

export const addComposeNode = (node: NodeItem) => {
  const p = getNewNodeParent()
  // 重新生成id
  p.push(deepCopyNode(node, false))
}

export const deepCopyNode = (data: NodeItem, copyTitle: boolean = true) => {
  const item = getNewNode(data, { title: copyTitle ? `${data.title}_copy` : data.title })
  if (item.children && item.children.length) {
    item.children = item.children.map(x => deepCopyNode(x, copyTitle))
  }
  return item
}

export const addNode = async (item: NodeItemBasic | NodeItemLibrary) => {
  let newNode: NodeItem
  if (item.nodeType === 1 << 0) {
    const data = await loadItem(item as NodeItemBasic)
    newNode = getNewNode({
      ...data.default,
      name: item.name,
      nodeType: item.nodeType
    })
  } else if (item.nodeType === 1 << 2) {
    const it = item as NodeItemLibrary
    newNode = getNewNode({
      ...common,
      style: {
        ...common.style,
        width: undefined,
        height: undefined
      },
      ...item,
      title: `${it.library}/${it.name}`,
      nodeType: item.nodeType
    })
  }
  // @ts-ignore
  getNewNodeParent().push(newNode)
  // el-tree 中的更新逻辑在下一个 task 后
  setTimeout(() => {
    setCurrentNode(newNode)
  })
}

export const delNode = async (target: { nodeId: string }) => {
  if (currentPage.value) {
    await MessageBox.confirm('确定要删除吗')
    const { nodes } = currentPage.value
    const res = findNode(target.nodeId, nodes)
    if (res && res.i > -1) {
      if (res.data.nodeType === 1 << 0) {
        // 删除依赖
        const i = project.componentDownload.findIndex(x => x.name === res.data.name)
        project.componentDownload.splice(i, 1)
      }
      res.handle.splice(res.i, 1)
    }
    if (nodes[0]) {
      setCurrentNode(nodes[0])
    }
  }
}

export const dragNode = (current: NodeItem, target: NodeItem, type: string) => {
  if (currentPage.value) {
    const { nodes } = currentPage.value
    const tarRes = findNode(target.id, nodes)
    const curRes = findNode(current.id, nodes)
    if (type === 'before') {
      if (curRes) {
        curRes.handle.splice(curRes.i, 1)
        if (tarRes) {
          tarRes.handle.splice(tarRes.i, 0, curRes.data)
        }
      }
    }
  }
}
// export const updateNode = (target: { nodeIndex?: number, nodeId?: string }, obj: any) => {
//   if (currentPage.value) {
//     const { nodes } = currentPage.value
//     if (target.nodeId) {
//       target.nodeIndex = nodes.findIndex((x: any) => x.id === target.nodeId)
//     }
//     if (target.nodeIndex !== undefined && target.nodeIndex > -1) {
//       Vue.set(nodes, target.nodeIndex, {
//         ...nodes[target.nodeIndex],
//         ...obj
//       })
//       setCurrentNode(nodes[target.nodeIndex])
//     }
//   }
// }

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
