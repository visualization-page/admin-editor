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
import { defineComponent, watch, ref, onMounted } from '@vue/composition-api'
import { parseCodeValid, sleepUntil } from '@/assets/util'
import RenderItem from './render-item.vue'
import { FormEvent } from '@/assets/event'
import { isEdit } from '@/assets/render'
import { Page } from '@/assets/page'
import { Project } from '@/assets/project'
import { initGlobalConfig, getEventHandler, setGlobalUtils, setGlobalConstant } from './utils'

// @ts-ignore
const mobilePageShare: () => Promise<{ default: (obj: Page['share']) => void }> = () => import(/* webpackChunkName: "render-page" */ '../share')

export default defineComponent<{
  currentPage: Page | null
  project: Project | null
}>({
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
    const globalConfig = ref(initGlobalConfig(props.currentPage))
    const pageConfig = ref({ state: {} })
    const mounted = ref(false)
    const pageInit = ref(false)
    const getCtx = () => ({ $$page: pageConfig.value, $$global: globalConfig.value })
    let hasInit = false
    const execInitScriptsOnce = (project: Project) => {
      if (project.initScripts && !hasInit) {
        const { ok, msg } = parseCodeValid(project.initScripts, getCtx())
        if (!ok) {
          throw msg
        }
        hasInit = true
      }
    }
    const setPageState = (state: string | null) => {
      const { ok, value } = parseCodeValid(state)
      if (ok) {
        // @ts-ignore
        pageConfig.value.state = value!
        pageInit.value = true
      }
    }
    let styleEl: any
    const setCss = (css: string | null) => {
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
        // 当前页面分享
        if (page.hasShare) {
          ctx.$$global.native.menuCallJs('分享', () => {
            mobilePageShare().then(callShare => {
              callShare.default({
                title: page.share.title,
                desc: page.share.desc,
                pic: page.share.pic,
                link: page.share.link,
                linkMain: page.share.linkMain
              })
            })
          })
        } else {
          ctx.$$global.native.noMenu()
        }
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
        setGlobalConstant(globalConfig.value, cons)
      }, { deep: true })
      // 全局 css
      watch(() => props.project && props.project.css, css => {
        setCss(css)
      })
      // 更新 page
      watch(() => props.currentPage, (page) => {
        page && globalConfig.value.updatePage(page)
      })
      // 更新 utils
      watch(() => props.project && props.project.utils, utils => {
        setGlobalUtils(globalConfig.value, utils)
      })
    } else {
      watch([() => props.currentPage, () => props.project], ([page, project], oldVal) => {
        const oldPage = oldVal && oldVal[0]
        if (project && page) {
          const pro = project as Project
          setCss(pro.css)
          // @ts-ignore
          globalConfig.value = initGlobalConfig(page as Page)
          setGlobalConstant(globalConfig.value, pro.constant)
          setGlobalUtils(globalConfig.value, pro.utils)
          globalConfig.value.initHttp(pro.httpOptions, getCtx())
          // 执行项目初始化脚本
          execInitScriptsOnce(project as Project)
          // 页面
          setPageState(page.state)
          pageEvents(page as Page, oldPage as Page)
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

<style lang="less">
.absolute-center-h {
  left: 50%;
  transform: translateX(-50%);
}
.absolute-center-v {
  top: 50%;
  transform: translateY(-50%);
}
</style>
