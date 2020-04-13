<template>
  <div class="basic-component">
    <div>
      <el-button type="text" icon="el-icon-refresh" @click="handleRefresh">刷新列表</el-button>
    </div>
    <van-grid
      class="van-hairline--left"
      :column-num="4"
      clickable
    >
      <van-grid-item
        v-for="(item, i) in list"
        :key="item.id"
        class="cp"
        @click="handleClick(item)"
      >
        <div class="w40 h40 f32 tc" style="color:#409eff">
          <i :class="icon[i]" />
        </div>
        <span class="c-666">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import { addNode, addBeforeValidate } from '@/assets/node'
import { project } from '@/assets/project'
import { setTabName, tabName } from '@/assets/tab'
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
      if (addBeforeValidate()) {
        addNode({ ...item, nodeType: 1 << 0 })
        setTabName([tabName.nodeTree, '', tabName.nodeProperty])
        if (project.componentDownload.every(x => x.name !== item.name)) {
          project.componentDownload.push(item)
        }
      }
    }
    return {
      list,
      icon: ['el-icon-folder-opened', 'el-icon-picture-outline', 'el-icon-s-fold', 'el-icon-edit-outline'],
      handleClick,
      handleRefresh
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
