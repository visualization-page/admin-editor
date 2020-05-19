<template>
  <div class="unit-size flex">
    <el-input
      placeholder="请输入"
      :value="valueNum"
      @input="handleInputNum"
      @keydown.native="handleKeycode"
    />
    <template v-if="!schema.noAuto">
      <div :class="space" />
      <el-select :value="valueUnit" @change="handleInputUnit">
        <el-option label="px" value="px" />
        <el-option label="vw" value="vw" />
        <el-option label="%" value="%" />
      </el-select>
      <div :class="space" />
      <el-tooltip effect="dark" content="重置" placement="left">
        <el-button icon="el-icon-circle-close" @click="handleInputNum('')" />
      </el-tooltip>
    </template>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { getParentRef, getUnitValue } from '@/assets/util'

export default {
  props: {
    schema: Object,
    schemaData: Object,
    space: {
      type: String,
      default: 'ml10'
    }
  },

  setup (props, ctx) {
    // 本地解析单位
    const valueUnit = computed(() => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      return pref && getUnitValue(pref[field]).unit
    })
    const valueNum = computed(() => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      return pref && getUnitValue(pref[field]).value
    })
    const handleInputUnit = (val) => {
      ctx.emit('change', valueNum.value.trim() === '' ? undefined : valueNum.value + val)
    }
    const handleInputNum = (val) => {
      ctx.emit(
        'change',
        typeof val === 'string' && val.trim() === ''
          ? undefined
          : (val || 0) + valueUnit.value
      )
    }
    const handleKeycode = (e) => {
      const isUp = e.keyCode === 38
      const isDown = e.keyCode === 40
      if (isUp || isDown) {
        e.preventDefault()
        if (isUp) {
          handleInputNum(Number(valueNum.value) + 1)
        } else {
          handleInputNum(Number(valueNum.value) - 1 || 0)
        }
      }
    }
    return {
      valueUnit,
      valueNum,
      handleInputNum,
      handleInputUnit,
      handleKeycode
    }
  }
}
</script>
