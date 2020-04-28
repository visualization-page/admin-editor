<template>
  <div class="resize">
    <div
      class="resize__move"
      @mousedown="e => handleResizeDown(e, 'move')"
      @contextmenu.prevent="e => $emit('context', e)"
    >
      <i class="el-icon-full-screen f16 c-blue"/>
    </div>
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
import { defineComponent } from '@vue/composition-api'
// import { currentNode } from '@/assets/node'
import { getUnitValue } from '@/assets/util'
import { state } from './state'
// import { editWrapState } from '@/assets/render'

export default defineComponent({
  setup (p, ctx) {
    const handleResizeDown = (e: MouseEvent, dir: string) => {
      // const node = currentNode.value!
      state.startX = e.x
      state.startY = e.y
      state.dragging = true
      state.dir = dir
      // @ts-ignore
      const position = ctx.parent.position
      state.width = getUnitValue(position.width)
      state.height = getUnitValue(position.height)
      state.left = getUnitValue(position.left)
      state.top = getUnitValue(position.top)
    }
    return {
      handleResizeDown,
      // showContextMenu,
      // handleClick,
      outDocFlow: true
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
  &__move {
    position: absolute;
    // width: 15px;
    // height: 15px;
    // background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: move;
    pointer-events: all;
  }
  &__dot {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px #409eff solid;
    background-color: #ffffff;
    border-radius: 50%;
    z-index: 9998;
    pointer-events: all;
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
