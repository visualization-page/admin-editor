<template>
  <div
    v-if="currentPage"
    :class="['render-page', currentPage.className]"
  >
    <render-item
      v-if="pageInit.length === 2"
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
import { initGlobalConfig, getEventHandler, setGlobalUtils, setGlobalConstant, isPc } from './utils'

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
    const pageConfig = ref({ state: {}, methods: {} })
    const mounted = ref(false)
    const pageInit = ref<Array<'state' | 'methods'>>([])
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
    const setPageCode = (
      field: 'state' | 'methods',
      fieldValue: string | null
    ) => {
      const ctx = getCtx()
      const { ok, value } = parseCodeValid(fieldValue, ctx)
      if (ok) {
        // @ts-ignore
        pageConfig.value[field] = value!
      }
      if (pageInit.value.length < 2) {
        pageInit.value.push(field)
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
        if (isPc) {
          css = css.replace(/vw/g, 'px')
        } else if (/vw/.test(css)) {
          // eslint-disable-next-line no-useless-escape
          css = css.replace(/([\d\.]+)vw/g, (all: string, match: string) => {
            return (Number(match) / 3.75).toFixed(2) + 'vw'
          })
        }
        styleEl.innerHTML = css
      }
    }
    // 执行页面钩子
    const pageEvents = async (page?: Page, oldPage?: Page) => {
      if (page) {
        // console.log('render index pageEvents start', ((Date.now() - window._renderStartTime) / 1000), '秒')
        await sleepUntil(() => mounted.value)
        console.log('render index mounted', ((Date.now() - window._renderStartTime) / 1000), '秒')
        const ctx = getCtx()
        // 上一个页面 unMounted 钩子
        if (oldPage) {
          oldPage.events.filter((x: FormEvent) => x.eventType === 'onUnMounted').forEach((ev: FormEvent) => {
            getEventHandler(ev, ctx)
          })
        }
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
        } else if (props.project!.interactiveType === 'long-page') {
          // 小程序 sdk 覆盖了 JSBridge
          ctx.$$global.native.noMenu()
        }
      }
    }

    if (isEdit()) {
      // 更新 page.state
      watch(() => props.currentPage && props.currentPage.state, state => {
        setPageCode('state', state)
      })
      // 更新 page.methods
      watch(() => props.currentPage && props.currentPage.methods, methods => {
        setPageCode('methods', methods)
      })
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
      // console.log('render index watch start', ((Date.now() - window._renderStartTime) / 1000), '秒')
      watch([() => props.currentPage, () => props.project], ([page, project], oldVal) => {
        const oldPage = oldVal && oldVal[0]
        if (project && page) {
          // console.log('render index watch doing', ((Date.now() - window._renderStartTime) / 1000), '秒')
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
          setPageCode('state', page.state)
          setPageCode('methods', page.methods)
          pageEvents(page as Page, oldPage as Page)
        }
      })
    }
    onMounted(() => {
      const stop = watch(() => pageInit.value.length, len => {
        mounted.value = len === 2
        if (mounted.value) {
          stop && stop()
        }
      })
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
