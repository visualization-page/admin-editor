<script lang="tsx">
import Vue, { VNodeData, VNode } from 'vue'
import { defineComponent, createElement } from '@vue/composition-api'
import { NodeItem, findNode, setCurrentNode } from '@/assets/node'
import { isEdit, setEditWrapNode } from '@/assets/render'
import { FormEvent } from '@/assets/event'
import { parseCodeValid, deepMerge, deepClone } from '@/assets/util'
import { dealFx, getEventHandler, isPc } from './utils'
import { setTabName, tabName } from '@/assets/tab'

Vue.directive('insert-id', function (el, binding) {
  el.setAttribute('data-id', binding.value)
})

const mergeDirectionSize = (
  target: any,
  styleObj: any,
  type: 'position' | 'margin' | 'padding' | 'border'
) => {
  if (typeof styleObj !== 'object') {
    return
  }
  const obj = deepClone(styleObj)
  const isBorder = type === 'border'
  if (type === 'position') {
    Object.assign(target, obj)
  } else {
    const newObj: any = {}
    if (isBorder) {
      // 补齐其它边
      ['top', 'right', 'bottom', 'left'].forEach(dir => {
        obj[dir] = obj[dir] || 0
      })
    }
    Object.keys(obj).forEach(k => {
      newObj[`${type}${k[0].toUpperCase()}${k.slice(1)}${isBorder ? 'Width' : ''}`] = obj[k]
    })
    Object.assign(target, newObj)
  }
  delete target[type]
}

