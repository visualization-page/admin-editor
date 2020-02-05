<template>
  <div class="basic-img">
    <img :src="src" width="100%" height="100%">
  </div>
</template>

<script lang="ts">
export default {
  name: 'basic-img',

  props: {
    src: String
  }
}
</script>
