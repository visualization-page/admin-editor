<template>
  <div class="page-render height-100">
    <render
      :project="project"
      :currentPage="currentPage"
    />
  </div>
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
