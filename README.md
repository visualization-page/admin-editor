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

> 20/04/11

- code 代码在发布正式版本时通过 babel 转译，然后再嵌入到 html 中

> 20/04/12

- 提供自定义组件模版
- 全局style 代码块，来支持覆写第三方 class
- 代码块转译
- babel-polyfill 在 render 时全量 CDN 引入

> 20/04/13

- 项目工程分支的问题，要区分至少 develop 和 master
- 页面复制功能
- 添加操作 【撤销/不撤销】
- vantForm 打通
- 项目编辑加锁
    - 点击编辑，自动加锁，5min 倒计时 project 无变化则自动保存后解锁，否则清除倒计时重新计时
    - 退出编辑页面，解锁
    - 加锁状态，无权限操作（编辑/删除）

> 20/04/14

- 优化正式版代码内容，通过 render build 时 webpackName 标注 来剔除无关文件

> 20/04/15

- 增加 页面模型与节点绑定的清单，便于快速定位到哪个节点用了哪个state
- 第三方组件手写 vNode 改成写 template，用 vue 的运行时 compiler 去解析。
- 添加获取路由/参数

> 20/04/16

- 添加页面事件调用函数
- 思考：如果需求无法实现怎么办？
    - 考虑正式版在构建的时候，以页面维度进行拆分，生成具体的页面文件代码？
