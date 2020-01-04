<template>
  <div class="page-list flex flex-wrap">
    <div
      v-for="(item) in pages"
      :key="item.id"
      class="page-list__item flex-center c-999 relative"
      :class="{
        active: selected && selected.id === item.id
      }"
      @click="setSelect(item)"
    >
      <span>{{ item.title }}</span>
    </div>
    <div class="page-list__item flex-center c-999" @click="addPage">
      <i class="el-icon-plus f32" />
    </div>
  </div>
</template>

<script>
import { createComponent } from '@vue/composition-api'
import { addPage, currentPage, setCurrentPage } from '@/assets/page'
import { project } from '@/assets/project'
import { setTabName, tabName } from '@/assets/tab'

export default createComponent({
  components: {
  },

  setup () {
    return {
      pages: project.pages,
      selected: currentPage,
      setSelect (item) {
        setTabName(['', '', tabName.pageSet])
        setCurrentPage(item)
      },
      addPage (item) {
        addPage(item)
        setTabName(['', '', tabName.pageSet])
      }
    }
  }
})
</script>

<style lang="less">
.page-list {
  // justify-content: space-between;
  &__item {
    width: 80px;
    height: 100px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .3);
    margin-right: 15px;
    margin-bottom: 15px;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    &.active {
      box-shadow: 0 0 3px rgba(#409eff, .7);
      color: #409eff;
    }
  }
}
</style>
