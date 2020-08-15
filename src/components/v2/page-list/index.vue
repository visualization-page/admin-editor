<template>
  <div>
    <p class="f14">
      <i class="el-icon-document mr10" />
      <span>页面列表</span>
    </p>
    <div class="editor-v2__page-list mt20">
      <div
        v-for="(item) in project.pages"
        :key="item.id"
        class="editor-v2__page-list-item flex-center c-666 cp"
        :class="{
          active: currentPage && currentPage.id === item.id
        }"
        @click="setSelect(item)"
      >
        <div class="plr10 th1 width-100">
          <span>{{ item.title || item.id }}</span>
          <p class="c-main mt5">
            <i v-if="item.isIndex" class="el-icon-s-flag" />
            <el-tooltip v-else effect="dark" content="设为首页" placement="right">
              <i class="el-icon-star-off" @click.stop="handleSetIndex(item)" />
            </el-tooltip>
          </p>
        </div>
      </div>
      <div class="editor-v2__page-list-item flex-center cp" @click="addPage">
        <p class="c-main">
          <i class="el-icon-plus mr5" />
          <span>添加页面</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { addPage, currentPage, setCurrentPage, Page, updatePages } from '@/assets/page'
import { project } from '@/assets/project'
import { setState as setCodeEditState } from '@/assets/code-edit'
import { Notification } from 'element-ui'

export default defineComponent({
  setup () {
    return {
      project,
      currentPage,
      addPage,
      setSelect (item: Page) {
        setCurrentPage(item)
        setCodeEditState(false)
      },
      handleSetIndex (item: Page) {
        const oldIndexPage = project.pages.find(x => x.isIndex)
        if (oldIndexPage) {
          updatePages({ pageId: oldIndexPage.id }, { isIndex: false })
        }
        updatePages({ pageId: item.id }, { isIndex: true })
        Notification({
          title: '成功',
          type: 'success',
          message: '设置首页成功',
          position: 'top-right',
          duration: 2000
        })
      }
    }
  }
})
</script>

<style lang="less">
.editor-v2 {
  &__page-list {
    width: 150px;
    &-item {
      height: 60px;
      background: #fff;
      border-left: 3px solid transparent;
      border-bottom: 2px #eee solid;
      &.active {
        border-left-color: #ff7d00;
      }
    }
  }
}
</style>
