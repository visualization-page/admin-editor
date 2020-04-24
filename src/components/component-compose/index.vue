<template>
  <div class="basic-component">
    <div class="flex-center-between">
      <el-button type="text" icon="el-icon-refresh" @click="handleRefresh">刷新列表</el-button>
      <el-upload
        class="upload-demo"
        :action="server + '/butterfly/component/upload/compose'"
        :multiple="false"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
      >
        <el-button icon="el-icon-toilet-paper" type="text">导入组件</el-button>
      </el-upload>
    </div>
    <van-grid
      class="van-hairline--left"
      :column-num="2"
      clickable
    >
      <van-grid-item
        v-for="item in list"
        :key="item.id"
        class="cp relative"
        @click="handleClick(item)"
      >
        <div
          class="width-100 flex-center oh"
          :class="{
            'bg-f2': !item.cover
          }"
          :style="{
            height: '150px'
          }"
        >
          <img v-if="item.cover" :src="item.cover" width="100%" alt="">
        </div>
        <p class="mt10">
          <span class="c-666">{{ item.title || item.name }}</span>
          <span class="c-999 ml10">by {{ item.userName }}</span>
        </p>
        <div class="cp absolute r0 t0 flex">
          <div
            v-if="item.userName === $native.name"
            class="mr5"
            @click.stop="deleteItem(item)"><i class="el-icon-delete c-main"></i>
          </div>
          <div @click.stop="downloadItem(item)"><i class="el-icon-download c-blue"></i></div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { addComposeNode, addBeforeValidate } from '@/assets/node'
import { diffDownloadDeps } from '@/assets/project'
import { tabCurrent, tabName } from '@/assets/tab'
import { http } from '@/api'
import { Loading, Message, MessageBox } from 'element-ui'

export default {
  components: {
  },
  setup () {
    const list = ref([])
    const getList = () => {
      http.get('component/list', { type: 'compose' }).then(res => {
        list.value = res.data
      })
    }

    const stop = watch(() => tabCurrent.tab2, cur => {
      if (cur === tabName.highComponent) {
        getList()
        stop()
      }
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
    const downloadItem = async (item) => {
      await MessageBox.confirm('确定要下载组件吗')
      location.href = `${http.options.baseUrl}/butterfly/component/download/compose?name=${item.name}`
    }
    let loading
    const handleBeforeUpload = (file) => {
      const ok = file.type === 'application/json'
      if (ok) {
        loading = Loading.service({ text: '上传中...' })
      } else {
        Message.error('文件为 json')
      }
      return ok
    }
    const handleSuccess = (response, file, fileList) => {
      if (loading) {
        loading.close()
        loading = null
      }
      if (response.success) {
        Message.success('上传成功！')
        getList()
      } else {
        Message.error(response.msg)
      }
    }
    const deleteItem = async (item) => {
      await MessageBox.confirm('确定要删除组件吗')
      await http.post('component/delete', { type: 'compose', dir: item.name }, { successMessage: '删除成功' })
      getList()
    }
    return {
      server: process.env.VUE_APP_FILE_SERVER,
      list,
      handleBeforeUpload,
      handleSuccess,
      handleClick,
      handleRefresh,
      downloadItem,
      deleteItem
    }
  }
}
</script>

<style lang="less">
</style>
