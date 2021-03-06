export const projectCreate = [
  {
    label: '项目名称',
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
    label: '所属文件夹',
    field: 'folder',
    type: 'select',
    options: []
  },
  {
    label: '说明',
    type: 'description',
    content: '项目名称会被作为目录名，规则：小写字母加短杆，a-b'
  },
  {
    label: '项目类型',
    field: 'interactiveType',
    type: 'select',
    options: [
      {
        label: '讯盟 H5',
        value: 'long-page'
      },
      {
        label: '讯盟小程序',
        value: 'xmmp'
      }
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
    label: '控制台开关',
    field: 'config.openConsole',
    type: 'checkbox',
    elProps: {
      default: false
    }
  },
  {
    label: 'Web 预览页面二维码',
    field: 'config.previewQrcode',
    type: 'checkbox',
    elProps: {
      default: true
    }
  },
  {
    label: 'vw 单位基准设计稿尺寸',
    field: 'config.vwBase',
    type: 'input'
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
    relation: [
      {
        field: 'interactiveType',
        value: 'xmmp'
      }
    ],
    label: '小程序 sdk',
    field: 'config.sdklist',
    type: 'checkbox-group',
    options: [
      {
        label: 'echarts',
        value: 25000
      },
      {
        label: 'xmbase',
        value: 25001
      },
      {
        label: 'xmcard',
        value: 25002
      }
    ]
  },
  {
    relation: [
      {
        field: 'interactiveType',
        value: 'xmmp'
      }
    ],
    label: '小程序导航条颜色',
    field: 'config.navColor',
    type: 'color'
    // elAttrs: {
    //   placeholder: '白色不需要输入，其他颜色例如：#3b8ff6'
    // }
  }
]

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
    info: '上面的字段如果不够用，可以在这里补充其它选项。',
    codeEditorV3: true
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
    label: '预置字段说明',
    type: 'description',
    content: 'baseUrl: 接口请求\npublicPath: 静态资源前缀\nsyncPath: 要发布的目标机器目录\nonlineUrl: 发布后的访问地址'
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
    info: '全局css，会被直接插入到 html 头部中',
    codeEditorV3: true
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
    info: '全局utils，例如：$$global.utils.deepClone',
    codeEditorV3: true
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
    info: '本段代码会在项目初始化的时候运行',
    codeEditorV3: true
  }
]

export const constant = [
  {
    label: '项目常量',
    field: 'constant',
    block: false,
    type: 'code',
    'info-icon': 'el-icon-mouse',
    info: '使用方法：在项目全局中任何地方，例如：$$global.constant.[fieldName]',
    codeEditorV3: true
  }
]

export const pub = [
  {
    label: '控制台开关',
    field: 'config.openConsole',
    type: 'checkbox',
    elProps: {
      default: false
    }
  },
  {
    label: 'Web 预览页面二维码',
    field: 'config.previewQrcode',
    type: 'checkbox',
    elProps: {
      default: true
    }
  },
  {
    label: '是否下载图片到本地',
    field: 'config.downImgToLocal',
    type: 'checkbox'
  },
  {
    label: '下载图片说明',
    type: 'description',
    content: '本操作是将 https://global.uban360.com 域名的图片链接全部下载到本地，改为相对路径引用'
  },
  {
    label: '同步文件到目标机器',
    field: 'syncFile',
    type: 'checkbox'
  },
  {
    relation: [
      {
        field: 'syncFile',
        value: true
      }
    ],
    label: '所属省份',
    field: 'config.appType',
    type: 'select',
    options: [
      {
        label: '测试环境',
        value: 0
      },
      {
        label: 'baas 测试环境',
        value: -1
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
        label: '广西移动',
        value: 18
      },
      {
        label: '广西内部版',
        value: 53
      },
      {
        label: '广西和安',
        value: 51
      },
      {
        label: '和办公测试',
        value: 66
      },
      {
        label: '和办公',
        value: 88
      },
      {
        label: '重庆',
        value: 31
      },
      {
        label: '标准',
        value: 100
      }
    ]
  },
  {
    relation: [
      {
        field: 'syncFile',
        value: true
      }
    ],
    label: '发布目标机器目录',
    field: 'config.path',
    type: 'textarea',
    elAttrs: {
      // readonly: true
      placeholder: '请输入线上机器发布目录'
    },
    prepend: '/data/webapps/'
  },
  {
    relation: [
      {
        field: 'syncFile',
        value: true
      }
    ],
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
    relation: [
      {
        field: 'syncFile',
        value: true
      }
    ],
    label: '配置说明',
    type: 'description',
    content: '切换环境会自动填充：目标机器目录(syncPath)和发布后访问的地址(onlineUrl)，发布会以此处填充的配置为准。'
  }
]

export const pubIoc = [
  {
    label: '发布到IOC',
    field: 'config.iocSync',
    type: 'checkbox'
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      }
    ],
    label: '环境地址',
    field: 'config.iocAddress',
    type: 'input',
    elAttrs: {
      placeholder: 'http://ip:port'
    },
    cache: true,
    cacheKey: 'iocAddress',
    model: 'blur'
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      }
    ],
    label: '账号密码',
    field: 'config.iocAuthInfo',
    type: 'input',
    elAttrs: {
      placeholder: '可不填，默认为 developer/a1234567'
    },
    elProps: {
    },
    cache: true,
    cacheKey: 'iocAuthInfo',
    model: 'blur'
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      }
    ],
    label: 'AppId',
    field: 'config.iocAppId',
    type: 'input',
    elAttrs: {
      placeholder: '请输入'
    }
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      }
    ],
    label: '类型',
    field: 'config.iocAppType',
    type: 'select',
    options: [
      {
        label: '小程序',
        value: 'mp'
      },
      {
        label: '卡片',
        value: 'card'
      }
    ]
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      }
    ],
    label: '发布方式',
    field: 'config.iocSyncMethod',
    type: 'select',
    options: [
      {
        label: '初始创建',
        value: 'create'
      },
      {
        label: '更新',
        value: 'update'
      }
    ]
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      },
      {
        field: 'config.iocAppType',
        value: 'mp'
      }
    ],
    label: '应用类型',
    field: 'config.iocApplicationType',
    type: 'select',
    options: [
      {
        label: '小屏',
        value: 3
      },
      {
        label: '中屏',
        value: 4
      }
    ]
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      }
    ],
    label: '卡片或小程序名称',
    field: 'config.iocAppName',
    type: 'input',
    elAttrs: {
      placeholder: '请输入'
    }
  },
  {
    relation: [
      {
        field: 'config.iocSync',
        value: true
      },
      {
        field: 'config.iocAppType',
        value: 'card'
      }
    ],
    label: '卡片 componentSymbol',
    field: 'config.iocComponentSymbol',
    type: 'input',
    elAttrs: {
      placeholder: '请输入'
    }
  }
  // {
  //   relation: [
  //     {
  //       field: 'config.iocSync',
  //       value: true
  //     },
  //     {
  //       field: 'config.iocAppType',
  //       value: 'mp'
  //     }
  //   ],
  //   label: '小程序图标',
  //   field: 'config.iocAppIcon',
  //   type: 'image',
  //   elAttrs: {
  //     placeholder: '请输入'
  //   }
  // }
]
