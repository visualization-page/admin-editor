// import Vue from 'vue'
import { reactive } from '@vue/composition-api'
import { currentNode, updateNodePosition, updateNodeStyle } from '@/assets/node'
// import { throttle } from 'lodash'
import { updateEditWrapStyle } from '@/assets/render'
import { getUnitValue } from '@/assets/util'

export function percent2px (val: string, dir: 'vertical' | 'horizontal'): UnitValue {
  const obj = getUnitValue(val)
  if (obj.unit === '%') {
    obj.unit = 'px'
    obj.value = String((dir === 'horizontal' ? 320 : 480) * Number(obj.value || 0) / 100)
  }
  return obj
}
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

// watch(() => editWrapState.style, (style: WrapState['style']) => {
//   if (style) {
//     state.width = percent2px(String(style.width), 'horizontal')
//     state.height = percent2px(String(style.height), 'vertical')
//     state.left = percent2px(String(style.left), 'horizontal')
//     state.top = percent2px(String(style.top), 'vertical')
//   }
// }, { lazy: true, deep: true })

const handleMove = (e: MouseEvent) => {
  if (state.dragging) {
    const node = currentNode.value!
    const _changeHeight = (symbol: 1 | -1) => {
      const h = Number(state.height.value) + (e.x - state.startY) * symbol
      if (h >= 0 && h <= 480) {
        updateNodeStyle({ height: `${h}px` })
        updateEditWrapStyle('height', h)
      }
    }
    const _changeWidth = (symbol: 1 | -1) => {
      const w = Number(state.width.value) + (e.x - state.startX) * symbol
      if (w >= 0 && w <= 320) {
        updateNodeStyle({ width: `${w}px` })
        updateEditWrapStyle('width', w)
      }
    }
    const _changeLeft = () => {
      const l = Number(state.left.value || 0) + e.x - state.startX
      updateNodePosition('left', `${l}px`)
      updateEditWrapStyle('left', l)
    }
    const _changeTop = () => {
      const t = Number(state.top.value || 0) + e.y - state.startY
      updateNodePosition('top', `${t}px`)
      updateEditWrapStyle('top', t)
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
