<template>
  <div class="blur-input-wrap flex">
    <el-input
      v-model="local"
      :placeholder="item.elAttrs && item.elAttrs.placeholder || '请输入'"
      :type="item.type"
      @blur="$emit('input', local)"
    />
    <div
      v-if="isExpression"
      class="w30 h30 ml10 bd bd-eee flex-center br3 cp flex-shrink-0"
      @click="handleFx"
    >
      <i class="bficon icon-function c-main" />
    </div>
  </div>
</template>

<script lang="jsx">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { setCodeState } from '@/assets/code-edit'

export default defineComponent({
  name: 'local-input',
  props: {
    value: String,
    item: Object,
    isExpression: Boolean
  },
  setup (p, ctx) {
    const local = ref()
    watch(() => p.value, val => {
      local.value = val
    })

    const handleFx = () => {
      setCodeState(p.item.label, local.value, val => ctx.emit('input', val))
    }

    return {
      local,
      handleFx
    }
  }
})
</script>