export default defineComponent<{
  nodes: NodeItem[],
  pageConfig: { [k: string]: any },
  globalConfig: { [k: string]: any },
  staticConfig: { [k: string]: any }
}>({
  name: 'RenderItem',
  props: {
    nodes: Array,
    pageConfig: Object,
    globalConfig: Object,
    staticConfig: Object
  },
  // errorCaptured (err, vm, info) {
  //   console.log(err, vm, info)
  //   return false
  // },
  // renderError (h, err) {
  //   return h('pre', { style: { color: 'red' } }, err.stack)
  // },
  setup (superProps, ctx) {
    // 处理 vw 单位
    const _dealVw = (obj: any) => {
      Object.keys(obj).forEach(k => {
        if (k !== 'code' && typeof obj[k] === 'string') {
          if (isPc) {
            obj[k] = obj[k].replace(/vw/, 'px')
          } else if (/vw/.test(obj[k])) {
            const val = Number(obj[k].replace('vw', ''))
            obj[k] = (val / (superProps.staticConfig.vwBase / 100)).toFixed(2) + 'vw'
          }
        }
      })
    }
    // 渲染 item
    const _renderItemSelf = (item: NodeItem, props: VNodeData, codeExecuteContext: any, children: VNode[]) => {
      const isLibrary = item.nodeType === 1 << 2
      if (isLibrary) {
        let renderString = item.renderString
        // spa 写法
        if (item.subType === 'spa') {
          // console.log(renderString)
          // 先将 $$ 替换，$ 是正则特殊字符
          renderString = renderString.replace(/\$\$/g, '%%')
          // 提取 template 和 script
          const matchTemplate = renderString.match(/<template>([\s\S]+)<\/template>/)
          const matchScript = renderString.match(/<script>([\s\S]+)<\\*\/script>/)
          if (matchTemplate && matchScript) {
            const tpl = JSON.stringify(matchTemplate[1])
            renderString = matchScript[1]
              .replace('methods:', `template:${tpl},\nmethods:`)
              .replace(/(%%)/g, () => {
                return '$$'
              })
          }
        }
        const { ok, msg, value } = parseCodeValid(renderString, codeExecuteContext)
        if (ok && value) {
          const libraryOpt = value! as {
            template?: string
            methods?: any,
            option?: any,
            children?: any[]
          }
          // 方式1：模版写法解析
          if (libraryOpt.template) {
            const res = Vue.compile(libraryOpt.template)
            const mockVNodePrototype = Object.create(ctx.parent)
            const mockVNode = Object.assign(
              mockVNodePrototype,
              {
                $options: { staticRenderFns: res.staticRenderFns },
                ym: codeExecuteContext,
                render: res.render
              },
              libraryOpt.methods ? libraryOpt.methods : {}
            )
            const v = mockVNode.render()
            if (v.data) {
              deepMerge(v.data, props)
            } else {
              v.data = props
            }
            v.children = (v.children || []).concat(children)
            if (isEdit()) {
              v.data.on.click = v.data.nativeOn.click
            }
            // console.log(v.data)
            return v
          }
          // 方式2：手写vNode，合并选项
          deepMerge(props, libraryOpt.option)
          // 第三方组件无法通过 attrs 绑定 data-id
          // 通过指令实现
          // @ts-ignore
          props.directives.push({ name: 'insert-id', value: item.id })
          return createElement(item.name, props, (libraryOpt.children || []).concat(children))
        } else {
          console.log(`渲染节点出错：【${item.title}】${msg}\n${item.renderString}`)
        }
      }
      return createElement(item.componentName, props, children)
    }

    const renderItem = (
      items: NodeItem[],
      $$page: { [k: string]: any },
      $$global: { [k: string]: any },
      $$listBind: { [k: string]: any } = { item: {}, index: -1 }
    ) => {
      const codeExecuteContext = { $$global, $$page, $$listBind, $$refs: ctx.parent!.$refs }
      return items.filter(x => {
        // 处理 v-if
        let vIf = true
        if (x.vIf) {
          const res = dealFx({ vIf: x.vIf }, codeExecuteContext)
          vIf = !!res.vIf
        }
        return x.show && vIf
      }).map((item) => {
        // 处理事件
        const on: any = {}
        const nativeOn: any = {}
        item.events.forEach((ev: FormEvent) => {
          const handler = () => getEventHandler(ev, codeExecuteContext)
          if (ev.eventType === 'click') {
            nativeOn[ev.eventType] = (e: Event) => {
              e.stopPropagation()
              handler()
            }
          } else {
            on[ev.eventType] = handler
          }
        })
        // 编辑器页面添加点击事件
        // 绘制焦点框和设置为当前节点
        if (isEdit()) {
          nativeOn.click = (e: any) => {
            const el = document.elementFromPoint(e.x, e.y)
            if (el) {
              let reallyEl: Element = el
              if (el.classList.contains('resize')) {
                return
              }
              while (!reallyEl.getAttribute('data-id') && reallyEl.tagName !== 'BODY') {
                // @ts-ignore
                reallyEl = reallyEl.parentNode!
              }
              const id = reallyEl.getAttribute('data-id')
              if (id) {
                setEditWrapNode(reallyEl)
                setTabName([tabName.nodeTree, '', tabName.nodeProperty, '', tabName.pageSetTree, tabName.nodeSetProperty])
                const node = findNode(id)
                if (node) {
                  setCurrentNode(node.data)
                }
              }
            }
          }
        }
        // 处理 props
        const props = {
          style: deepClone(item.style),
          class: ['render-item__item', dealFx({ cls: item.className }, codeExecuteContext).cls]
            .concat(item.quickToolsAddClass || []),
          key: item.id,
          on,
          nativeOn,
          props: dealFx(item.props, codeExecuteContext),
          attrs: { 'data-id': item.id },
          directives: []
        }
        mergeDirectionSize(props.style, item.style.margin, 'margin')
        mergeDirectionSize(props.style, item.style.padding, 'padding')
        mergeDirectionSize(props.style, item.style.border, 'border')
        // 处理圆角
        if (item.style.borderRadius === '0px') {
          delete props.style.borderRadius
        }
        // 合并位置
        if (item.outDocFlow && item.style.position) {
          mergeDirectionSize(props.style, item.style.position, 'position')
        }
        // 处理背景图片
        if (item.style.backgroundImage) {
          const { bg } = dealFx({ bg: item.style.backgroundImage }, codeExecuteContext)
          props.style.backgroundImage = `url(${bg})`
        }
        props.style.position = item.outDocFlow ? item.style.positionType : undefined
        if (props.style.position === undefined) {
          delete props.style.zIndex
        }
        // 处理 vw 单位
        _dealVw(props.style)
        // 处理样式补充代码
        const styleCodeRes = parseCodeValid(props.style.code, codeExecuteContext)
        if (styleCodeRes.ok) {
          _dealVw(styleCodeRes.value)
          deepMerge(props.style, styleCodeRes.value)
        } else {
          console.warn('[butterfly] 解析样式补充代码出错', props.style.code, styleCodeRes.msg)
          throw styleCodeRes.msg
        }
        // 处理 v-show
        if (item.vShow) {
          const res = dealFx({ vShow: item.vShow }, codeExecuteContext)
          if (!res.vShow) {
            props.style.display = 'none'
          }
        }
        // 处理子节点
        const children: any[] = []
        if (item.type === 'div') {
          if (item.nodeType === 1 << 0 && item.bindState) {
            // 列表容器循环输出
            const bindVal = parseCodeValid(item.bindState, codeExecuteContext)
            if (bindVal.ok && Array.isArray(bindVal.value)) {
              const bindValue: Array<{ item: any, index: number }> = bindVal.value!
              Array.prototype.push.apply(
                children,
                bindValue.map(
                  (it, index) => renderItem(
                    item.children,
                    superProps.pageConfig,
                    superProps.globalConfig,
                    { item: it, index }
                  )
                )
              )
            }
          } else {
            Array.prototype.push.apply(
              children,
              renderItem(
                item.children,
                superProps.pageConfig,
                superProps.globalConfig,
                $$listBind
              )
            )
          }
        }
        return _renderItemSelf(item, props, codeExecuteContext, children)
      })
    }

    return () => createElement(
      'div',
      { class: 'render-item', attrs: {} },
      renderItem(
        superProps.nodes,
        superProps.pageConfig,
        superProps.globalConfig
      )
    )
  }
})
</script>
