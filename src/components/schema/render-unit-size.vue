<template>
  <div class="unit-size flex">
    <el-input placeholder="请输入" :value="valueNum" @input="handleInputNum" />
    <div class="ml10" />
    <el-select :value="valueUnit" @change="handleInputUnit">
      <el-option label="px" value="px" />
      <el-option label="vw" value="vw" />
      <el-option label="%" value="%" />
    </el-select>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { getParentRef } from '@/assets/util'

export default {
  props: {
    schema: Object,
    schemaData: Object
  },

  setup (props, ctx) {
    // 本地解析单位
    const valueUnit = computed(() => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      const mat = pref[field] ? pref[field].match(/px|%|vw/) : ''
      return mat ? mat[0] : 'px'
    })
    const valueNum = computed(() => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      const mat = pref[field] ? pref[field].match(/px|%|vw/) : ''
      return mat ? pref[field].replace(mat[0], '') : ''
    })
    return {
      valueUnit,
      valueNum,
      handleInputNum (val) {
        ctx.emit('change', val + valueUnit.value)
      },
      handleInputUnit (val) {
        ctx.emit('change', valueNum.value + val)
      }
    }
  }
}
</script>
