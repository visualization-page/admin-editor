<script>
import { currentPage } from '@/assets/page'
import { getProject } from './utils'
import { Toast } from 'esc-ui'

export default {
  async created () {
    const { dir } = this.$route.params
    const project = await getProject(dir)
    if (currentPage.value) {
      this.$router.replace({
        path: `/page/${project.dir}/${currentPage.value.id}`,
        query: this.$route.query
      })
    } else {
      Toast('项目未添加页面')
    }
  }
}
</script>
