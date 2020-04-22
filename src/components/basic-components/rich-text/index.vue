<template>
  <div
    class="basic-rich"
    v-html="isDef(bindState) ? bindState : content"
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
  },

  methods: {
    isDef (val: any) {
      return val !== undefined && val !== null && val !== ''
    }
  }
}
</script>

<style lang="less">
.basic-rich {
  ol {
    list-style: decimal;
  }
  ul {
    list-style: initial;
  }
  ol, ul, dl {
    font-size: inherit;
    padding-left: 2em;
  }
}
</style>
