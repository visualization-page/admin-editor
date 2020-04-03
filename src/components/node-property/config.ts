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
    type: 'input',
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
    }
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
    }
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
