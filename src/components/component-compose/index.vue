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
        v-for="item in list"
        :key="item.id"
        class="cp"
        @click="handleClick(item)"
      >
        <div v-if="false" class="w40 h40 bg-f2">
          <img :src="item.cover" width="100%" alt="">
        </div>
        <span class="c-666">{{ item.name }}</span>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import { addComposeNode, addBeforeValidate } from '@/assets/node'
import { diffDownloadDeps } from '@/assets/project'
// import { setTabName, tabName } from '@/assets/tab'
import { http } from '@/api'

export default {
  components: {
  },
  setup () {
    const list = ref([])
    http.get('component/list', { type: 'compose' }).then(res => {
      list.value = res.data
    })
    const handleRefresh = () => {
      http.post('component/update', { type: 'compose' }).then(res => {
        list.value = res.data
      })
    }
    const handleClick = async (item) => {
      if (addBeforeValidate()) {
        // 安装组件依赖
        // 合并节点数据
        await diffDownloadDeps(item.componentDeps)
        addComposeNode(item.node)
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
</style>
