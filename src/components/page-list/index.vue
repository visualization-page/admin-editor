<template>
  <div
    class="page-list"
    :class="{
      'flex': sample
    }"
  >
    <div
      v-for="(item) in project.pages"
      :key="item.id"
      class="page-list__item flex-center-between c-999 relative plr15 cp"
      :class="{
        active: selected && selected.id === item.id,
        mr15: sample
      }"
      @click="setSelect(item)"
    >
      <span><span v-if="item.isIndex">[首页]</span> {{ item.title || item.id }}</span>
      <div class="pr15" v-if="!sample">
        <el-tooltip v-if="false" effect="dark" content="导出页面为模版" placement="top">
          <i class="el-icon-brush mr10" @click.stop="handleExportPage(item)" />
        </el-tooltip>
        <el-tooltip v-if="!item.isIndex" effect="dark" content="设为首页" placement="top">
          <i class="el-icon-star-off mr10" @click.stop="handleSetIndex(item)" />
        </el-tooltip>
        <el-tooltip effect="dark" content="复制页面" placement="top">
          <i class="el-icon-document-copy" @click.stop="handleCopyPage(item)" />
        </el-tooltip>
      </div>
    </div>
    <div v-if="!sample" class="page-list__item flex-center c-999 cp" @click="addPage">
      <i class="el-icon-plus f14" />
      <span>新建空白页面</span>
    </div>
  </div>
</template>

<script>
import { createComponent } from '@vue/composition-api'
import { addPage, currentPage, setCurrentPage, copyPage, updatePages } from '@/assets/page'
import { project } from '@/assets/project'
import { setTabName, tabName } from '@/assets/tab'
import { setState as setCodeEditState } from '@/assets/code-edit'
import { Message } from 'element-ui'

export default createComponent({
  components: {
  },
  props: {
    sample: Boolean
  },
  setup (props, ctx) {
    const params = ctx.parent.$route.params
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
        if (ctx.parent.$route.params.dir) {
          addPage(item)
          setTabName(['', '', tabName.pageSet])
        } else {
          Message.info('请先在【项目设置】-【英文名称】输入并点击右上角保存后再【新建页面】')
        }
      },
      handleCopyPage (item) {
        copyPage(item)
      },
      handleExportPage (item) {
      },
      handleSetIndex (item) {
        const oldIndexPage = project.pages.find(x => x.isIndex)
        if (oldIndexPage) {
          updatePages({ pageId: oldIndexPage.id }, { isIndex: false })
        }
        updatePages({ pageId: item.id }, { isIndex: true })
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
