<template>
  <div class="page-set">
    <el-form label-width="70px" label-position="left">
      <el-form-item label="ID">
        <el-input disabled />
      </el-form-item>
      <el-form-item label="标题">
        <el-input />
      </el-form-item>
      <el-form-item label="url">
        <el-input />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createComponent } from '@vue/composition-api'

export default createComponent({
  components: {
  }
})
</script>

<style lang="less">

</style>
