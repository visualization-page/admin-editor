<template>
  <div
    v-if="currentNode && currentNode.id !== '-1' && position"
    class="edit-wrap"
    :style="position"
  >
    <resizer
      v-if="currentNode.outDocFlow"
      @context="handleContext"
    />
  </div>
</template>

<script lang="js">
import { watch, onMounted, reactive, toRefs } from '@vue/composition-api'
import Resizer from './resize/index.vue'
import { currentNode } from '@/assets/node'
import { setPosition } from './context-menu/position'
// import { tabName, setTabName } from '@/assets/tab'
import { editWrapState, setEditWrapState, editNode, editWrapCacheNode } from '@/assets/render'

export default {
  components: {
    Resizer
  },

  props: {
    getScrolltop: Function
  },

  setup (p, ctx) {
    const state = reactive({
      position: null,
      parentPosition: null
    })
    // const nodeElCache = {}
    const setEditBounding = (el) => {
      if (el) {
        const { left, top, width, height } = el.getBoundingClientRect()
        setEditWrapState(null, { left, top, width, height })
      }
    }
    const resetEditWrapByStyle = (node) => {
      if (node) {
        // console.log('节点变化，重置 edit wrap', node.id, style, className)
        // setTabName(['', '', tabName.nodeProperty])
        if (!editWrapCacheNode[node.id]) {
          editWrapCacheNode[node.id] = ctx.parent.$refs.scrollContainer.querySelector(`[data-id="${node.id}"]`)
        }
        // console.log(node.style.positionType)
        const el = editWrapCacheNode[node.id]
        setEditBounding(el)
      }
    }
    // 样式变化，重置编辑框大小
    watch(() => editNode.value, el => setEditBounding(el), { lazy: true })
    watch(() => currentNode.value, node => resetEditWrapByStyle(node), { lazy: true, deep: true })

    onMounted(() => {
      setTimeout(() => {
        state.parentPosition = ctx.parent.$el.getBoundingClientRect()
        watch(() => editWrapState, edit => {
          const { left, top, width, height } = edit.style
          // const containerScrollTop = ctx.parent.$refs.scrollContainer.scrollTop
          const containerScrollTop = p.getScrolltop()
          const mobileHeaderHeight = 65
          // console.log(ctx.parent.$el, top, state.parentPosition.top, mobileHeaderHeight, containerScrollTop)
          state.position = {
            left: left - state.parentPosition.left + 'px',
            top: top - state.parentPosition.top - mobileHeaderHeight + containerScrollTop + 2 + 'px',
            width: width + 'px',
            height: height + 'px'
          }
        }, { lazy: true, deep: true })
      }, 100)
    })

    const handleContext = (e) => {
      e.preventDefault()
      // handleClick(e)
      setPosition(e)
    }

    return {
      ...toRefs(state),
      currentNode,
      handleContext
    }
  }
}
</script>

<style lang="less">
.edit-wrap {
  position: absolute;
  border: 1px #409eff dashed;
  background-color: rgba(#409eff, .4);
  pointer-events: none;
  z-index: 9998;
}
</style>
