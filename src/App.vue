<template>
  <div id="app">
    <div class="app-header"></div>
    <div class="app-header__bar"></div>
    <div class="app-content flex">
      <div class="app__side-bar">
        <div class="app__block height-50">
          <el-tabs class="height-100" type="border-card">
            <el-tab-pane label="项目设置">
              <project-set />
            </el-tab-pane>
            <el-tab-pane label="页面列表">
              <page-list />
            </el-tab-pane>
            <el-tab-pane label="节点树">
              <p>当前选中页面的 节点树</p>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="app__block height-50">
          <el-tabs class="height-100" type="border-card">
            <el-tab-pane label="通用组件">
              <p>万能节点容器</p>
              <p>三栏布局、两栏布局</p>
            </el-tab-pane>
            <el-tab-pane label="业务组件">
              <p>业务组件</p>
            </el-tab-pane>
            <el-tab-pane label="工具函数">
              <p>toast / alert / 打点 / 获取 cookie</p>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="app__box relative">
        <div class="app__box-center absolute">
          <div class="app__mobile">
            <div class="app__mobile-header relative bb bd-eee">
              <img src="http://file.iming.work/85bcf0d2af175231da45.png" width="100%" alt="">
              <span class="absolute l0 b0 width-100 pb10 tc f16">标题</span>
            </div>
            <div class="app__mobile-webview"></div>
          </div>
        </div>
      </div>
      <div class="app__config">
        <div class="app__block height-100">
          <el-tabs class="height-100" type="border-card">
            <el-tab-pane label="页面设置">
              <page-set />
            </el-tab-pane>
            <el-tab-pane label="属性">属性</el-tab-pane>
            <el-tab-pane label="样式">样式</el-tab-pane>
            <el-tab-pane label="动画">动画</el-tab-pane>
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

export default createComponent({
  components: {
    ProjectSet,
    PageList,
    PageSet
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
  background-color: #eee;
  padding: 10px;
}
.app__config {
  width: @side-width;
  height: 100%;
}
.app__box-center {
  width: 320px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .app__mobile {
    width: 100%;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,.1);
    &-header {
    }
    &-webview {
      height: 480px;
      background-color: #fff;
    }
  }
}
</style>
