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
    'info-icon': 'el-icon-sugar',
    info: 'tcon 文档地址：https://tcon.netlify.app/guide/',
    model: 'blur'
  },
  // {
  //   label: '快捷样式',
  //   field: 'quickToolsAddClass',
  //   type: 'textarea',
  //   elProps: {
  //   },
  //   elAttrs: {
  //     disabled: true,
  //     placeholder: '通过快捷方式设置的样式'
  //   }
  // },
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
    label: 'v-show',
    field: 'vShow',
    type: 'textarea',
    elAttrs: {
      placeholder: '请输入'
    },
    model: 'blur',
    expression: true
  },
  {
    label: 'v-if',
    field: 'vIf',
    type: 'textarea',
    elAttrs: {
      placeholder: '请输入'
    },
    model: 'blur',
    expression: true
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
