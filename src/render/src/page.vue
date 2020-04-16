<template>
  <render
    :project="project"
    :currentPage="currentPage"
  />
</template>

<script>
import Render from '@/components/mobile-render/render/index.vue'
import { defineComponent } from '@vue/composition-api'
import { project } from '@/assets/project'
import { getProject } from './utils'

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
  async created () {
    let data = project
    if (!project.dir) {
      console.log('init project')
      data = await getProject(this.$route.params.dir)
    }
    this.project = data
    this.setPageById(this.$route.params.id)
  },
  methods: {
    setPageById (id) {
      if (!this.project) {
        return window.vant.Toast('未获取到项目，请检查是否已经保存项目')
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
