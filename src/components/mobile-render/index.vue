<template>
  <div class="app__box-center absolute z2">
    <div class="app__mobile height-100">
      <div class="app__mobile-header relative bb bd-eee">
        <img src="../../assets/img/mobile-bar.jpg" width="100%" alt="">
        <span class="absolute l0 b0 width-100 pb10 tc f16">
          {{ currentPage ? (currentPage.title || '请输入标题') : '未创建页面' }}
        </span>
        <el-button
          v-if="currentPage"
          class="absolute r10 b0 pb10"
          type="text"
          @click="handlePreviewPage"
        >
          <i class="el-icon-document-remove" />
          <span>查看页面</span>
        </el-button>
      </div>
      <div class="app__mobile-webview">
        <div ref="scrollContainer" class="app__mobile-webview-mock">
          <div class="edit-wrap-parent relative height-100">
            <render
              v-if="project.depLoaded"
              :project="project"
              :currentPage="currentPage"
            />
            <template v-if="isEdit()">
              <edit-wrap :get-scrolltop="handleGetContainerScrollTop" />
              <context-menu />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { project } from '@/assets/project'
import { currentNode } from '@/assets/node'
import Render from './render/index.vue'
import { isEdit, setRenderEdit, setRenderPreview } from '@/assets/render'
import { Message } from 'element-ui'
import EditWrap from './edit-wrap.vue'
import ContextMenu from './context-menu/index.vue'

export default defineComponent({
  components: {
    Render,
    EditWrap,
    ContextMenu
  },

  setup (p, ctx) {
    const containerEl = ref(null)
    onMounted(() => {
      // @ts-ignore
      containerEl.value = ctx.refs.scrollContainer
    })
    const handleMode = () => {
      if (isEdit()) {
        setRenderPreview()
      } else {
        setRenderEdit()
      }
    }
    const handlePreviewPage = () => {
      if (currentPage.value && project.dir) {
        window.open(currentPage.value.url)
      } else {
        Message.error('项目英文名称必填')
      }
    }
    return {
      project,
      currentPage,
      currentNode,
      isEdit,
      handleMode,
      handlePreviewPage,
      handleGetContainerScrollTop () {
        if (containerEl.value) {
          return (containerEl.value! as Element).scrollTop
        }
        // console.log('handleGetContainerScrollTop 0')
        return 0
      }
    }
  }
})
</script>

<style lang="less">
.app__mobile {
  user-select: none;
}
.app__box-center {
  // width: 320px;
  width: 375px;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
  bottom: 20px;
  .app__mobile-webview {
    height: e('calc(100% - 65px)');
  }
  .app__mobile {
    width: 100%;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,.1);
    &-header {
    }
    &-webview {
      // height: 480px;
      background-color: #eee;
      // margin: 0 -10px;
      // padding: 0 10px;
      // overflow: auto;
      transform: translate3d(0, 0, 0);
      &::-webkit-scrollbar {
        width: 0;
      }
      &-mock {
        position: relative;
        height: 100%;
        background-color: #fff;
        // transform: translate3d(0, 0, 0);
        box-shadow: 0 4px 10px 0 rgba(0,0,0,.1);
        overflow: auto;
      }
    }
  }
}
</style>
