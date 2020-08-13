<template>
  <div class="basic-component">
    <van-grid
      class="van-hairline--left"
      :column-num="4"
      clickable
    >
      <van-grid-item
        v-for="(item) in basic"
        :key="item.title"
        class="cp"
        @click="handleClick(item)"
      >
        <div class="w40 h40 f32 tc" style="color: #ff7d00">
          <i :class="item.cover" />
        </div>
        <span class="c-666">{{ item.title }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { addNode, addBeforeValidate } from '@/assets/node'
import { setTabName, tabName, hideComponent } from '@/assets/tab'
import { basic, useBasicComponents } from './'

useBasicComponents()
export default {
  name: 'component-basic',
  setup () {
    const handleClick = (item) => {
      if (addBeforeValidate()) {
        addNode({ ...item })
        setTabName([tabName.nodeTree, '', tabName.nodeProperty])
        hideComponent(true)
      }
    }
    return {
      basic,
      handleClick
    }
  }
}
</script>

<style lang="less">
.basic-component {
  &__list {
    border-top: 1px #e2e2e2 solid;
    border-left: 1px #e2e2e2 solid;
  }
  &__item {
    width: 89px;
    padding: 10px 0;
    border-right: 1px #e2e2e2 solid;
    border-bottom: 1px #e2e2e2 solid;
    color: #696969;
    text-align: center;
    cursor: pointer;
  }
  &__cover {
    width: 30px;
    height: 30px;
    background-color: #f2f2f2;
    margin: 0 auto;
  }
}
</style>
