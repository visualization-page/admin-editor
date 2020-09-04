<template>
  <div class="editor-v2 oh bg-f2">
    <headers />
    <header-unders />
    <div class="editor-v2__content flex">
      <mobile-render class="editor-v2__mobile flex-shrink-0" />
      <div class="flex-center flex-shrink-0">
        <div class="editor-v2__quick-tools">
          <node-tool />
        </div>
      </div>
      <page-list class="flex-shrink-0" />
      <div class="flex flex-grow-1">
        <page-set />
        <node-set />
      </div>
    </div>
    <code-editor />
    <image-resource :show.sync="showImageResource" />
    <search-code :show.sync="showSearchCode" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import Headers from '@/components/v2/headers/index.vue'
import HeaderUnders from '@/components/v2/headers/unders.vue'
import MobileRender from '@/components/mobile-render/index.vue'
import PageList from '@/components/v2/page-list/index.vue'
import NodeTool from '@/components/node-style-tools/index.vue'
import PageSet from '@/components/v2/page-set/index.vue'
import NodeSet from '@/components/v2/node-set/index.vue'
import CodeEditor from '@/components/v2/code-editor/index.vue'
import ImageResource from '@/components/image-resource/index.vue'
import SearchCode from '@/components/search-code/index.vue'
import { http } from '@/api'
import Vue from 'vue'
import { Message } from 'element-ui'
import { initProject, resetProject } from '@/assets/project'
import { lock, unlock } from '@/assets/lock'
import { showImageResource, showSearchCode, clearEditWrapCacheNode } from '@/assets/render'
// import { loadSdk } from '@/assets/util'

export default defineComponent({
  components: {
    Headers,
    HeaderUnders,
    MobileRender,
    PageList,
    NodeTool,
    PageSet,
    NodeSet,
    CodeEditor,
    ImageResource,
    SearchCode
  },
  beforeRouteLeave (to: any, from: any, next: any) {
    // @ts-ignore
    const { dir } = this.$route.params
    if (dir) {
      unlock(dir).then(() => {
        next()
      })
    } else {
      next()
    }
  },
  setup (props, ctx) {
    const dir = ctx.root.$route.params.dir
    clearEditWrapCacheNode()
    resetProject()
    http.get('project/get', { dir, name: Vue.prototype.$native.name }, {
      codeCallback: {
        6001: (res: any) => {
          Message.error(res.msg)
          resetProject()
          setTimeout(() => {
            history.back()
          }, 1000)
        }
      }
    }).then(item => {
      initProject(item.data.project)
      lock(dir)
    })

    // watch(() => [project.interactiveType, project.depLoaded], ([type, loaded]) => {
    //   if (loaded) {
    //     console.log(1)
    //     loadSdk(type as string)
    //   }
    // }, { lazy: true })

    return {
      showImageResource,
      showSearchCode
    }
  }
})
</script>

<style lang="less">
.editor-v2 {
  height: 100vh;
  .shadow {
    box-shadow: 0 0 5px rgba(0,0,0,.1);
  }
  .no-scroll {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  &__content {
    margin: 0px 20px;
    height: e('calc(100vh - 150px)');
  }
  &__mobile {
    position: static !important;
    transform: none !important;
    .app__mobile-webview-mock {
      box-shadow: none;
    }
  }
  &__quick-tools {
    width: 30px;
    min-height: 20%;
    margin: 20px;
    .node-style-tools {
      position: static !important;
      transform: none;
    }
  }
}
</style>
