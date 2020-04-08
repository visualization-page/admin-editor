<script>
import { currentPage } from '@/assets/page'
import { getProject } from './utils'

export default {
  async created () {
    const { dir } = this.$route.params
    await getProject(dir, this.$route.query.preview)
    if (currentPage.value) {
      // @ts-ignore
      this.$router.replace(`/page/${dir}/${currentPage.value.id}`)
    }
  }
}
</script>
