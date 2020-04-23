<template>
  <div v-if="isEdit() && currentNode && currentNode.id !== '-1'" class="node-style-tools">
    <ul>
      <li v-if="false" class="node-style-tools__item flex-center" @click="handleReset()">
        <el-tooltip effect="dark" content="重置设置" placement="right">
          <i class="el-icon-refresh f16" />
        </el-tooltip>
      </li>
      <li
        v-for="item in list"
        :key="item.title"
        class="node-style-tools__item flex-center"
        :class="{
          active: hasSelect(item.class)
        }"
        @click="handleClick(item)"
      >
        <el-tooltip effect="dark" :content="item.title" placement="right">
          <i :class="[{ iconfont: !item.elementUi }, item.icon]" />
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { computed } from '@vue/composition-api'
import getItems, { Item } from './config'
import { currentNode } from '@/assets/node'
// import { updateByField } from '@/assets/util'
import { isEdit } from '@/assets/render'

export default {
  setup () {
    const list = computed(() => {
      if (currentNode.value) {
        return getItems(currentNode.value.outDocFlow)
      }
      return []
    })
    const handleReset = () => {
      currentNode.value!.quickToolsAddClass = []
    }
    const handleClick = (item: Item) => {
      if (currentNode.value) {
        if (!currentNode.value.quickToolsAddClass) {
          Vue.set(currentNode.value, 'quickToolsAddClass', [])
        }
        const index = currentNode.value.quickToolsAddClass.findIndex((x: string) => x === item.class)
        if (index > -1) {
          currentNode.value.quickToolsAddClass.splice(index, 1)
        } else {
          currentNode.value.quickToolsAddClass.push(item.class)
        }
      }
    }
    const hasSelect = (cls: string) => {
      if (currentNode.value && currentNode.value.quickToolsAddClass) {
        return currentNode.value.quickToolsAddClass.includes(cls)
      }
    }

    return {
      currentNode,
      list,
      isEdit,
      handleClick,
      handleReset,
      hasSelect
    }
  }
}
</script>

<style lang="less">
.node-style-tools {
  position: absolute;
  top: 50%;
  right: calc(50% - 187px - 40px);
  transform: translateY(-50%);
  &__item {
    cursor: pointer;
    color: #666;
    margin-bottom: 10px;
    border: 1px transparent solid;
    &.active {
      background-color: #ddd;
      border-color: #ccc;
    }
    &:hover {
      color: #409eff;
    }
  }
}
</style>
