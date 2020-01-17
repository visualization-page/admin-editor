<template>
  <div class="node-style-tools">
    <ul class="flex">
      <li
        v-for="item in list"
        :key="item.title"
        class="mlr5 node-style-tools__item"
        @click="handleClick(item)"
      >
        <el-tooltip effect="dark" :content="item.title" placement="bottom">
          <i class="iconfont" :class="item.icon" />
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/composition-api'
import items, { Item, handleCenter } from './config'
import { currentNode } from '@/assets/node'
import { updateByField } from '@/assets/util'

export default {
  setup () {
    const list = computed(() => {
      if (currentNode.value) {
        return currentNode.value.outDocFlow ? items : items.slice(4)
      }
      return []
    })
    const handleClick = (item: Item) => {
      switch (item.id) {
        case 1:
          // 上对齐
          if (currentNode.value) {
            updateByField(
              currentNode.value,
              'style.position',
              {
                ...(currentNode.value.style.position || {}),
                top: 0,
                bottom: undefined
              }
            )
          }
          break
        case 2:
          // 右对齐
          if (currentNode.value) {
            updateByField(
              currentNode.value,
              'style.position',
              {
                ...(currentNode.value.style.position || {}),
                right: 0,
                left: undefined
              }
            )
          }
          break
        case 3:
          // 下对齐
          if (currentNode.value) {
            updateByField(
              currentNode.value,
              'style.position',
              {
                ...(currentNode.value.style.position || {}),
                bottom: 0,
                top: undefined
              }
            )
          }
          break
        case 4:
          // 左对齐
          if (currentNode.value) {
            const val = currentNode.value.outDocFlow ? {
              ...(currentNode.value.style.position || {}),
              left: 0,
              right: undefined
            } : {
              ...(currentNode.value.style.margin || {}),
              left: '',
              right: ''
            }
            updateByField(
              currentNode.value,
              currentNode.value.outDocFlow ? 'style.position' : 'style.margin',
              val
            )
          }
          break
        case 5:
          if (currentNode.value) {
            updateByField(
              currentNode.value,
              'style.position',
              {}
            )
            updateByField(
              currentNode.value,
              'className',
              handleCenter(currentNode.value.className, 'center-v')
            )
          }
          break
        case 6:
          // 水平居中
          if (currentNode.value) {
            if (currentNode.value.outDocFlow) {
              // 更改 class
              updateByField(
                currentNode.value,
                'style.position',
                {}
              )
              updateByField(
                currentNode.value,
                'className',
                handleCenter(currentNode.value.className, 'center-h')
              )
            } else {
              updateByField(
                currentNode.value,
                'style.margin',
                {
                  ...(currentNode.value.style.margin || {}),
                  left: 'auto',
                  right: 'auto'
                }
              )
            }
          }
          break
        case 7:
          updateByField(currentNode.value, 'style.width', '100%')
          break
        case 8:
          updateByField(currentNode.value, 'style.width', '50%')
          break
        case 9:
          updateByField(currentNode.value, 'style.height', '100%')
          break
        case 10:
          updateByField(currentNode.value, 'style.height', '50%')
          break
      }
    }

    return {
      list,
      handleClick
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
