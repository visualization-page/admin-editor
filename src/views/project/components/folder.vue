<template>
  <div class="folder">
    <div class="folder__bg">
      <div class="folder__bg-top"></div>
      <div class="folder__bg-item" v-if="item.projects.length">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="folder__middle"></div>
    </div>
    <div class="folder__area absolute width-100 height-100 l0 t0 cp" @click="$emit('click', item)">
      <div class="folder__content flex-center">
        <div class="th1">
          <span>{{ item.name }}</span>
        </div>
        <div
          v-if="(item.user && item.user.uid === $native.uid) || $native.name === '杨明'"
          class="opt absolute l0 t0 width-100 height-100 flex-center-between"
        >
          <i class="el-icon-delete" @click.stop="$emit('delete', item)" />
          <i class="el-icon-setting" @click.stop="$emit('edit', item)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  }
}
</script>

<style lang="less">
.folder {
  position: relative;
  width: 240px;
  height: 240px;
  transform: scale(0.7);
  transform-origin: left top;
  font-size: 14 * 1.2px;
  &__bg {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    &-top {
      position: relative;
      height: 75%;
      &:before {
        box-sizing: border-box;
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 92%;
        height: 40px;
        border-right: 130px solid transparent;
        border-bottom: 180px solid #ffb400;
        border-top-left-radius: 4px;
      }
      &:after {
        box-sizing: border-box;
        content: "";
        position: absolute;
        top: 20px;
        right: 0;
        width: 70%;
        height: 160px;
        background: #ffb400;
        border-top-right-radius: 4px;
      }
    }
    &-item {
      position: absolute;
      top: 9px;
      height: 171px;
      left: 0;
      width: 100%;
      span {
        position: absolute;
        left: 6.25%;
        width: 87.5%;
        bottom: 0;
        box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow: hidden;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        &:nth-child(1) {
          background: #afc7f0;
          height: 164px;
        }
        &:nth-child(2) {
          background: #dae8ff;
          height: 152px;
        }
        &:nth-child(3) {
          background: #fff;
          height: 140px;
        }
      }
    }
  }
  &__middle {
    position: absolute;
    left: 0;
    bottom: 60px;
    height: 45.83333%;
    width: 100%;
    /*background: rgba(114, 168, 247, 0.42);*/
    background: rgba(#ffb400, 0.42);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.05);
  }
  &__content {
    position: absolute;
    bottom: 0;
    height: 60px;
    left: 0;
    width: 100%;
    background: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .1);
    padding: 10px 30px;
    .opt {
      display: none;
      padding: 0 10px;
      color: #3b8ff6;
      font-weight: bolder;
      font-size: 20px;
    }
  }
  &__area {
    &:hover {
      .opt {
        display: flex;
      }
    }
  }
}
</style>
