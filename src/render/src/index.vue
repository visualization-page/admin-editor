<script>
import { currentPage } from '@/assets/page'
import { getProject } from './utils'

export default {
  async created () {
    const { dir } = this.$route.params
    await getProject(dir)
    if (currentPage.value) {
      this.$router.replace({
        path: `/page/${dir}/${currentPage.value.id}`,
        query: this.$route.query
      })
    } else {
      window.vant.Toast('未获取到项目，请检查是否已经保存项目')
    }
  }
}
</script>
