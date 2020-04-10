import { currentNode } from '@/assets/node'

export default [
  {
    label: 'ID',
    field: 'id',
    type: 'input',
    elProps: {
    },
    elAttrs: {
      readonly: true
    }
  },
  {
    label: 'class',
    field: 'className',
    type: 'textarea',
    elProps: {
    },
    elAttrs: {
      placeholder: '支持 tcon.css，空格分隔'
    },
    model: 'blur'
  },
  {
    label: '节点名称',
    field: 'title',
    type: 'input',
    elProps: {
    },
    elAttrs: {
    },
    model: 'blur'
  },
  {
    label: '显示',
    field: 'show',
    type: 'checkbox'
  },
  {
    label: 'v-if',
    field: 'vIf',
    type: 'input',
    elAttrs: {
      placeholder: '请输入'
    },
    model: 'blur'
  },
  {
    label: '绑定状态',
    field: 'bindState',
    type: 'input',
    elAttrs: {
      placeholder: '请输入'
    },
    model: 'blur',
    relationCallback: (schema: any) => {
      return schema.label === '绑定状态' && currentNode.value && currentNode.value.subType === 'list'
    },
    'info-icon': 'el-icon-warning-outline',
    info: '列表容器可以绑定视图模型，$$page.state.test，绑定后在列表容器的子节点中可以使用 $$listBind.item 获取遍历元素， $$listBind.index 获取遍历索引'
  },
  {
    label: '脱离文档流',
    field: 'outDocFlow',
    type: 'checkbox'
  },
  {
    label: '事件管理',
    field: 'events',
    type: 'events'
  }
]
