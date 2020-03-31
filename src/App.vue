<template>
  <div id="app">
    <div class="app-header">
      <header-opt />
    </div>
    <div class="app-header__bar flex-center">
      <node-style-tools />
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
            <el-tab-pane label="组件库" :name="tabName.libraryComponent">
              <component-library />
            </el-tab-pane>
            <el-tab-pane label="工具函数" :name="tabName.fx">
              <p>toast / alert / 打点 / 获取 cookie</p>
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
            <el-tab-pane label="动画" :name="tabName.nodeAnimate">动画</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import ProjectSet from './components/project-set/index.vue'
import PageList from './components/page-list/index.vue'
import PageSet from './components/page-set/index.vue'
import NodeTree from './components/node-tree/index.vue'
import NodeStyle from './components/node-style/index.vue'
import NodeStyleTools from './components/node-style-tools/index.vue'
import NodeProperty from './components/node-property/index.vue'
import BasicComponent from './components/basic-components/index.vue'
import MobileRender from './components/mobile-render/index.vue'
import CodeEditor from './components/code-editor/index.vue'
import HeaderOpt from './components/header-opts/index.vue'
import ComponentLibrary from './components/component-library/index.vue'
import ComponentCompose from './components/component-compose/index.vue'
import { tabCurrent, setTabName, tabName } from '@/assets/tab'

export default createComponent({
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
    ComponentCompose
  },
  setup () {
    return {
      tabCurrent,
      tabName,
      handleClick (obj: any) {
        setTabName(obj)
      }
    }
  }
})
</script>

<style lang="less">
.el-tabs {
  & &__item {
    height: 25px;
    line-height: 23px;
    font-size: 12px;
  }
  & &__nav-prev,
  & &__nav-next {
    line-height: 23px;
  }
  &.el-tabs--border-card {
    box-shadow: none;
    border: none;
  }
  & &__content {
    height: e('calc(100% - 25px)');
    overflow: auto;
  }
}
.c-blue {
  color: #409eff;
}

.cp {
  cursor: pointer;
}

@side-width: 300px;
.app-header {
  height: 50px;
  background-color: #4a4c55;
  &__bar {
    position: relative;
    height: 30px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
    z-index: 100;
  }
}
.app-content {
  height: e('calc(100vh - 50px - 30px)');
}
.app__side-bar {
  width: @side-width;
  height: 100%;
}
.app__box {
  flex-grow: 1;
  height: 100%;
  // padding: 10px;
  .el-tabs__content {
    background-color: #eee;
    padding: 0 !important;
    overflow: visible;
  }
}
.app__config {
  width: @side-width;
  height: 100%;
}
</style>
