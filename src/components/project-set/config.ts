export const local = [
  {
    label: '英文名称',
    field: 'dir',
    type: 'input',
    rulers: [
      { required: true, message: '请输入项目目录名称', trigger: 'blur' }
    ],
    elAttrs: {
      disabled: false
    }
  },
  {
    label: '项目描述',
    field: 'desc',
    type: 'textarea',
    elProps: {
    },
    elAttrs: {
      rows: 2
    },
    rulers: [
      { required: true, message: '请输入项目名称', trigger: 'blur' },
      { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
    ],
    model: 'blur'
  },
  {
    label: '项目白名单',
    field: 'info.whitelist',
    type: 'textarea',
    elAttrs: {
      placeholder: '请输入姓名，例如：诸炜/杨明；白名单内，项目可编辑操作；'
    }
  },
  {
    label: '项目访问正式地址',
    field: 'url',
    type: 'textarea',
    elProps: {
    },
    elAttrs: {
      // readonly: true
      placeholder: '根据你填写的目标机器目录绑定的域名来定'
    }
  },
  {
    label: '所属省份',
    field: 'config.appType',
    type: 'select',
    options: [
      {
        label: '测试环境',
        value: 0
      },
      {
        label: '浙江',
        value: 1
      },
      {
        label: '上海',
        value: 5
      },
      {
        label: '湖南',
        value: 6
      },
      {
        label: '江西',
        value: 9
      },
      {
        label: '河南快马',
        value: 8
      },
      {
        label: '北京',
        value: 34
      },
      {
        label: '河北',
        value: 20
      },
      {
        label: '吉林',
        value: 21
      },
      {
        label: '山东',
        value: 26
      },
      {
        label: '广西八桂',
        value: 18
      },
      {
        label: '广西和安',
        value: 51
      }
    ]
  },
  {
    label: '发布目标机器目录',
    field: 'config.path',
    type: 'textarea',
    elAttrs: {
      // readonly: true
      placeholder: '/data/webapps/ 不用填写，只用填后面的部分'
    }
  },
  {
    label: '项目类型',
    field: 'interactiveType',
    type: 'select',
    options: [
      {
        label: '长页面',
        value: 'long-page'
      },
      // {
      //   label: '滑动海报',
      //   value: 'poster'
      // },
      {
        label: '彩云小程序',
        value: 'xmmp'
      }
    ],
    elAttrs: {
      disabled: true
    }
  },
  {
    label: '封面图',
    field: 'thumbCover',
    type: 'input'
  },
  {
    label: '调试控制台',
    field: 'config.openConsole',
    type: 'checkbox'
  },
  {
    label: '开发环境',
    field: 'config.dev',
    type: 'input-group',
    'info-icon': 'el-icon-warning-outline',
    info: '开发环境用到的变量键值对，使用: $$global.config.baseUrl'
  },
  {
    label: '正式环境',
    field: 'config.pro',
    type: 'input-group',
    'info-icon': 'el-icon-warning-outline',
    info: '正式环境用到的变量键值对，使用: $$global.config.baseUrl'
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
  },
  {
    label: 'Http选项',
    field: 'httpOptions.options',
    block: false,
    type: 'code',
    'info-icon': 'el-icon-data-analysis',
    info: '上面的字段如果不够用，可以在这里补充其它选项。'
  },
  {
    label: '项目常量',
    field: 'constant',
    block: false,
    type: 'code',
    'info-icon': 'el-icon-mouse',
    info: '使用方法：在项目全局中任何地方，例如：$$global.constant.[fieldName]'
  },
  {
    label: '全局css',
    field: 'css',
    block: false,
    'code-language': 'css',
    type: 'code',
    'info-icon': 'el-icon-brush',
    info: '全局css，会被直接插入到 html 头部中'
  },
  {
    label: '全局函数',
    field: 'utils',
    block: false,
    'code-language': 'javascript',
    type: 'code',
    'info-icon': 'el-icon-star-off',
    info: '全局utils，例如：$$global.utils.deepClone'
  },
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
