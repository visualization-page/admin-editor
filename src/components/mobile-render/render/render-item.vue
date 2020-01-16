<script lang="tsx">
import { createComponent, createElement } from '@vue/composition-api'
import { NodeItem, currentNode, setCurrentNode } from '@/assets/node'

export default createComponent<{ nodes: NodeItem[] }>({
  name: 'RenderItem',
  props: {
    nodes: Array
  },
  setup (props, ctx) {
    const renderDiv = (item: NodeItem) => {
      return (
        <div class="render-item__div">
          { item.children.length ? renderChildren(item.children) : null }
        </div>
      )
    }
    const renderImg = (item: NodeItem) => {
      return <img width="100%" height="100%" />
    }
    const renderRichText = (item: NodeItem) => {
      const props = {
        class: 'render-item__rich-text',
        domProps: {
          innerHTML: item.props.content
        }
      }
      return (
        <div {...props} />
      )
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

    return () => (
      <div class="render-item">
        {
          props.nodes.map(item => {
            const active = currentNode.value && currentNode.value.id === item.id
            const props = {
              style: { ...item.style },
              class: `render-item__item ${active ? 'active' : ''}`,
              key: item.id,
              on: {
                click (e) {
                  e.stopPropagation()
                  setCurrentNode(item)
                }
              }
            }
            if (item.outDocFlow) {
              // 合并位置
              if (item.style.position) {
                const arr = item.style.position.split(' ')
                const getNum = (num: string) => /px|vw|%/.test(num) ? num : undefined
                props.style.top = getNum(arr[0])
                props.style.right = getNum(arr[1])
                props.style.bottom = getNum(arr[2])
                props.style.left = getNum(arr[3])
              }
              // 设置 position
              props.style.position = item.style.positionType
            } else {
              props.style.position = undefined
            }
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
}
</style>
