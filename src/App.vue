<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
}
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

@side-width: 400px;
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
