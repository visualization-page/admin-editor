<template>
  <div id="app">
    <div class="app-header"></div>
    <div class="app-content flex">
      <div class="app__side-bar">
        <div class="app__block height-50">
          <el-tabs class="height-100" type="border-card">
            <el-tab-pane label="项目设置">项目设置</el-tab-pane>
            <el-tab-pane label="页面列表">页面列表</el-tab-pane>
            <el-tab-pane label="节点树">节点树</el-tab-pane>
          </el-tabs>
        </div>
        <div class="app__block height-50">
          <el-tabs class="height-100" type="border-card">
            <el-tab-pane label="通用组件">基础组件</el-tab-pane>
            <el-tab-pane label="业务组件">高级组件</el-tab-pane>
            <el-tab-pane label="工具函数">高级组件</el-tab-pane>
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
            <el-tab-pane label="页面设置">页面设置</el-tab-pane>
            <el-tab-pane label="属性">属性</el-tab-pane>
            <el-tab-pane label="样式">样式</el-tab-pane>
            <el-tab-pane label="动画">动画</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

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

.app-header {
  height: 50px;
  background-color: #4a4c55;
}
.app-content {
  height: e('calc(100vh - 50px)');
}
.app__side-bar {
  width: 300px;
  height: 100%;
}
.app__box {
  flex-grow: 1;
  height: 100%;
  background-color: #eee;
  padding: 10px;
}
.app__config {
  width: 300px;
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
