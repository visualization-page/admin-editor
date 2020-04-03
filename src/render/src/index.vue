<script lang="ts">
import { setRenderPreview } from '@/assets/render'
import { initProject } from '@/assets/project'
import { currentPage } from '@/assets/page'

export default {
  async created () {
    setRenderPreview()
    await initProject()
    // @ts-ignore
    this.$router.replace(`/page/${currentPage.value.id}`)
  }
}
</script>
