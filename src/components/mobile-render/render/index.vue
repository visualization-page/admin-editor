<template>
  <div
    v-if="currentPage"
    :class="['render-page', currentPage.className]"
  >
    <render-item
      :nodes="currentPage.nodes"
      :page-config="pageConfig"
      :global-config="globalConfig"
    />
  </div>
</template>

<script lang="ts">
import { createComponent, watch, ref, onMounted } from '@vue/composition-api'
import { deepClone, parseCodeValid, sleepUntil } from '@/assets/util'
import RenderItem from './render-item.vue'
import { initGlobalConfig, getEventHandler } from './utils'
import { FormEvent } from '@/assets/event'
import { isEdit } from '@/assets/render'

export default createComponent({
  components: {
    RenderItem
  },
  props: {
    currentPage: {
      type: Object
    },
    project: {
      type: Object
    }
  },
  setup (props) {
    // const pageNodes = ref([])
    // @ts-ignore
    const globalConfig = ref(initGlobalConfig(props.currentPage))
    const pageConfig = ref({ state: {} })
    const mounted = ref(false)
    const getCtx = () => ({ $$page: pageConfig.value, $$global: globalConfig.value })
    // 更新 http
    watch(() => props.project && props.project.httpOptions, opt => {
      if (opt) {
        globalConfig.value.initHttp(opt, getCtx())
      }
    }, { deep: true })
    // 更新全局 constant
    watch(() => props.project && props.project.constant, cons => {
      if (cons) {
        const { ok, value } = parseCodeValid(cons)
        if (ok) {
          globalConfig.value.constant = value!
        }
      }
    }, { deep: true })
    // 全局 css
    let styleEl: any
    watch(() => props.project && props.project.css, css => {
      if (css) {
        if (!styleEl) {
          styleEl = document.getElementById('butterfly-css')
        }
        if (!styleEl) {
          const el = document.createElement('style')
          el.id = 'butterfly-css'
          el.setAttribute('type', 'text/css')
          document.head.appendChild(el)
          styleEl = el
        }
        styleEl.innerHTML = css
      }
    })
    // 更新 page
    watch(() => props.currentPage, async (page, oldPage) => {
      if (page) {
        // 执行页面钩子
        if (isEdit()) {
          globalConfig.value.updatePage(page)
        } else {
          const ctx = getCtx()
          // 上一个页面 unMounted 钩子
          if (oldPage) {
            oldPage.events.filter((x: FormEvent) => x.eventType === 'onUnMounted').forEach((ev: FormEvent) => {
              getEventHandler(ev, ctx)
            })
          }
          await sleepUntil(() => mounted.value)
          globalConfig.value.updatePage(page)
          // 当前页面的 mounted 钩子
          page.events.filter((x: FormEvent) => x.eventType === 'onMounted').forEach((ev: FormEvent) => {
            getEventHandler(ev, ctx)
          })
        }
      }
    })
    // 更新 page.state
    watch(() => props.currentPage && props.currentPage.state, state => {
      const { ok, value } = parseCodeValid(state)
      if (ok) {
        pageConfig.value.state = value!
      }
    }, { deep: true })
    // watch(() => props.currentPage && props.currentPage.nodes, nodes => {
    //   if (nodes) {
    //     setTimeout(() => {
    //       pageNodes.value = nodes
    //       // console.log(deepClone(nodes))
    //     })
    //   }
    // }, { deep: true })
    onMounted(() => {
      mounted.value = true
    })
    return {
      // pageNodes,
      pageConfig,
      globalConfig
    }
  }
})
</script>
