<template>
  <div
    class="basic-button"
    :style="{
      fontSize,
      color
    }"
  >{{ buttonText }}</div>
</template>

<script lang="ts">
export default {
  props: {
    buttonText: String,
    fontSize: String,
    color: String
  },
  name: 'basic-button'
}
</script>

<style lang="less">
.basic-button {
  display: flex;
  align-items: center;
  justify-content: center;
  // font-size: 14px;
  // color: #fff;
}
</style>
