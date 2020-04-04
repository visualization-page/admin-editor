export type FormEvent = {
  eventType: string
  targetNodeIdPath?: string[]
  fxCode: string
  desc: string
  [k: string]: any
}

export const eventType = ['click', 'change', 'input', 'focus', 'blur']
export const eventTypePage = ['onMounted', 'onUnMounted']
export const fxList = [
  {
    name: 'toast 提示',
    code: '$$global.toast(\'提示语\')'
  },
  {
    name: 'dialog 提示',
    code: '$$global.dialog(\'提示语\')'
  },
  {
    name: '获取 cookie',
    code: '$$global.cookie(\'userId\')'
  },
  {
    name: '打点',
    code: '$$global.dot(/* base */).hit(\'gid.0.mid.eid\')'
  },
  {
    name: '内部跳转',
    code: '$$global.toPage(\'/pageId\')'
  },
  {
    name: '外部跳转',
    code: 'location.href = \'https://iming.work\''
  },
  {
    name: '接口调用',
    code: '$$global.http.get(\'test\', {})'
  },
  {
    name: '显示组件',
    code: '$$global.showNode(\'nodeId\')'
  },
  {
    name: '隐藏组件',
    code: '$$global.hideNode(\'nodeId\')'
  },
  {
    name: '客户端native',
    code: '$$global.native'
  },
  {
    name: '客户端右上角菜单',
    code: '$$global.native.defineCallback(\'分享\', () => {\n})'
  },
  {
    name: '获取节点',
    code: '$$global.findNodeById(\'id\')'
  },
  {
    name: '设置节点属性',
    code: '$$global.setNodeProperty(\'id\', \'\', \'\')'
  },
  {
    name: '获取节点属性',
    code: '$$global.getNodeProperty(\'id\', \'\')'
  }
]
