<script lang="tsx">
import { createComponent, createElement } from '@vue/composition-api'
import Resizer from './resize/index.vue'
import { setCurrentNode } from '@/assets/node'
import { setPosition, contextPosition } from './context-menu/position'
import { tabName, setTabName } from '@/assets/tab'

export default createComponent({
  props: {
    item: Object,
    active: Boolean
  },

  setup (props, ctx) {
    const handleClick = (e: any) => {
      // console.log('click edit wrap')
      e.stopPropagation()
      contextPosition.show = false
      // @ts-ignore
      setCurrentNode(props.item)
      setTabName(['', '', tabName.nodeProperty])
    }
    const handleContext = (e: MouseEvent) => {
      e.preventDefault()
      handleClick(e)
      setPosition(e)
    }

    return () => createElement('div', {
      class: 'edit-wrap',
      on: {
        click: handleClick,
        context: handleContext,
        contextmenu: handleContext
      }
    }, [
      props.active && createElement(Resizer, { props: { item: props.item } }),
      ctx.slots.default && ctx.slots.default()
    ])
  }
})
</script>

<style lang="less">
.edit-wrap {
  // position: absolute;
  width: 100%;
  height: 100%;
  // left: 0;
  // top: 0;
  // z-index: 1;
}
</style>
