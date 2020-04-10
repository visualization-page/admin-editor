<script lang="tsx">
import { defineComponent, createElement } from '@vue/composition-api'
import { NodeItem, currentNode, findNode, setCurrentNode } from '@/assets/node'
import { isEdit, setEditWrapNode } from '@/assets/render'
import { FormEvent } from '@/assets/event'
import { parseCodeValid } from '@/assets/util'
import EditWrap from '../edit-wrap.vue'
import { dealFx, getEventHandler } from './utils'

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
  setup (superProps) {
    const renderItem = (
      items: NodeItem[],
      $$page: { [k: string]: any },
      $$global: { [k: string]: any },
      $$listBind?: { [k: string]: any }
    ) => {
      const codeExecuteContext = { $$global, $$page, $$listBind }
      // const isEditState = isEdit()
      // const isEditState = false
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
        const active = currentNode.value && currentNode.value.id === item.id
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
              let reallyEl = el
              let num = 0
              if (el.classList.contains('resize')) {
                console.log('render-item.vue line 78 find node => .resize element')
                return
              }
              while (!reallyEl.getAttribute('data-id') && num < 5) {
                num++
                // @ts-ignore
                reallyEl = reallyEl.parentNode
              }
              const id = reallyEl.getAttribute('data-id')
              if (id) {
                // console.log(reallyEl)
                setEditWrapNode(reallyEl)
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
            // border: item.style.border ? 'none' : undefined
          },
          class: [
            'render-item__item',
            item.className
            // `node-${item.id}`
          ],
          key: item.id,
          on,
          nativeOn,
          props: dealFx(item.props, codeExecuteContext),
          attrs: {
            // id: `${item.id}`
            'data-id': item.id
          }
        }
        mergeDirectionSize(props.style, item.style.margin, 'margin')
        mergeDirectionSize(props.style, item.style.padding, 'padding')
        mergeDirectionSize(props.style, item.style.border, 'border')
        if (item.outDocFlow && item.style.position) {
          // 合并位置
          mergeDirectionSize(props.style, item.style.position, 'position')
        }
        // if (props.style.borderColor) {
        //   console.log(JSON.stringify(props.style))
        // }
        props.style.position = item.outDocFlow ? item.style.positionType : undefined
        if (props.style.position === undefined) {
          props.style.zIndex = undefined
        }
        // 处理 style.code
        const styleCodeRes = parseCodeValid(props.style.code, codeExecuteContext)
        if (styleCodeRes.ok) {
          // delete props.style.code
          props.style = {
            code: undefined,
            ...props.style,
            // @ts-ignore
            ...styleCodeRes.value
          }
        } else {
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
          // if (isEditState) {
          //   if (isLibrary) {
          //     const { ok, value } = parseCodeValid(item.renderString, codeExecuteContext)
          //     if (ok && value) {
          //       return createElement(item.name, {
          //         // @ts-ignore
          //         ...(value.option || {}),
          //         class: ['height-100', item.className]
          //         // @ts-ignore
          //       }, value.children.concat(children))
          //     }
          //   }
          //   // return createElement(item.componentName, {
          //   //   // 编辑时，组件本身关心 props 就好
          //   //   props: props.props,
          //   //   class: ['width-100 height-100']
          //   // }, children)
          // }
          if (isLibrary) {
            const { ok, value } = parseCodeValid(item.renderString, codeExecuteContext)
            if (ok && value) {
              return createElement(item.name, {
                ...props,
                // @ts-ignore
                ...(value.option || {})
                // @ts-ignore
              }, value.children.concat(children))
            }
          }
          return createElement(item.componentName, props, children)
        }

        // if (isEditState) {
        //   return createElement('div', {
        //     class: ['edit-wrap-parent', { active }],
        //     key: props.key
        //   }, [
        //     createElement(EditWrap, {
        //       props: { item, active },
        //       class: props.class,
        //       style: props.style
        //     }, [ _renderItemSelf() ])
        //   ])
        //   // return createElement(EditWrap, {
        //   //   props: { item, active } }, [ _renderItemSelf() ])
        // }
        return _renderItemSelf()
      })
    }

    return () => createElement(
      'div',
      { class: 'render-item', attrs: {} },
      renderItem(superProps.nodes, superProps.pageConfig, superProps.globalConfig)
    )
  }
})
</script>

<style lang="less">
.render-item {
  &__item {
    /*position: relative;*/
    /*border: 1px transparent dashed;*/
    /*&.active {*/
    /*  border-color: #409eff;*/
    /*}*/
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
