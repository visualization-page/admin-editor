<template>
  <div class="basic-component">
    <div>
      <el-button type="text" icon="el-icon-refresh" @click="handleRefresh">刷新列表</el-button>
    </div>
    <div class="basic-component__list flex flex-wrap">
      <div
        v-for="item in list"
        :key="item.id"
        class="component-item"
        @click="handleClick(item)"
      >
        <div class="component-item__cover">
          <img :src="item.cover" width="100%" alt="">
        </div>
        <p class="mt5">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { ref } from '@vue/composition-api'
// import div from './div'
// import img from './img'
// import rich from './rich-text'
// import button from './button'
import { addNode, currentNode } from '@/assets/node'
import { currentPage } from '@/assets/page'
import { setTabName, tabName } from '@/assets/tab'
import { isEdit } from '@/assets/render'
import { http } from '@/api'

export default {
  components: {
  },
  setup () {
    const list = ref([])
    http.get('component/list', { type: 'basic' }).then(res => {
      list.value = res.data
    })
    const handleRefresh = () => {
      http.post('component/update', { type: 'basic' }).then(res => {
        list.value = res.data
      })
    }
    const handleClick = (item) => {
      if (!currentPage.value) {
        Message.info('请新建页面')
        setTabName([tabName.pageList])
        return
      }
      if (!isEdit()) {
        Message.error('请切换至编辑模式')
        return
      }
      if (currentNode.value && currentNode.value.type !== 'div') {
        Message.error('容器组件才能添加子组件')
      } else {
        addNode(item)
        setTabName([tabName.nodeTree, '', tabName.nodeProperty])
      }
    }
    return {
      list,
      handleClick,
      handleRefresh
    }
  }
}
</script>

<style lang="less">
.basic-component {
  &__list {
    // display: grid;
    // grid-template-columns: auto auto auto;
    /*grid-column-start: 1;*/
    /*grid-column-end: 3;*/
    /*grid-row-start: 1;*/
    /*grid-row-end: 3;*/
  }
}
.component-item {
  width: 90px;
  padding: 10px 0;
  // padding: 7px;
  border: 1px #e2e2e2 solid;
  // border-radius: 3px;
  color: #696969;
  text-align: center;
  cursor: pointer;
  // margin: 0 7px 7px 0;
  /*&:nth-of-type(4n) {*/
  /*  margin-right: 0;*/
  /*}*/
  &__cover {
    width: 45px;
    height: 45px;
    background-color: #f2f2f2;
    margin: 0 auto;
  }
}
</style>
