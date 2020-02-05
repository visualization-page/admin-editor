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
// import Vue from 'vue'
import { createComponent, reactive, computed } from '@vue/composition-api'
import { currentNode, updateNodeStyle, updateNodePosition } from '@/assets/node'
import { getUnitValue } from '@/assets/util'

type UnitValue = { unit?: string, value?: string }
const state = reactive<{
  startX: number
  startY: number
  width: UnitValue
  height: UnitValue
  left: UnitValue
  top: UnitValue
  dragging: boolean
  dir: string
}>({
  startX: 0,
  startY: 0,
  width: {},
  height: {},
  left: {},
  top: {},
  dragging: false,
  dir: ''
})

document.addEventListener('mousemove', e => {
  if (state.dragging) {
    const node = currentNode.value!
    const _changeHeight = (symbol: 1 | -1) => {
      const h = Number(state.height.value) + (e.pageY - state.startY) * symbol
      if (h >= 0 && h <= 480) {
        updateNodeStyle({ height: `${h}px` })
      }
    }
    const _changeWidth = (symbol: 1 | -1) => {
      const w = Number(state.width.value) + (e.pageX - state.startX) * symbol
      if (w >= 0 && w <= 320) {
        updateNodeStyle({ width: `${w}px` })
      }
    }
    const _changeLeft = () => {
      updateNodePosition('left', `${Number(state.left.value || 0) + e.pageX - state.startX}px`)
    }
    const _changeTop = () => {
      updateNodePosition('top', `${Number(state.top.value || 0) + e.pageY - state.startY}px`)
    }
    // const
    if (state.dir === 'bottom') {
      _changeHeight(1)
    } else if (state.dir === 'right') {
      _changeWidth(1)
    } else if (node.outDocFlow) {
      if (state.dir === 'left') {
        _changeLeft()
        _changeWidth(-1)
      } else if (state.dir === 'top') {
        _changeTop()
        _changeHeight(-1)
      } else if (state.dir === 'top-right') {
        _changeTop()
        _changeWidth(1)
        _changeHeight(-1)
      } else if (state.dir === 'bottom-right') {
        _changeWidth(1)
        _changeHeight(1)
      } else if (state.dir === 'left-top') {
        _changeTop()
        _changeLeft()
        _changeWidth(-1)
        _changeHeight(-1)
      } else if (state.dir === 'left-bottom') {
        _changeLeft()
        _changeWidth(-1)
        _changeHeight(1)
      } else if (state.dir === 'move') {
        _changeTop()
        _changeLeft()
      }
    }
  }
})
document.addEventListener('mouseup', e => {
  state.dragging = false
})

function percent2px (val: string, dir: 'vertical' | 'horizontal'): UnitValue {
  const obj = getUnitValue(val)
  if (obj.unit === '%') {
    obj.unit = 'px'
    obj.value = String((dir === 'horizontal' ? 320 : 480) * Number(obj.value || 0) / 100)
  }
  return obj
}

export default createComponent({
  // props: {
  //   item: Object
  // },

  setup (props) {
    const handleResizeDown = (e: MouseEvent, dir: string) => {
      const node = currentNode.value!
      state.startX = e.pageX
      state.startY = e.pageY
      state.dragging = true
      state.dir = dir
      state.width = percent2px(node.style.width, 'horizontal')
      state.height = percent2px(node.style.height, 'vertical')
      state.left = percent2px(node.style.position.left, 'horizontal')
      state.top = percent2px(node.style.position.top, 'vertical')
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
  /*position: absolute;*/
  width: 100%;
  height: 100%;
  /*left: 0;*/
  /*top: 0;*/
  &__dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px #409eff dashed;
    background-color: #ffffff;
    z-index: 9998;
    &:hover {
      background-color: #f2f2f2;
    }
    &-lt {
      top: -4px;
      left: -4px;
      cursor: nw-resize;
    }
    &-t {
      top: -4px;
      left: 50%;
      transform: translateX(-50%);
      cursor: n-resize;
    }
    &-tr {
      top: -4px;
      right: -4px;
      cursor: ne-resize;
    }
    &-lb {
      bottom: -4px;
      left: -4px;
      cursor: sw-resize;
    }
    &-b {
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      cursor: s-resize;
    }
    &-br {
      bottom: -4px;
      right: -4px;
      cursor: se-resize;
    }
    &-l {
      top: 50%;
      left: -4px;
      transform: translateY(-50%);
      cursor: w-resize;
    }
    &-r {
      top: 50%;
      right: -4px;
      transform: translateY(-50%);
      cursor: e-resize;
    }
  }
}
</style>
