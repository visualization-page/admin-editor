<template>
  <div v-if="currentPage">
    <render-item
      :nodes="currentPage.nodes"
      :page-config="pageConfig"
      :global-config="globalConfig"
    />
  </div>
</template>

<script lang="ts">
import { createComponent, watch, reactive, ref, onMounted } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { project } from '@/assets/project'
import { deepClone, parseCodeValid, getParentRef } from '@/assets/util'
import RenderItem from './render-item.vue'
import { initGlobalConfig, getEventHandler } from './utils'
import { FormEvent } from '@/assets/event'
import { isEdit } from '@/assets/render'

export default createComponent({
  components: {
    RenderItem
  },
  setup () {
    const globalConfig = ref(initGlobalConfig(currentPage.value))
    const pageConfig = ref({ state: {} })
    watch(() => project.constant, cons => {
      const { ok, value } = parseCodeValid(cons)
      if (ok) {
        globalConfig.value.constant = value!
      }
    }, { deep: true })
    watch(() => currentPage.value && currentPage.value.state, state => {
      const { ok, value } = parseCodeValid(state)
      if (ok) {
        pageConfig.value.state = value!
      }
    }, { deep: true })
    // 页面事件
    onMounted(() => {
      watch(() => currentPage.value && currentPage.value.events, events => {
        if (events && !isEdit()) {
          const ctx = { $$page: pageConfig.value, $$global: globalConfig.value }
          events.forEach((ev: FormEvent) => {
            getEventHandler(ev, ctx)
          })
        }
      })
    })
    return {
      currentPage,
      pageConfig,
      globalConfig
    }
  }
})
</script>
