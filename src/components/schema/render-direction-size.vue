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
          placeholder="上"
        />
      </div>
      <div class="absolute w30" style="left: -5px;top: 35px;">
        <el-input
          class="direction-size__input"
          :value="position.left"
          @input="val => handleInput(val, 'left')"
          placeholder="左"
        />
      </div>
      <div class="absolute w30" style="top: 35px;right: -5px;">
        <el-input
          class="direction-size__input"
          :value="position.right"
          @input="val => handleInput(val, 'right')"
          placeholder="右"
        />
      </div>
      <div class="absolute w30 b0" style="left: 35px">
        <el-input
          class="direction-size__input"
          :value="position.bottom"
          @input="val => handleInput(val, 'bottom')"
          placeholder="下"
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
      return stringToPosition(pref[field])
    })
    const unit = computed(() => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      const m = pref[field] && pref[field].match(/px|%|vw/)
      return m ? m[0] : 'px'
    })
    const get = (str, paramsUnit = unit.value) => str ? (str + paramsUnit) : 0
    const stringToPosition = (str) => {
      if (typeof str !== 'string') {
        return {}
      }
      const strArr = str.split(' ').map(x => {
        const { value } = getUnitValue(x)
        return value
      })
      return {
        top: strArr[0],
        right: strArr[1],
        bottom: strArr[2],
        left: strArr[3]
      }
    }
    const positionToString = (position, paramsUnit) => {
      if (
        get(position.top, paramsUnit) ||
        get(position.right, paramsUnit) ||
        get(position.bottom, paramsUnit) ||
        get(position.left, paramsUnit)
      ) {
        return `${get(position.top, paramsUnit)} ${get(position.right, paramsUnit)} ${get(position.bottom, paramsUnit)} ${get(position.left, paramsUnit)}`
      }
      return '0'
    }

    const handleInput = (val, dir) => {
      ctx.emit('change', positionToString({
        ...position.value,
        [dir]: val
      }))
    }
    const handleInputChange = (val) => {
      ctx.emit('change', positionToString(position.value, val))
    }

    return {
      position,
      unit,
      handleInput,
      handleInputChange
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
