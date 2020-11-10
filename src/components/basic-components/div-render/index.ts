import { common } from '../common'

export default {
  ...common,
  componentName: 'div-render',
  title: '自定义节点',
  cover: 'el-icon-thumb',
  type: 'div',
  nodeType: 1 << 2,
  // subType: 'spa',
  style: {
    ...common.style,
    height: undefined,
    width: undefined
  },
  name: 'div',
  library: '自定义渲染'
}
