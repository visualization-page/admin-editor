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
        placeholder="name"
        :value="x.name"
        @input="(value) => handleInput(value, 'name', x)"
      />
      <el-input
        class="mr5"
        placeholder="path"
        :value="x.path"
        @input="(value) => handleInput(value, 'path', x)"
      />
      <el-button @click="() => handleDel(x, i)" type="text">删除</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, reactive, toRefs, watch } from '@vue/composition-api'
import Vue from 'vue'

export default createComponent({
  props: {
    schema: Object,
    schemaData: Object
  },

  setup (props, context) {
    type Local = { name: string, path: string }
    const { schema, schemaData } = props
    // 得到引用
    const data = schema!.field.split('.').reduce((res: any, x: string) => res[x], schemaData)
    // 本地拷贝
    const state = reactive({
      localData: JSON.parse(JSON.stringify(data)),
      arr: Object.keys(data).map((name: string) => reactive({ name, path: data[name] }))
    })

    const handleAdd = () => {
      state.arr.push(reactive({ name: '', path: '' }))
    }
    const handleDel = (item: Local, i: number) => {
      state.arr.splice(i, 1)
      if (item.name) {
        delete state.localData![item.name]
      }
    }
    const handleInput = (val: string, field: 'name' | 'path', item: Local) => {
      const oldKey = item[field]
      if (oldKey) {
        delete state.localData[oldKey]
      }
      item[field] = val
      Vue.set(state.localData, item.name, item.path)
    }
    watch(() => state.localData, (val) => {
      // console.log(val)
      context.emit('change', val)
    }, { deep: true, lazy: true })

    return {
      ...toRefs(state),
      handleInput,
      handleDel,
      handleAdd
    }
  }
})
</script>
