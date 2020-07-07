<template>
  <i v-if="icon" :class="`iconfont ${icon}`" />
</template>

<script lang="ts">
export default {
  name: 'basic-icon',

  props: {
    icon: String
  }
}
</script>
