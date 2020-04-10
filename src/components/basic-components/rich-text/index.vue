<template>
  <div
    class="basic-rich"
    v-html="bindState || content"
    :style="{
      fontSize: bindState && fontSize && `${fontSize}px`,
      color: bindState && color
    }"
  />
</template>

<script lang="ts">
export default {
  name: 'basic-rich',

  props: {
    content: String,
    bindState: [String, Object, Array, Number],
    fontSize: String,
    color: String
  }
}
</script>
