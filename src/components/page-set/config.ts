export default [
  {
    label: 'ID',
    field: 'id',
    type: 'input',
    elProps: {
    },
    elAttrs: {
      disabled: true
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
    type: 'input',
    elProps: {
    },
    elAttrs: {
      readonly: true
    }
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
    label: '分享地址',
    field: 'share.link',
    type: 'input',
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
    label: '响应式状态',
    field: 'state',
    block: false,
    type: 'code'
  }
]
