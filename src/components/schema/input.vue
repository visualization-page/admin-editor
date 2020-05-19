<template>
  <el-input
    v-model="local"
    @blur="$emit('input', local)"
    :placeholder="item.elAttrs && item.elAttrs.placeholder || '请输入'"
    :type="item.type"
  >
  </el-input>
</template>

<script lang="jsx">
import { defineComponent, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'local-input',
  props: {
    value: String,
    item: Object
  },
  setup (p) {
    const local = ref()
    watch(() => p.value, val => {
      local.value = val
    })
    return {
      local
    }
  }
})
</script>
