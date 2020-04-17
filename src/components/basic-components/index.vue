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
        <div class="w40 h40 f32 tc" style="color:#409eff">
          <i :class="item.cover" />
        </div>
        <span class="c-666">{{ item.title }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import Vue from 'vue'
// import { ref } from '@vue/composition-api'
import { addNode, addBeforeValidate } from '@/assets/node'
// import { project } from '@/assets/project'
import { setTabName, tabName } from '@/assets/tab'
import { basic, useBasicComponents } from './'

useBasicComponents()
export default {
  setup () {
    // const dataList = ref()
    // http.get('component/list', { type: 'basic' }).then(res => {
    //   list.value = res.data
    // })
    // const handleRefresh = () => {
    //   http.post('component/update', { type: 'basic' }).then(res => {
    //     list.value = res.data
    //   })
    // }
    const handleClick = (item) => {
      if (addBeforeValidate()) {
        addNode({ ...item, nodeType: 1 << 0 })
        setTabName([tabName.nodeTree, '', tabName.nodeProperty])
        // if (project.componentDownload.every(x => x.name !== item.name)) {
        //   project.componentDownload.push(item)
        // }
      }
    }
    return {
      basic,
      // icon: ['el-icon-folder-opened', 'el-icon-picture-outline', 'el-icon-s-fold', 'el-icon-edit-outline'],
      handleClick
      // handleRefresh
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
