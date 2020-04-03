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


