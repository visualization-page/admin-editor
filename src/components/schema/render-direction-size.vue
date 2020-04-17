<template>
  <div class="direction-size">
    <el-select :value="unit" @change="handleInputChange" placeholder="请选择尺寸单位">
      <el-option label="px" value="px" />
      <el-option label="vw" value="vw" />
      <el-option label="%" value="%" />
    </el-select>
    <div
      class="direction-size-box w100 h100 p30 mt10 bd bd-ccc relative"
      style="border-style: dashed"
    >
      <div class="height-100 width-100 bd bd-ccc" style="border-style: dashed" />
      <div class="absolute t0 w30" style="left: 35px">
        <el-input
          class="direction-size__input"
          :value="position.top"
          @input="val => handleInput(val, 'top')"
          @keydown.native="e => handleKeycode(e, 'top')"
          placeholder="上"
        />
      </div>
      <div class="absolute w30" style="left: -5px;top: 35px;">
        <el-input
          class="direction-size__input"
          :value="position.left"
          @input="val => handleInput(val, 'left')"
          placeholder="左"
          @keydown.native="e => handleKeycode(e, 'left')"
        />
      </div>
      <div class="absolute w30" style="top: 35px;right: -5px;">
        <el-input
          class="direction-size__input"
          :value="position.right"
          @input="val => handleInput(val, 'right')"
          placeholder="右"
          @keydown.native="e => handleKeycode(e, 'right')"
        />
      </div>
      <div class="absolute w30 b0" style="left: 35px">
        <el-input
          class="direction-size__input"
          :value="position.bottom"
          @input="val => handleInput(val, 'bottom')"
          placeholder="下"
          @keydown.native="e => handleKeycode(e, 'bottom')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { getParentRef, getUnitValue } from '@/assets/util'

export default {
  props: {
    schema: Object,
    schemaData: Object
  },

  components: {
  },

  setup (props, ctx) {
    const position = computed(() => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      return positionToRaw(pref[field]).obj
    })
    const unit = computed(() => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      return positionToRaw(pref[field]).unit
    })
    const get = (str, paramsUnit = unit.value) => {
      if (str) {
        return /^\d*.{0,1}\d+$/.test(str)
          ? (str + paramsUnit)
          : str
      }
    }
    const positionToRaw = (str = {}) => {
      const obj = {
        top: undefined,
        right: undefined,
        bottom: undefined,
        left: undefined
      }
      const unitArr = []
      Object.keys(str).forEach(k => {
        const { unit, value } = getUnitValue(str[k])
        obj[k] = value
        unitArr.push(unit)
      })
      return {
        obj,
        unit: unitArr.find(x => x !== 'px') || 'px'
      }
    }
    const positionAddUnit = (position, paramsUnit) => {
      return {
        top: get(position.top, paramsUnit),
        right: get(position.right, paramsUnit),
        bottom: get(position.bottom, paramsUnit),
        left: get(position.left, paramsUnit)
      }
    }

    const handleInput = (val, dir) => {
      ctx.emit('change', positionAddUnit({
        ...position.value,
        [dir]: val
      }))
    }
    const handleInputChange = (val) => {
      ctx.emit('change', positionAddUnit(position.value, val))
    }
    const handleKeycode = (e, dir) => {
      const isUp = e.keyCode === 38
      const isDown = e.keyCode === 40
      if (isUp || isDown) {
        e.preventDefault()
        if (isUp) {
          handleInput(Number(position.value[dir] || 0) + 1, dir)
        } else {
          handleInput(position.value[dir] - 1 || 0, dir)
        }
      }
    }

    return {
      position,
      unit,
      handleInput,
      handleInputChange,
      handleKeycode
    }
  }
}
</script>

<style lang="less">
.direction-size {
  &__input .el-input__inner {
    padding: 0;
    text-align: center;
  }
}
</style>
