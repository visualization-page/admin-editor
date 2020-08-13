export const http = [
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
  },
  {
    label: 'Http选项',
    field: 'httpOptions.options',
    block: false,
    type: 'code',
    'info-icon': 'el-icon-data-analysis',
    info: '上面的字段如果不够用，可以在这里补充其它选项。'
  }
]

export const env = [
  {
    label: '本机预览环境',
    field: 'config.dev',
    type: 'input-group',
    'info-icon': 'el-icon-warning-outline',
    info: '本机开发、预览环境用到的变量键值对，使用: $$global.config.baseUrl'
  },
  {
    label: '默认发布环境',
    field: 'config.pro',
    type: 'input-group',
    'info-icon': 'el-icon-warning-outline',
    info: '发布环境用到的变量键值对，使用: $$global.config.baseUrl'
  },
  {
    label: '其它发布环境',
    field: 'config.proArr',
    type: 'input-group-arr',
    'info-icon': 'el-icon-warning-outline',
    // block: true,
    info: '如果默认的发布环境不够用，新增其它发布环境，在发布时选择对应环境即可'
  }
]

export const css = [
  {
    label: '全局css',
    field: 'css',
    block: false,
    'code-language': 'css',
    type: 'code',
    'info-icon': 'el-icon-brush',
    info: '全局css，会被直接插入到 html 头部中'
  }
]

export const utils = [
  {
    label: '全局函数',
    field: 'utils',
    block: false,
    'code-language': 'javascript',
    type: 'code',
    'info-icon': 'el-icon-star-off',
    info: '全局utils，例如：$$global.utils.deepClone'
  }
]

export const scripts = [
  {
    label: '初始脚本',
    field: 'initScripts',
    block: false,
    'code-language': 'javascript',
    type: 'code',
    'info-icon': 'el-icon-video-camera',
    info: '本段代码会在项目初始化的时候运行'
  }
]

export const constant = [
  {
    label: '项目常量',
    field: 'constant',
    block: false,
    type: 'code',
    'info-icon': 'el-icon-mouse',
    info: '使用方法：在项目全局中任何地方，例如：$$global.constant.[fieldName]'
  }
]
