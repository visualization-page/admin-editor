<template>
  <render-item
    v-if="currentPage"
    :nodes="deepClone(currentPage.nodes)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { MessageBox } from 'element-ui'
import { createComponent, watch, reactive } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { project } from '@/assets/project'
import { deepClone } from '@/assets/util'
import RenderItem from './render-item.vue'

const updateField = (target: any, obj: any) => {
  if (!obj) {
    return
  }
  Object.keys(obj).forEach(k => {
    if (target[k] === undefined) {
      Vue.set(target, k, obj[k])
    } else {
      target[k] = obj[k]
    }
  })
}

window.$$global = reactive({
  constant: {},
  state: {}
})
window.getConstant = (key) => window.$$global.constant[key]

export default createComponent({
  components: {
    RenderItem
  },
  setup () {
    // 挂载页面 state 和项目常量
    watch(() => project.constant, cons => {
      try {
        // eslint-disable-next-line
        const value = cons ? new Function(`return ${cons}`)() : {}
        updateField(window.$$global.constant, value)
      } catch (e) {
        MessageBox.confirm(`常量语法错误：${e.message}`)
      }
    }, { deep: true })
    watch(() => currentPage.value && currentPage.value.state, state => {
      try {
        // eslint-disable-next-line
        const value = state ? new Function(`return ${state}`)() : {}
        updateField(window.$$global.state, value)
      } catch (e) {
        window.$$global.state = {}
        MessageBox.confirm(`页面响应式状态错误：${e.message}`)
      }
    }, { deep: true })
    // watch(() => window.$$global.state, st => {
    //   console.log('state 发生变化', JSON.stringify(st))
    // }, { deep: true })
    return {
      currentPage,
      deepClone
    }
  }
})
</script>
