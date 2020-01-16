export const eventType = ['click', 'change', 'input', 'focus', 'blur']
export const eventTypePage = ['onMounted', 'onUnMounted']

// const events = [
//   {
//     type: 'click',
//     target: '',
//     action: ''
//   }
// ]
export const fxList = [
  {
    name: 'toast 提示',
    code: '$$system.toast(\'提示语\')'
  },
  {
    name: '打点',
    code: '$$system.dot.hit(\'gid.0.mid.eid\')'
  },
  {
    name: '内部跳转',
    code: '$$system.router.push(\'/path\')'
  },
  {
    name: '外部跳转',
    code: 'location.href = \'https://iming.work\''
  },
  {
    name: '接口调用',
    code: '$$system.http.get(\'test\', {})'
  },
  {
    name: '显示组件',
    code: '$$system.showNode(\'id\')'
  },
  {
    name: '隐藏组件',
    code: '$$system.hideNode(\'id\')'
  },
  {
    name: '彩云右上角菜单',
    code: '$$system.native.defineCallback(\'分享\', () => {\n})'
  }
]
