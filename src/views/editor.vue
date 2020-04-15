<template>
  <div class="editor height-100">
    <div class="app-header">
      <header-opt />
    </div>
    <div class="app-header__bar flex-center-between plr20">
      <el-button icon="el-icon-back" type="text" @click="$router.push('/project/list')">返回项目列表</el-button>
      <span class="b f12 c-666">{{ project.dir ? `编辑 - ${project.dir}` : '新建项目' }}</span>
      <el-button type="text" @click="handleMode">{{ isEdit() ? '预览' : '编辑' }}模式</el-button>
      <node-style-tools v-if="false" />
    </div>
    <div class="app-content flex">
      <div class="app__side-bar">
        <div class="app__block height-50">
          <el-tabs
            :value="tabCurrent.tab1"
            class="height-100"
            type="border-card"
            @input="val => handleClick([val])"
          >
            <el-tab-pane label="项目设置" :name="tabName.projectSet">
              <project-set />
            </el-tab-pane>
            <el-tab-pane label="页面列表" :name="tabName.pageList">
              <page-list />
            </el-tab-pane>
            <el-tab-pane label="节点树" :name="tabName.nodeTree">
              <node-tree />
            </el-tab-pane>
            <el-tab-pane label="页面模版" :name="tabName.pageTemplate">
              <span>敬请期待</span>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="app__block height-50">
          <el-tabs
            :value="tabCurrent.tab2"
            class="height-100"
            type="border-card"
            @input="val => handleClick(['', val])"
          >
            <el-tab-pane label="内置组件" :name="tabName.basicComponent">
              <basic-component />
            </el-tab-pane>
            <el-tab-pane label="封装组件" :name="tabName.highComponent">
              <component-compose />
            </el-tab-pane>
            <el-tab-pane label="上传组件" :name="tabName.uploadComponent">
              <component-upload />
            </el-tab-pane>
            <el-tab-pane label="组件库" :name="tabName.libraryComponent">
              <component-library />
            </el-tab-pane>
            <el-tab-pane label="工具函数" :name="tabName.fx">
              <p>敬请期待</p>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="app__box relative">
        <el-tabs
          :value="tabCurrent.tab4"
          class="height-100"
          type="border-card"
          @input="val => handleClick(['', '', '', val])"
        >
          <el-tab-pane label="场景预览" :name="tabName.previewArea">
            <mobile-render />
          </el-tab-pane>
          <el-tab-pane label="代码编辑" :name="tabName.codeEdit">
            <code-editor />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="app__config">
        <div class="app__block height-100">
          <el-tabs
            :value="tabCurrent.tab3"
            class="height-100"
            type="border-card"
            @input="val => handleClick(['', '', val])"
          >
            <el-tab-pane label="页面设置" :name="tabName.pageSet">
              <page-set />
            </el-tab-pane>
            <el-tab-pane label="属性"  :name="tabName.nodeProperty">
              <node-property />
            </el-tab-pane>
            <el-tab-pane label="样式" :name="tabName.nodeStyle">
              <node-style />
            </el-tab-pane>
            <el-tab-pane label="动画" :name="tabName.nodeAnimate">敬请期待</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from '@vue/composition-api'
import ProjectSet from '@/components/project-set/index.vue'
import PageList from '@/components/page-list/index.vue'
import PageSet from '@/components/page-set/index.vue'
import NodeTree from '@/components/node-tree/index.vue'
import NodeStyle from '@/components/node-style/index.vue'
import NodeStyleTools from '@/components/node-style-tools/index.vue'
import NodeProperty from '@/components/node-property/index.vue'
import BasicComponent from '@/components/basic-components/index.vue'
import MobileRender from '@/components/mobile-render/index.vue'
import CodeEditor from '@/components/code-editor/index.vue'
import HeaderOpt from '@/components/header-opts/index.vue'
import ComponentLibrary from '@/components/component-library/index.vue'
import ComponentCompose from '@/components/component-compose/index.vue'
import ComponentUpload from '@/components/component-upload/index.vue'
import { tabCurrent, setTabName, tabName } from '@/assets/tab'
import { http } from '@/api'
import { initProject, project, resetProject } from '@/assets/project'
import { Message } from 'element-ui'
import { isEdit, setRenderEdit, setRenderPreview } from '@/assets/render'
import { lock, unlock } from '@/assets/lock'

export default defineComponent({
  components: {
    ProjectSet,
    PageList,
    PageSet,
    NodeProperty,
    BasicComponent,
    NodeTree,
    MobileRender,
    NodeStyle,
    NodeStyleTools,
    CodeEditor,
    HeaderOpt,
    ComponentLibrary,
    ComponentCompose,
    ComponentUpload
  },
  beforeRouteLeave (to: any, from: any, next: any) {
    // 如果存在加锁，则去解锁，否则什么也不做
    if (project.lockedBy) {
      // @ts-ignore
      unlock(this.$route.params.dir).then(() => {
        next()
      })
    } else {
      next()
    }
  },
  setup (props, ctx) {
    const dir = ctx.root.$route.params.dir
    if (dir) {
      http.get('project/get', { dir }, {
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
        // @ts-ignore
        initProject(item.data.project)
        lock(dir)
      })
    }
    onUnmounted(() => {
      resetProject()
    })
    const handleMode = () => {
      if (isEdit()) {
        setRenderPreview()
      } else {
        setRenderEdit()
      }
    }
    return {
      tabCurrent,
      tabName,
      project,
      handleMode,
      isEdit,
      handleClick (obj: any) {
        setTabName(obj)
      }
    }
  }
})
</script>

<style lang="less">
@import '../hack-vant-form.less';
@import '~esc-ui/lib/button/index.css';
@import '~esc-ui/lib/page-button/index.css';
.editor {
  [class*=van-hairline]::after {
    border-color: #ccc;
  }
}
</style>
