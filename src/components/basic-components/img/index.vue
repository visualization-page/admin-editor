<template>
  <img class="basic-img" :src="src">
</template>

<script lang="ts">
export default {
  name: 'basic-img',

  props: {
    src: String
  }
}
</script>
