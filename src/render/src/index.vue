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
      Toast('未获取到项目，请检查是否已经保存项目')
    }
  }
}
</script>
