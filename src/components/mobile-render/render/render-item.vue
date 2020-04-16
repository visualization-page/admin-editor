<script lang="tsx">
import Vue from 'vue'
import { defineComponent, createElement } from '@vue/composition-api'
import { NodeItem, findNode, setCurrentNode } from '@/assets/node'
import { isEdit, setEditWrapNode } from '@/assets/render'
import { FormEvent } from '@/assets/event'
import { parseCodeValid, deepMerge } from '@/assets/util'
// import EditWrap from '../edit-wrap.vue'
import { dealFx, getEventHandler } from './utils'
import { setTabName, tabName } from '@/assets/tab'

Vue.directive('insert-id', function (el, binding) {
  el.setAttribute('data-id', binding.value)
})

const mergeDirectionSize = (target: any, obj: any, type: 'position' | 'margin' | 'padding' | 'border') => {
  if (typeof obj !== 'object') {
    return
  }
  const isBorder = type === 'border'
  if (type === 'position') {
    Object.assign(target, obj)
  } else {
    const newObj: any = {}
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
  globalConfig: { [k: string]: any }
}>({
  name: 'RenderItem',
  props: {
    nodes: Array,
    pageConfig: Object,
    globalConfig: Object
  },
  // errorCaptured (err, vm, info) {
  //   console.log(err, vm, info)
  //   return false
  // },
  // renderError (h, err) {
  //   return h('pre', { style: { color: 'red' } }, err.stack)
  // },
  setup (superProps, ctx) {
    const renderItem = (
      items: NodeItem[],
      $$page: { [k: string]: any },
      $$global: { [k: string]: any },
      $$listBind: { [k: string]: any } = { item: {}, index: -1 }
    ) => {
      const codeExecuteContext = { $$global, $$page, $$listBind }
      return items.filter(x => {
        // 判断 v-if
        let vIf = true
        if (x.vIf) {
          const res = dealFx({ vIf: x.vIf }, codeExecuteContext)
          vIf = !!res.vIf
        }
        return x.show && vIf
      }).map((item, index) => {
        const isLibrary = item.nodeType === 1 << 2
        // const active = currentNode.value && currentNode.value.id === item.id
        // 处理事件
        const on: any = {}
        const nativeOn: any = {}
        item.events.forEach((ev: FormEvent) => {
          const handler = () => getEventHandler(ev, codeExecuteContext)
          if (ev.eventType === 'click') {
            nativeOn[ev.eventType] = handler
          } else {
            on[ev.eventType] = handler
          }
        })

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
                setTabName([tabName.nodeTree, '', tabName.nodeProperty])
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
          style: {
            ...item.style,
            // 处理圆角
            borderRadius: item.style.borderRadius === '0px' ? undefined : item.style.borderRadius
          },
          class: [
            'render-item__item',
            item.className
          ],
          key: item.id + index,
          on,
          nativeOn,
          props: dealFx(item.props, codeExecuteContext),
          attrs: {
            'data-id': item.id
          },
          directives: []
        }
        mergeDirectionSize(props.style, item.style.margin, 'margin')
        mergeDirectionSize(props.style, item.style.padding, 'padding')
        mergeDirectionSize(props.style, item.style.border, 'border')
        // 合并位置
        if (item.outDocFlow && item.style.position) {
          mergeDirectionSize(props.style, item.style.position, 'position')
        }
        props.style.position = item.outDocFlow ? item.style.positionType : undefined
        if (props.style.position === undefined) {
          props.style.zIndex = undefined
        }
        // 处理 style.code
        const styleCodeRes = parseCodeValid(props.style.code, codeExecuteContext)
        if (styleCodeRes.ok) {
          deepMerge(props.style, styleCodeRes.value)
        } else {
          console.log(props.style.code, styleCodeRes.msg)
          throw styleCodeRes.msg
        }
        let children: any[] = []
        if (item.type === 'div') {
          // 处理子节点
          if (item.nodeType === 1 << 0 && item.bindState) {
            // 列表容器循环输出
            const bindVal = parseCodeValid(item.bindState, codeExecuteContext)
            if (bindVal.ok) {
              // children 用 list-item 循环输出
              children = (Array.isArray(bindVal.value) ? bindVal.value! : []).map((listBindData, listBindIndex) => {
                const $$listBind = { item: listBindData, index: listBindIndex }
                return renderItem(item.children, superProps.pageConfig, superProps.globalConfig, $$listBind)
              })
            }
          } else {
            children = renderItem(item.children, superProps.pageConfig, superProps.globalConfig, $$listBind)
          }
        }
        const _renderItemSelf = () => {
          if (isLibrary) {
            const { ok, value } = parseCodeValid(item.renderString, codeExecuteContext)
            if (ok && value) {
              const libraryOpt = value! as {
                template?: string
                methods?: any,
                option?: any,
                children?: any[]
                data?: any
              }
              // 方式1：模版写法解析
              if (libraryOpt.template) {
                const res = Vue.compile(libraryOpt.template)
                const v = Object.assign(
                  ctx.parent,
                  libraryOpt.data ? libraryOpt.data() : {},
                  libraryOpt.methods ? libraryOpt.methods : {}
                )
                v.ym = codeExecuteContext
                // console.log(v)
                const vn = res.render.call(v, createElement)
                return createElement('basic-div', props, [vn].concat(children))
              }
              // 方式2：手写vNode，合并选项
              deepMerge(props, libraryOpt.option)
              // 第三方组件无法通过 attrs 绑定 data-id
              // 通过指令实现
              // @ts-ignore
              props.directives.push({ name: 'insert-id', value: item.id })
              return createElement(item.name, props, (libraryOpt.children || []).concat(children))
            }
          }
          return createElement(item.componentName, props, children)
        }
        return _renderItemSelf()
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

<style lang="less">
.render-item {
  &__item {
  }
  .center-v {
    top: 50%;
    transform: translateY(-50%)
  }
  .center-h {
    left: 50%;
    transform: translateX(-50%)
  }
  .center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }
}
</style>
