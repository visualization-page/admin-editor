<template>
  <div class="flex flex-wrap">
    <div
      v-for="item in list"
      :key="item.id"
      class="component-item"
      @click="handleClick(item)"
    >
      <div class="component-item__cover">
        <img :src="item.cover" width="100%" alt="">
      </div>
      <p class="mt5">{{ item.title }}</p>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import div from './div'
import img from './img'
import rich from './rich-text'
import button from './button'
import { addNode, currentNode } from '@/assets/node'
import { setTabName, tabName } from '@/assets/tab'

export default {
  components: {
  },
  setup () {
    const handleClick = (item) => {
      if (!currentNode.value) {
        Message.info('请新建页面')
        setTabName([tabName.pageList])
        return
      }
      if (currentNode.value.type !== 'div') {
        Message.error('容器组件才能添加子组件')
      } else {
        addNode(item)
        setTabName([tabName.nodeTree, '', tabName.nodeProperty])
      }
    }
    return {
      list: [
        div,
        img,
        rich,
        button
      ],
      handleClick
    }
  }
}
</script>

<style lang="less">
.component-item {
  padding: 7px;
  border: 1px #e2e2e2 solid;
  border-radius: 3px;
  color: #696969;
  text-align: center;
  cursor: pointer;
  margin: 0 7px 7px 0;
  &:nth-of-type(4n) {
    margin-right: 0;
  }
  &__cover {
    width: 45px;
    height: 45px;
    background-color: #f2f2f2;
  }
}
</style>
