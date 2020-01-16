<template>
  <div class="node-style-tools">
    <ul class="flex">
      <li
        v-for="item in items"
        :key="item.title"
        class="mlr5 node-style-tools__item"
      >
        <el-tooltip effect="dark" :content="item.title" placement="bottom">
          <i class="iconfont" :class="item.icon" />
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api'
import items from './config'

export default {
  setup () {
    return {
      items
    }
  }
}
</script>

<style lang="less">
.node-style-tools {
  &__item {
    cursor: pointer;
    color: #666;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
