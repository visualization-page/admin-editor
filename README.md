# admin-editor

## build basic component

```
node build/build.component.js [dir] false
```

## Type

内置全局对象

```typescript
type $$global = {
  constant: {
    [key: string]: any
  }
  cookie: {
    get: (name: string) => string | null
  }
  http: EscHttpInstance // json
  fhttp: EscHttpInstance // form
  toast: (message: string) => void
  loading: {
    open: () => void
    close: () => void
  }
  dialog: EscDialog
  toPage: (pageId: string, query?: {}) => void
  showNode: (nodeId: string) => void
  hideNode: (nodeId: string) => void
  getNodeProperty: (id, property) => any
  setNodeProperty: (id, property, val) => void
}
```

当前页面对象

```typescript
type $$page = {
  state: {
  }
} 
```

## Thinking

> 20/04/01 

是否有必要对内置对象挂载全局，或者转化挂载对象。例如 $$global 真的有必要挂载到 window 上吗？或者只是某个对象的 proxy

> 20/04/02

不挂载到 window 上，但 $$global 必须和 $$page 合并，因为在执行 fxCode 时，需要在当前上下文中查找到。最好是使用 `with({ $$global, $$page }) {}` 办法。

> 20/04/04

- 添加环境配置选项

```js
$$global.config = project.config = {
  dev: {
  
  },
  pro: {
  
  }
}
```

- 编辑器或预览时 http 请求跨域的问题
- 测试环境部署：系统在测试环境部署 api.jituancaiyun.net 域名，测试就可以直接用系统测。
- 多省活动发布流程：系统将文件拷贝到git工程，并提交git，然后发布系统发布。
- 组件引用的绝对地址可配置，project.componentAbsoluteUrl

> 20/04/05

- 组件或模版需要更新升级，如何做到？
- 自己上传的组件要支持下载，同时还要支持下载模版创建自定义组件
- 上传的组件要保存源文件，供下载

> 20/04/06

- 优化上传自定义组件时，webpack 编译出错日志提示
- 自定义组件/内置组件/组件库的渲染，和编辑时的状态还需要优化

> 20/04/08

- 优化登录，node 写服务中转登录和选择企业这部分
- 复制项目功能
- 下载项目，直接去 release/ 目录压缩 zip 下载
- 导入项目需要通过 zip 压缩包(包含 data.json)

> 20/04/09

- 需要新增列表容器组件，用于 v-for 循环输出，绑定 state

> 20/04/10

- 需要透出页面的url，并提供 copy 
- 节点大小变化时，编辑框也需要跟着变化
- 列表容器的 subNodeType 
- 组件列表用 grid 布局
