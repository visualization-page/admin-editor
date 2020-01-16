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
    label: '分享标题',
    field: 'share.title',
    type: 'input'
  },
  {
    label: '分享描述',
    field: 'share.desc',
    type: 'input'
  },
  {
    label: '分享图片',
    field: 'share.pic',
    type: 'input'
  },
  {
    label: '分享地址',
    field: 'share.link',
    type: 'input'
  },
  {
    label: '事件管理',
    field: 'events',
    type: 'events'
  }
]
