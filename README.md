# admin-editor

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
