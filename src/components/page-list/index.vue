<template>
  <div class="page-list">
    <div
      v-for="(item) in project.pages"
      :key="item.id"
      class="page-list__item flex-center-between c-999 relative pl15 cp"
      :class="{
        active: selected && selected.id === item.id
      }"
      @click="setSelect(item)"
    >
      <span>{{ item.title || item.id }}</span>
      <div class="pr15">
        <i class="el-icon-document-copy" @click.stop="handleCopyPage(item)" />
      </div>
    </div>
    <div class="page-list__item flex-center c-999 cp" @click="addPage">
      <i class="el-icon-plus f14" />
      <span>新建空白页面</span>
    </div>
  </div>
</template>

<script>
import { createComponent } from '@vue/composition-api'
import { addPage, currentPage, setCurrentPage, copyPage } from '@/assets/page'
import { project } from '@/assets/project'
import { setTabName, tabName } from '@/assets/tab'
import { setState as setCodeEditState } from '@/assets/code-edit'

export default createComponent({
  components: {
  },

  setup () {
    return {
      project,
      selected: currentPage,
      setSelect (item) {
        setTabName(['', '', tabName.pageSet])
        setCurrentPage(item)
        // 更换代码编辑状态
        setCodeEditState(false)
        setTabName(['', '', '', tabName.previewArea])
      },
      addPage (item) {
        addPage(item)
        setTabName(['', '', tabName.pageSet])
      },
      handleCopyPage (item) {
        copyPage(item)
      }
    }
  }
})
</script>

<style lang="less">
.page-list {
  // justify-content: space-between;
  &__item {
    // width: 80px;
    height: 40px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .3);
    // margin-right: 15px;
    margin-bottom: 10px;
    &.active {
      box-shadow: 0 0 3px rgba(#409eff, .7);
      color: #409eff;
    }
  }
}
</style>
