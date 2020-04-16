<template>
  <div
    v-if="currentPage"
    :class="['render-page', currentPage.className]"
  >
    <render-item
      v-if="pageInit"
      :nodes="currentPage.nodes"
      :page-config="pageConfig"
      :global-config="globalConfig"
    />
  </div>
</template>

<script lang="ts">
import { createComponent, watch, ref, onMounted } from '@vue/composition-api'
import { parseCodeValid, sleepUntil } from '@/assets/util'
import RenderItem from './render-item.vue'
import { initGlobalConfig, getEventHandler } from './utils'
import { FormEvent } from '@/assets/event'
import { isEdit } from '@/assets/render'
import { Page } from '@/assets/page'

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
    // @ts-ignore
    const globalConfig = ref(initGlobalConfig(props.currentPage))
    const pageConfig = ref({ state: {} })
    const mounted = ref(false)
    const pageInit = ref(false)
    const getCtx = () => ({ $$page: pageConfig.value, $$global: globalConfig.value })
    const setConstant = (cons: string) => {
      if (cons) {
        const { ok, value } = parseCodeValid(cons)
        if (ok) {
          globalConfig.value.constant = value!
        }
      }
    }
    const setPageState = (state: string) => {
      const { ok, value } = parseCodeValid(state)
      if (ok) {
        // @ts-ignore
        pageConfig.value.state = value!
        pageInit.value = true
      }
    }
    let styleEl: any
    const setCss = (css: string) => {
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
    }
    // 执行页面钩子
    const pageEvents = async (page?: Page, oldPage?: Page) => {
      if (page) {
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

    if (isEdit()) {
      // 更新 page.state
      watch(() => props.currentPage && props.currentPage.state, state => {
        setPageState(state)
      }, { deep: true })
      // 更新 http
      watch(() => props.project && props.project.httpOptions, opt => {
        if (opt) {
          globalConfig.value.initHttp(opt, getCtx())
        }
      }, { deep: true })
      // 更新全局 constant
      watch(() => props.project && props.project.constant, cons => {
        setConstant(cons)
      }, { deep: true })
      // 全局 css
      watch(() => props.project && props.project.css, css => {
        setCss(css)
      })
      // 更新 page
      watch(() => props.currentPage, (page) => {
        page && globalConfig.value.updatePage(page)
      })
    } else {
      watch([() => props.currentPage, () => props.project], ([page, project], oldVal) => {
        const oldPage = oldVal && oldVal[0]
        if (project && page) {
          setCss(project.css)
          setConstant(project.constant)
          // @ts-ignore
          globalConfig.value = initGlobalConfig(page)
          setPageState(page.state)
          globalConfig.value.initHttp(project.httpOptions, getCtx())
          // @ts-ignore
          pageEvents(page, oldPage)
        }
      })
    }
    onMounted(() => {
      mounted.value = true
    })
    return {
      pageInit,
      pageConfig,
      globalConfig
    }
  }
})
</script>
