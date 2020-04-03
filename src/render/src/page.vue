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
import { project, initProject } from '@/assets/project'
import { setRenderPreview } from '../../assets/render'

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
    setRenderPreview()
    if (project.pages.length === 0) {
      console.log('init project')
      await initProject()
    }
    this.project = project
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
