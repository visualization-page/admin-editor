<template>
  <render
    v-if="project && project.depLoaded"
    ref="render"
    :project="project"
    :currentPage="currentPage"
  />
</template>

<script>
import Render from '@/components/mobile-render/render/index.vue'
import { defineComponent } from '@vue/composition-api'
import { project } from '@/assets/project'
import { getProject } from './utils'
import { Toast } from 'esc-ui'
import { getEventHandler, initGlobalConfig } from '../../components/mobile-render/render/utils'
import { parseCodeValid } from '../../assets/util'

export default defineComponent({
  components: {
    Render
  },
  data () {
    return {
      project: null,
      currentPage: null
    }
  },
  watch: {
    '$route.params.id': function (id) {
      this.setPageById(id)
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (this.currentPage) {
      const ctx = this.$refs.render.getCtx()
      const es = this.currentPage.events.filter(x => x.eventType === 'beforeRouteLeave')
      if (es.length) {
        Promise.all(es.map(ev => {
          const { ok, msg, value } = parseCodeValid(ev.fxCode, ctx)
          if (ok) {
            return value
          }
          console.error(msg)
        }).filter(Boolean))
          .then(() => {
            next()
          })
          .catch(() => {
            next(false)
          })
      } else {
        next()
      }
    } else {
      next()
    }
  },
  async created () {
    let data = project
    if (!project.dir) {
      console.log('[butterfly] Init project')
      data = await getProject(this.$route.params.dir)
    }
    this.project = data
    this.setPageById(this.$route.params.id)
    vueCompositionApi.watch(() => project.depLoaded, load => {
      this.project.depLoaded = load
    })
  },
  methods: {
    setPageById (id) {
      if (!this.project) {
        return Toast('未获取到项目，请检查是否已经保存项目')
      }
      const page = this.project.pages.find(x => x.id === id)
      if (id && page) {
        this.setPage(page)
      } else {
        this.$router.replace('/404')
      }
    },
    setPage (page) {
      this.currentPage = page
      document.title = page.title
    }
  }
})
</script>
