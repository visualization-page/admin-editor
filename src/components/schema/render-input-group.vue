<template>
  <div>
    <el-button type="text" @click="handleAdd">添加</el-button>
    <div
      v-for="(x, i) in arr"
      :key="i"
      class="flex mb5"
    >
      <el-input
        class="mr5"
        placeholder="key"
        :value="x.name"
        @input="(value) => handleInput(value, 'name', x)"
      />
      <el-input
        class="mr5"
        placeholder="value"
        :value="x.path"
        @input="(value) => handleInput(value, 'path', x)"
      />
      <el-button @click="() => handleDel(x, i)" type="text">删除</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createComponent, ref, watch } from '@vue/composition-api'
import { getParentRef } from '@/assets/util'
// import { currentPage } from '@/assets/page'

export default createComponent({
  props: {
    schema: Object,
    schemaData: Object
  },

  setup (props, context) {
    type Local = { name: string, path: string }
    const arr = ref<Local[]>([])

    // 动态更新本地
    let noUpdate = false
    watch(() => props.schemaData, async data => {
      if (data) {
        const { pref, field } = getParentRef(props.schema!.field, data)
        if (pref[field]) {
          noUpdate = true
          arr.value = Object.keys(pref[field]).map((name: string) => ({ name, path: pref[field][name] }))
        }
      }
    }, { deep: true })

    const handleAdd = () => {
      noUpdate = true
      Vue.set(arr.value, arr.value.length, { name: '', path: '' })
    }
    const handleDel = (item: Local, i: number) => {
      noUpdate = false
      arr.value.splice(i, 1)
    }
    const handleInput = (val: string, field: 'name' | 'path', item: Local) => {
      noUpdate = false
      item[field] = val
    }
    watch(() => arr.value, (arr) => {
      const data = arr.reduce((obj, item) => {
        if (item.name) {
          obj[item.name] = item.path
        }
        return obj
      }, {} as any)
      // 页面切换避免赋值带来更新
      if (!noUpdate) {
        context.emit('change', data)
      }
    }, { deep: true, lazy: true })

    return {
      arr,
      handleInput,
      handleDel,
      handleAdd
    }
  }
})
</script>
