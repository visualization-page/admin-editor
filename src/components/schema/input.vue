<template>
  <div>
    <div class="blur-input-wrap flex">
      <el-input
        v-model="local"
        :placeholder="item.elAttrs && item.elAttrs.placeholder || '请输入'"
        :type="item.type"
        @blur="handleBlur"
      />
      <div
        v-if="isExpression"
        class="w30 h30 ml10 bd bd-eee flex-center br3 cp flex-shrink-0"
        @click="handleFx"
      >
        <i class="bficon icon-function c-main" />
      </div>
    </div>
    <el-tag
      v-for="(tag, i) in localCache"
      :key="tag"
      closable
      class="mr10"
      @close="handleDeleteCache(i)"
      @click="handleSelect(tag)"
    >
      {{ tag }}
    </el-tag>
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
    const localCache = ref([])

    const getCache = () => {
      const l = localStorage.getItem(p.item.cacheKey)
      if (l) {
        return JSON.parse(l)
      }
      return []
    }

    const setCache = () => {
      const v = local.value.trim()
      if (!localCache.value.includes(v) && v) {
        localCache.value.push(local.value.trim())
        localStorage.setItem(p.item.cacheKey, JSON.stringify(localCache.value))
      }
    }

    if (p.item.cache) {
      localCache.value = getCache()
    }

    watch(() => p.value, val => {
      local.value = val
    })

    const handleFx = () => {
      setCodeState(p.item.label, local.value, val => ctx.emit('input', val))
    }

    const handleBlur = () => {
      if (p.item.cache) {
        setCache()
      }
      ctx.emit('input', local.value)
    }

    const handleDeleteCache = (i) => {
      localCache.value.splice(i, 1)
      localStorage.setItem(p.item.cacheKey, JSON.stringify(localCache.value))
    }

    const handleSelect = (item) => {
      ctx.emit('input', item)
    }

    return {
      local,
      localCache,
      handleFx,
      handleBlur,
      handleDeleteCache,
      handleSelect
    }
  }
})
</script>
