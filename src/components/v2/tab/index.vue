<template>
  <div class="editor-v2__page-set-tab flex h40 c-666 relative">
    <div
      v-for="(item, i) in tabs"
      :key="i"
      class="flex-center width-50 height-100"
      :class="{
        active: i === value
      }"
      @click="$emit('input', i)"
    >
      <span>{{ item }}</span>
    </div>
    <div
      class="editor-v2__page-tab-line"
      :style="{
        left: value === 0 ? 'calc(25% - 25px)' : 'calc(75% - 25px)'
      }"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array
    }
  }
}
</script>

<style lang="less">
.editor-v2 {
  &__page-tab-line {
    position: absolute;
    bottom: 0;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #ff7d00 20%, #ffb400);
    z-index: 2;
    transition: left .3s;
  }
  &__page-set {
    height: e('calc(100% - 40px)');
    margin-top: 20px;
    margin-left: 2px;
    &-tab {
      .width-50 {
        cursor: pointer;
        border-bottom: 2px solid #f2f2f2;
        &:first-child {
          border-right: 2px solid #f7f8f9;
        }
        &:hover {
          color: #ff7d00;
        }
      }
      .active {
        color: #ff7d00;
      }
    }
  }
}
</style>
