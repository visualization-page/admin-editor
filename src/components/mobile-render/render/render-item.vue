<script lang="tsx">
import { createComponent, createElement } from '@vue/composition-api'
import { NodeItem, currentNode } from '@/assets/node'
import { isEdit } from '@/assets/render'
import EditWrap from '../edit-wrap.vue'
import ContextMenu from '../context-menu/index.vue'

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

export default createComponent<{ nodes: NodeItem[] }>({
  name: 'RenderItem',
  props: {
    nodes: Array
  },
  setup (props, ctx) {
    const renderItem = (items: NodeItem[]) => {
      return items.filter(x => x.show).map(item => {
        const active = currentNode.value && currentNode.value.id === item.id
        // `${active ? ' active' : ''} ${}`
        const props = {
          style: { ...item.style },
          class: ['render-item__item', { active }, item.className],
          key: item.id,
          on: {},
          props: item.props
        }
        mergeDirectionSize(props.style, item.style.margin, 'margin')
        mergeDirectionSize(props.style, item.style.padding, 'padding')
        if (item.outDocFlow && item.style.position) {
          // 合并位置
          mergeDirectionSize(props.style, item.style.position, 'position')
        }
        props.style.position = item.outDocFlow ? item.style.positionType : undefined
        // console.log(props.style)
        const children: any = item.type === 'div' ? renderItem(item.children) : []
        if (isEdit()) {
          return createElement('div', {
            style: props.style,
            class: props.class
          }, [
            createElement(EditWrap, { props: { item, active } }),
            createElement(item.componentName, {
              props: props.props,
              class: 'width-100 height-100'
            }, children)
          ])
        }
        return createElement(item.componentName, props, children)
      })
    }

    return () => createElement(
      'div',
      { class: 'render-item', attrs: {} },
      renderItem(props.nodes).concat(createElement(ContextMenu))
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
  &__img-bg {
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
