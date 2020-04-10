<template>
  <div
    class="resize"
    @mousedown="e => handleResizeDown(e, 'move')"
    @contextmenu.prevent="e => $emit('context', e)"
    :style="outDocFlow && { cursor: 'move' }"
  >
    <div
      v-if="outDocFlow"
      class="resize__dot resize__dot-lt"
      @mousedown.stop="e => handleResizeDown(e, 'left-top')"
    />
    <div
      v-if="outDocFlow"
      class="resize__dot resize__dot-t"
      @mousedown.stop="e => handleResizeDown(e, 'top')"
    />
    <div
      v-if="outDocFlow"
      class="resize__dot resize__dot-tr"
      @mousedown.stop="e => handleResizeDown(e, 'top-right')"
    />
    <div
      v-if="outDocFlow"
      class="resize__dot resize__dot-lb"
      @mousedown.stop="e => handleResizeDown(e, 'left-bottom')"
    />
    <div
      class="resize__dot resize__dot-b"
      @mousedown.stop="e => handleResizeDown(e, 'bottom')"
    />
    <div
      v-if="outDocFlow"
      class="resize__dot resize__dot-br"
      @mousedown.stop="e => handleResizeDown(e, 'bottom-right')"
    />
    <div
      v-if="outDocFlow"
      class="resize__dot resize__dot-l"
      @mousedown.stop="e => handleResizeDown(e, 'left')"
    />
    <div
      class="resize__dot resize__dot-r"
      @mousedown.stop="e => handleResizeDown(e, 'right')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { currentNode } from '@/assets/node'
// import { getUnitValue } from '@/assets/util'
import { state, percent2px } from './state'
import { editWrapState } from '@/assets/render'

export default defineComponent({
  setup () {
    const handleResizeDown = (e: MouseEvent, dir: string) => {
      // const node = currentNode.value!
      state.startX = e.x
      state.startY = e.y
      state.dragging = true
      state.dir = dir
      if (editWrapState.style) {
        state.width = percent2px(String(editWrapState.style.width), 'horizontal')
        state.height = percent2px(String(editWrapState.style.height), 'vertical')
        state.left = percent2px(String(editWrapState.style.left), 'horizontal')
        state.top = percent2px(String(editWrapState.style.top), 'vertical')
      }
    }
    // const showContextMenu = (e: MouseEvent) => {
    //   handleClick()
    // }
    // const handleClick = () => {
    //   setCurrentNode(props.item)
    // }
    return {
      handleResizeDown,
      // showContextMenu,
      // handleClick,
      outDocFlow: computed(() => currentNode.value && currentNode.value.outDocFlow)
    }
  }
})
</script>

<style lang="less">
.resize {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  // z-index: 1;
  &__dot {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px #409eff solid;
    background-color: #ffffff;
    border-radius: 50%;
    z-index: 9998;
    &:hover {
      background-color: #f2f2f2;
    }
    &-lt {
      top: -6px;
      left: -6px;
      cursor: nw-resize;
    }
    &-t {
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      cursor: n-resize;
    }
    &-tr {
      top: -6px;
      right: -6px;
      cursor: ne-resize;
    }
    &-lb {
      bottom: -6px;
      left: -6px;
      cursor: sw-resize;
    }
    &-b {
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      cursor: s-resize;
    }
    &-br {
      bottom: -6px;
      right: -6px;
      cursor: se-resize;
    }
    &-l {
      top: 50%;
      left: -6px;
      transform: translateY(-50%);
      cursor: w-resize;
    }
    &-r {
      top: 50%;
      right: -6px;
      transform: translateY(-50%);
      cursor: e-resize;
    }
  }
}
</style>
