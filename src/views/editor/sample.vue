<template>
  <div class="editor" overflow-h>
    <div class="app-header">
      <header-opt />
    </div>

    <div class="app-header__bar flex-center-between plr20">
      <el-button icon="el-icon-back" type="text" @click="$router.push('/project/list')">返回项目列表</el-button>
      <span class="b f12 c-666">{{ project.dir ? `编辑 - ${project.dir}` : '新建项目' }}</span>
      <span />
    </div>

    <div class="editor-sample__wrap flex">
      <div class="editor-sample__mobile relative height-100 flex-shrink-0">
        <mobile-render />
      </div>

      <div class="flex-grow-1 ml30 oa">
        <div class="bg-fff p15">
          <div class="f14 b mb10">页面列表</div>
          <div class="flex">
            <page-list sample />
          </div>
        </div>
        <div class="bg-fff p15 mt15">
          <div class="f14 b mb10">文案列表</div>
          <sample-item
            :list="nodeText"
            type="text"
            @edit="showEditPanel = true"
          />
        </div>
        <div class="bg-fff p15 mt15">
          <div class="f14 b mb10">图片列表</div>
          <sample-item
            :list="nodeImg"
            type="img"
          />
        </div>
      </div>
    </div>

    <transition name="sample-slide">
      <div
        v-show="showEditPanel"
        class="edit-panel absolute r0 bg-fff b0 oa p15"
        style="width: 400px;top:80px;box-shadow: -2px 0 5px rgba(0,0,0,0.1)"
        @click.stop=""
      >
        <div class="flex-center-between bb bd-eee mb15 pb10">
          <span class="b f14">编辑节点</span>
          <i class="el-icon-close f18 c-666 cp" @click="showEditPanel = false"></i>
        </div>
        <node-property />
      </div>
    </transition>

    <p
      class="absolute tc l0 r0 c-aaa f10"
      style="text-shadow: 1px 1px 1px rgba(0,0,0,.1);bottom:2px;user-select: none"
    >
      Designed by 讯盟FE - 前端运营商组
    </p>

    <div
      class="fixed b50 r0 ptb10 plr5 bg-fff bd bd-ccc tc br4 c-blue cp"
      @click="$router.push('/suggest')"
    >
      <i class="el-icon-chat-square f20"></i>
      <p class="f10">反馈<br/>建议</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, onUnmounted, onMounted, watch, ref } from '@vue/composition-api'
import HeaderOpt from '@/components/header-opts/index.vue'
import MobileRender from '@/components/mobile-render/index.vue'
import { lock, unlock } from '@/assets/lock'
import { http } from '@/api'
import { Message } from 'element-ui'
import { initProject, resetProject, project } from '@/assets/project'
import { currentPage } from '@/assets/page'
import { NodeItem } from '@/assets/node'
import { clearEditWrapCacheNode } from '@/assets/render'
import BasicComponent from '@/components/basic-components/index.vue'
import PageList from '@/components/page-list/index.vue'
import SampleItem from './components/sample-item.vue'
import NodeProperty from '@/components/node-property/index.vue'

export default defineComponent({
  name: 'edit-sample',
  components: {
    HeaderOpt,
    MobileRender,
    BasicComponent,
    PageList,
    SampleItem,
    NodeProperty
  },
  beforeRouteLeave (to: any, from: any, next: any) {
    window.confirm('确定要离开吗？')
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
    const nodeText = ref<NodeItem[]>([])
    const nodeImg = ref<NodeItem[]>([])
    const showEditPanel = ref(false)
    if (dir) {
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
    }
    function findNodeBy (nodes: NodeItem[], asserts: (it: NodeItem) => boolean) {
      const result = []
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]
        if (asserts(item)) {
          result.push(item)
        }
        if (item.children.length) {
          const r = findNodeBy(item.children, asserts)
          if (r.length) {
            result.push.apply(result, r)
          }
        }
      }
      return result
    }
    const toggleEditPanel = () => {
      showEditPanel.value = false
    }
    watch(() => currentPage.value, page => {
      if (page) {
        nodeText.value = findNodeBy(page.nodes, it => it.type === 'rich-text')
        nodeImg.value = findNodeBy(page.nodes, it => it.type === 'img')
      }
    }, { lazy: true })
    onMounted(() => {
      document.addEventListener('click', toggleEditPanel)
    })
    onUnmounted(() => {
      clearEditWrapCacheNode()
      resetProject()
      document.removeEventListener('click', toggleEditPanel)
    })
    return {
      nodeText,
      nodeImg,
      project,
      showEditPanel
    }
  }
})
</script>

<style lang="less">
.editor-sample {
  &__wrap {
    height: e('calc(100vh - 50px - 30px)');
    padding: 20px;
    background-color: #f2f2f2;
  }
  &__mobile {
    width: 400px;
  }
}
.sample-slide-enter {
  transform: translate3d(100%, 0, 0);
}
.sample-slide-leave-active {
  transform: translate3d(100%, 0, 0);
}
.sample-slide-enter-active,
.sample-slide-leave-active {
  transition: all 0.5s linear;
}
</style>
