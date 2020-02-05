<template>
  <div
    v-show="show"
    class="context-menu"
    :style="{
      left: left + 'px',
      top: top + 'px'
    }"
  >
    <div class="context-menu__item" @click="handleDel">删除</div>
    <template v-if="outDocFlow">
      <div class="context-menu__item">上移一层</div>
      <div class="context-menu__item">下移一层</div>
      <div class="context-menu__item">置顶</div>
      <div class="context-menu__item">置底</div>
    </template>
  </div>
</template>

<script>
import { createComponent, toRefs, computed } from '@vue/composition-api'
import { contextPosition } from './position'
import { delNode, currentNode } from '@/assets/node'
import { MessageBox } from 'element-ui'

export default createComponent({
  setup () {
    return {
      ...toRefs(contextPosition),
      outDocFlow: computed(() => currentNode.value && currentNode.value.outDocFlow),
      async handleDel () {
        await MessageBox.confirm('确定要删除吗')
        delNode({ nodeId: currentNode.value.id })
      }
    }
  }
})
</script>

<style lang="less">
.context-menu {
  position: fixed;
  width: 100px;
  background-color: #fff;
  z-index: 9999;
  box-shadow: 0 0 2px rgba(0, 0, 0, .3);
  text-align: center;
  &__item {
    padding: 10px 0;
    cursor: pointer;
    &:not(:last-of-type) {
      border-bottom: 1px #eee solid;
    }
    &:hover {
      background-color: #f2f2f2;
    }
  }
}
</style>
