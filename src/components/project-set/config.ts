export const local = [
  {
    label: '访问地址',
    field: 'url',
    type: 'input',
    elProps: {
    },
    elAttrs: {
      disabled: true
    }
  },
  {
    label: '项目名称',
    field: 'desc',
    type: 'textarea',
    elProps: {
    },
    elAttrs: {
      rows: 2
    },
    rulers: [
      { required: true, message: '请输入项目描述', trigger: 'blur' },
      { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
    ]
  },
  {
    label: '项目目录',
    field: 'dir',
    type: 'input',
    rulers: [
      { required: true, message: '请输入项目目录名称', trigger: 'blur' }
    ]
  },
  {
    label: '页面类型',
    field: 'interactiveType',
    type: 'select',
    options: [
      {
        label: '长页面',
        value: 'long-page'
      },
      {
        label: '滑动海报',
        value: 'poster'
      }
    ]
  },
  {
    label: '封面图',
    field: 'thumbCover',
    type: 'input'
  },
  {
    label: 'baseUrl',
    field: 'httpOptions.baseUrl',
    type: 'input'
  },
  {
    label: 'contentType',
    field: 'httpOptions.contentType',
    type: 'select',
    options: [
      {
        label: 'json',
        value: 'application/json'
      },
      {
        label: 'x-www-form-urlencoded',
        value: 'application/x-www-form-urlencoded'
      }
    ]
  },
  {
    label: 'urlMap',
    field: 'httpOptions.urlMap',
    type: 'input-group'
  }
]
