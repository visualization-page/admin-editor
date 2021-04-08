<template>
  <div>
    <p class="f14">
      <i class="el-icon-document mr10" />
      <span>页面列表</span>
    </p>
    <div class="editor-v2__page-list mt20 oa" style="height: calc(100% - 40px)">
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
          <p class="c-main mt10 flex-center-between">
            <i v-if="item.isIndex" class="el-icon-s-flag" />
            <el-tooltip v-else effect="dark" content="设为首页" placement="right">
              <i class="el-icon-star-off" @click.stop="handleSetIndex(item)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="复制页面" placement="right">
              <i class="el-icon-document-copy" @click.stop="handleCopy(item)" />
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
      <div class="editor-v2__page-list-item flex-center cp" @click="copyPage">
        <p class="c-999">
          <i class="el-icon-document-checked mr5" />
          <span>粘贴页面</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'
import { addPage, currentPage, setCurrentPage, Page, updatePages, copyPage } from '@/assets/page'
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
      },

      handleCopy (item: Page) {
        localStorage.setItem('butterfly-copy-page', JSON.stringify(item))
        Vue.prototype.$notice('复制页面到剪切板成功')
      },

      async copyPage () {
        const local = localStorage.getItem('butterfly-copy-page')
        if (local) {
          try {
            const localParse = JSON.parse(local)
            await Vue.prototype.$msgbox.confirm(`即将粘贴剪切板页面：${localParse.title || localParse.id}，确定吗？`)
            copyPage(localParse)
          } catch (e) {
            Vue.prototype.$notice('剪切板无有效的复制页面', true)
          }
        } else {
          Vue.prototype.$notice('剪切板无复制的页面', true)
        }
      }
    }
  }
})
</script>

<style lang="less">
.editor-v2 {
  &__page-list {
    width: 150px;
    @media screen and (min-width: 1500px) {
      width: 250px;
    }
    //@media screen and (min-width: 1700px) {
    //  width: 300px;
    //}
    //@media screen and (min-width: 1850px) {
    //  width: 400px;
    //}
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
