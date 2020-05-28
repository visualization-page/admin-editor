export default [
  {
    label: 'ID',
    field: 'id',
    type: 'input',
    elProps: {
    },
    elAttrs: {
      disabled: false,
      readonly: true
    }
  },
  {
    label: '标题',
    field: 'title',
    type: 'input',
    elProps: {
    },
    elAttrs: {
    }
  },
  {
    label: '页面地址',
    field: 'url',
    type: 'textarea',
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
  {
    label: '开启分享',
    field: 'hasShare',
    type: 'checkbox'
  },
  {
    label: '分享标题',
    field: 'share.title',
    type: 'input',
    relation: [
      { field: 'hasShare', value: true }
    ]
  },
  {
    label: '分享描述',
    field: 'share.desc',
    type: 'input',
    relation: [
      { field: 'hasShare', value: true }
    ]
  },
  {
    label: '分享图片',
    field: 'share.pic',
    type: 'input',
    relation: [
      { field: 'hasShare', value: true }
    ]
  },
  {
    label: 'app外分享地址',
    field: 'share.link',
    type: 'textarea',
    relation: [
      { field: 'hasShare', value: true }
    ]
  },
  {
    label: 'app内分享地址',
    field: 'share.linkMain',
    type: 'textarea',
    elAttrs: {
      placeholder: '不填默认当前页面链接'
    },
    relation: [
      { field: 'hasShare', value: true }
    ]
  },
  {
    label: '事件管理',
    field: 'events',
    type: 'events'
  },
  {
    label: '视图模型',
    field: 'state',
    block: false,
    type: 'code',
    'info-icon': 'el-icon-warning-outline',
    info: '使用方法：在当前页面组件属性的输入框内可以绑定字段，例如：$$page.state.test'
  },
  {
    label: '页面方法',
    field: 'methods',
    block: false,
    type: 'code',
    'info-icon': 'el-icon-warning-outline',
    info: '使用方法：$$page.methods.common()'
  }
]
