<template>
  <div class="basic-rich" v-html="content"/>
</template>

<script lang="ts">
export default {
  name: 'basic-rich',

  props: {
    content: String
  }
}
</script>
