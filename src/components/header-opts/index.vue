<template>
  <div class="header-opt height-100 flex-center-between plr20">
    <span class="f20 c-fff">Butterfly</span>
    <div class="flex">
      <el-button type="text" @click="handleSave">
        <span class="flex-center"><i class="iconfont icon-save mr5" />保存到本地</span>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { exportProjectLocal } from '@/assets/project'
import { Message } from 'element-ui'

export default createComponent({
  setup () {
    const handleSave = () => {
      exportProjectLocal()
      Message.success('保存成功')
    }

    return {
      handleSave
    }
  }
})
</script>
