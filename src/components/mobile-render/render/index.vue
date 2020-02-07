<template>
  <render-item
    v-if="currentPage"
    :nodes="currentPage.nodes"
  />
</template>

<script lang="ts">
import Vue from 'vue'
// import { MessageBox } from 'element-ui'
import { createComponent, watch, reactive } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { project } from '@/assets/project'
import { deepClone, parseCodeValid } from '@/assets/util'
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
      const { ok, value } = parseCodeValid(cons)
      ok && updateField(window.$$global.constant, value)
    }, { deep: true })
    watch(() => currentPage.value && currentPage.value.state, state => {
      const { ok, value } = parseCodeValid(state)
      ok && updateField(window.$$global.state, value)
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
