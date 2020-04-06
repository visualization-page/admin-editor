// import Vue from 'vue'
import { reactive } from '@vue/composition-api'
import { currentNode, updateNodePosition, updateNodeStyle } from '@/assets/node'
// import { throttle } from 'lodash'

export type UnitValue = { unit?: string, value?: string }
export const state = reactive<{
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

const handleMove = (e: MouseEvent) => {
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
}

// document.addEventListener('mousemove', throttle(handleMove, 80))
document.addEventListener('mousemove', handleMove)
document.addEventListener('mouseup', e => {
  state.dragging = false
})
