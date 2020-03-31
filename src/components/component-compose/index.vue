<template>
  <div class="basic-component">
    <div>
      <el-button type="text" icon="el-icon-refresh" @click="handleRefresh">刷新列表</el-button>
    </div>
    <div class="basic-component__list flex flex-wrap">
      <div
        v-for="item in list"
        :key="item.id"
        class="basic-component__item"
        @click="handleClick(item)"
      >
        <div class="basic-component__cover">
          <img :src="item.cover" width="100%" alt="">
        </div>
        <p class="mt5">{{ item.name }}</p>
      </div>
    </div>
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
