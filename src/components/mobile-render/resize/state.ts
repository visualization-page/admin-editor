import { reactive } from '@vue/composition-api'
import { currentNode, updateNodePosition, updateNodeStyle } from '@/assets/node'
import { getUnitValue } from '@/assets/util'

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
      const h = Number(state.height.value) + (e.y - state.startY) * symbol
      if (h >= 0) {
        const { unit } = getUnitValue(node.style.height)
        updateNodeStyle({ height: `${h.toFixed(2)}${unit}` })
      }
    }
    const _changeWidth = (symbol: 1 | -1) => {
      const w = Number(state.width.value) + (e.x - state.startX) * symbol
      if (w >= 0 && w <= 375) {
        const { unit } = getUnitValue(node.style.width)
        updateNodeStyle({ width: `${w.toFixed(2)}${unit === 'vw' ? 'vw' : 'px'}` })
      }
    }
    const _changeLeft = () => {
      const l = Number(state.left.value || 0) + e.x - state.startX
      const { unit } = getUnitValue(node.style.position.left)
      updateNodePosition('left', `${l.toFixed(2)}${unit}`)
    }
    const _changeTop = () => {
      const t = Number(state.top.value || 0) + e.y - state.startY
      const { unit } = getUnitValue(node.style.position.top)
      updateNodePosition('top', `${t.toFixed(2)}${unit}`)
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
