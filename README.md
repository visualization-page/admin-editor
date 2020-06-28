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
    
> 20/04/17

- pc 适配 vw 单位    
    - 具体：pc 上为 375 的预览尺寸，无需要做处理，将vw替换为px显示就行
    - 在 mobile 上，需要将具体数值 / 3.75
- 活动脚本库，比如摇一摇
- 登录改为 web 版自行登录
- 发布配置
    - 省份
    - 目标机器目录
- 内置组件直接打包到 vendors 内

> 20/04/19

- 全局工具函数
- 组件的增删改查

> 20/04/19
- 更改发布逻辑
- 登录改为证书登录
- library 在打包时按需引入

> 20/04/20

- 列表项目搜索
- fix: 当拖拽节点后/edit-wrap缓存的节点变化了，导致无法选中
- feat: native share
- 支持模版字符串
- 对于脱离文档流的元素，提供快捷方法：垂直居中/水平居中/居中

> 20/04/22

- 事件编辑器中，优化代码编辑框

> 20/04/23

- 图片组件支持直接上传
- 封装组件需要提供截图再上传得到链接
- 调整富文本组件 props，以适配 vw 单位

> 20/04/24

- 优化自定义组件依赖与下载逻辑，与之相关的组合组件依赖，删除等逻辑
- [ ] 新增页面模版
- [ ] 增加项目版本控制

> 20/04/26

- [x] umd 组件库管理
    - cdn 链接引入
    - 发布后下载 cdn 到项目中
- [x] 增加项目初始化脚本  

> 20/04/27

- [ ] 设置 vConsole 指定名单可见，或通过开关

> 20/04/28

- [x] 脱离文档流的节点开启 resizer

> 20/04/29

- [x] 图片上传新增 tinypng 压缩

> 20/05/05

- [x] 绑定状态 和 循环绑定提供 面板选择变量
- [x] 阴影选项
- [ ] 编辑时默认打开的页面及链接参数设置
- [x] 设置首页

> 20/05/08

- [ ] 优化 template 写法
- [x] 支持 $refs
- [x] 页面添加 methods

> 20/05/11

- [x] 添加工具函数库、一键添加工具函数、重复检测
- [x] 新增 v-show

> 20/05/12

- [x] 优化加载时间

> 20/05/14

- [x] 图片添加预览操作
- [x] 新增图片清单，可以通过图片定位节点

> 20/05/18

- 复制时先输入文件夹名称，再校验。将发布配置清空，否则是危险操作。复制一下就成编辑中了。

> 20/05/19

- [ ] 定时文件备份

> 20/05/22

- 全局 css 兼容vw
- 增加角色入口，对于非开发人员，平铺所有文本/图片，以供修改。

> 20/05/28

- [x] VanActionSheet v-model 不渲染
- [x] 切换页面时，全局状态 $$global 未重置
- [x] sdk 优化，拆分 native 和 小程序 sdk，根据不同的配置内置
- [x] 优化 manaco editor
  ```html
    options="{
      fontSize: 14,
      showUnused: true,
      smoothScrolling: true,
      tabCompletion: 'on',
      tabSize: 2,
      formatOnPaste: true,
      detectIndentation: false
    }
  ```
  
> 20/06/01  
- [x] 内部跳转 toPage 新增第三个参数 `{ method: 'replace' | 'push' }`  

> 20/06/10 

- [x] 增加页面钩子函数 beforeRouteLeave

> 20/06/14

- [x] 极简版发布

> 20/06/22

- [x] 项目环境选择

> 20/06/28

- [ ] 列表添加分页
