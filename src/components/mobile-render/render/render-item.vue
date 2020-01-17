<script lang="tsx">
import { createComponent, createElement } from '@vue/composition-api'
import { NodeItem, currentNode, setCurrentNode } from '@/assets/node'
import { isEdit } from '@/assets/render'

const renderDiv = (item: NodeItem) => {
  return item.children.length ? renderChildren(item.children) : null
}
const renderImg = (item: NodeItem) => {
  const _r = () => item.props.src && <img src={item.props.src} width="100%" height="100%" />
  return isEdit ? <div class="height-100 bg-f2">{ _r() }</div> : _r()
}
const renderRichText = (item: NodeItem) => {
  const props = {
    class: 'render-item__rich-text',
    domProps: {
      innerHTML: item.props.content
    }
  }
  return <div {...props} />
}
const renderChildren = (nodes: NodeItem[]) => {
  return createElement('RenderItem', { props: { nodes } })
}
const renderItem = (item: NodeItem) => {
  if (item.type === 'div') {
    return renderDiv(item)
  } else if (item.type === 'img') {
    return renderImg(item)
  } else if (item.type === 'rich-text') {
    return renderRichText(item)
  } else if (item.children && item.children.length) {
    return renderChildren(item.children)
  }
}

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
    return () => (
      <div class="render-item height-100">
        {
          props.nodes.map(item => {
            const active = currentNode.value && currentNode.value.id === item.id
            const props = {
              style: { ...item.style },
              class: `render-item__item ${active ? 'active' : ''} ${item.className}`,
              key: item.id,
              on: {
                click (e: any) {
                  e.stopPropagation()
                  setCurrentNode(item)
                }
              }
            }
            mergeDirectionSize(props.style, item.style.margin, 'margin')
            mergeDirectionSize(props.style, item.style.padding, 'padding')
            if (item.outDocFlow && item.style.position) {
              // 合并位置
              mergeDirectionSize(props.style, item.style.position, 'position')
            }
            props.style.position = item.outDocFlow ? item.style.positionType : undefined
            console.log(props.style)
            return (
              <div {...props}>
                { renderItem(item) }
              </div>
            )
          })
        }
      </div>
    )
  }
})
</script>

<style lang="less">
.render-item {
  &__item {
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
