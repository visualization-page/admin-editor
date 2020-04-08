<script lang="tsx">
import { defineComponent, createElement } from '@vue/composition-api'
import { NodeItem, currentNode } from '@/assets/node'
import { isEdit } from '@/assets/render'
import { FormEvent } from '@/assets/event'
import { parseCodeValid } from '@/assets/util'
import EditWrap from '../edit-wrap.vue'
import ContextMenu from '../context-menu/index.vue'
import { dealFx, getEventHandler } from './utils'

const mergeDirectionSize = (target: any, obj: any, type: 'position' | 'margin' | 'padding') => {
  if (typeof obj !== 'object') {
    return
  }
  if (type === 'position') {
    Object.assign(target, obj)
  } else {
    const newObj: any = {}
    Object.keys(obj).forEach(k => {
      newObj[`${type}${k[0].toUpperCase()}${k.slice(1)}`] = obj[k]
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
      $$global: { [k: string]: any }
    ) => {
      const codeExecuteContext = { $$global, $$page }
      const isEditState = isEdit()
      return items.filter(x => {
        // 判断 v-if
        let vIf = true
        if (x.vIf) {
          const res = dealFx({ vIf: x.vIf }, codeExecuteContext)
          vIf = !!res.vIf
        }
        return x.show && vIf
      }).map(item => {
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
        // 处理 props
        const props = {
          style: {
            ...item.style,
            // 处理圆角
            borderRadius: item.style.borderRadius === '0px' ? undefined : item.style.borderRadius
          },
          class: ['render-item__item', item.className, { active }],
          key: item.id,
          on,
          nativeOn,
          props: dealFx(item.props, codeExecuteContext)
        }
        mergeDirectionSize(props.style, item.style.margin, 'margin')
        mergeDirectionSize(props.style, item.style.padding, 'padding')
        if (item.outDocFlow && item.style.position) {
          // 合并位置
          mergeDirectionSize(props.style, item.style.position, 'position')
        }
        props.style.position = item.outDocFlow ? item.style.positionType : undefined
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
        const children: any = item.type === 'div'
          ? renderItem(item.children, superProps.pageConfig, superProps.globalConfig)
          : []
        const _renderItemSelf = () => {
          if (isEditState) {
            if (isLibrary) {
              const { ok, value } = parseCodeValid(item.renderString, codeExecuteContext)
              if (ok && value) {
                return createElement(item.name, {
                  // @ts-ignore
                  ...(value.option || {}),
                  class: ['height-100', item.className]
                  // @ts-ignore
                }, value.children.concat(children))
              }
            }
            return createElement(item.componentName, {
              // 编辑时，组件本身关心 props 就好
              props: props.props,
              class: ['width-100 height-100']
            }, children)
          }
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

        if (isEditState) {
          // 编辑时，容器需要带上组件样式，不用管事件
          return createElement('div', {
            style: props.style,
            class: [props.class, { dib: isLibrary }],
            key: props.key
          }, [ createElement(EditWrap, { props: { item, active } }, [ _renderItemSelf() ]) ])
        }
        return _renderItemSelf()
      })
    }

    return () => createElement(
      'div',
      { class: 'render-item', attrs: {} },
      renderItem(superProps.nodes, superProps.pageConfig, superProps.globalConfig)
        .concat(createElement(ContextMenu))
    )
  }
})
</script>

<style lang="less">
.render-item {
  &__item {
    position: relative;
    border: 1px transparent dashed;
    &.active {
      border-color: #409eff;
    }
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
