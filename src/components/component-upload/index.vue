<template>
  <div class="component-upload">
    <el-upload
      class="upload-demo"
      :action="server + '/butterfly/upload'"
      :multiple="false"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
    >
      <el-button icon="el-icon-upload" type="text">上传组件 zip 包</el-button>
      <div v-if="false" slot="tip" class="el-upload__tip">只能上传 .zip 文件</div>
    </el-upload>
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
import { defineComponent, ref } from '@vue/composition-api'
import { http } from '@/api'
import { Message, Loading } from 'element-ui'
import { addBeforeValidate, addNode } from '@/assets/node'
import { setTabName, tabName } from '@/assets/tab'
import { project } from '@/assets/project'

export default defineComponent({
  name: 'index',
  setup () {
    const list = ref([])
    const getList = () => {
      http.get('component/list', { type: 'upload' }).then(res => {
        list.value = res.data
      })
    }
    getList()
    let loading
    const handleBeforeUpload = (file) => {
      const ok = file.type === 'application/zip'
      if (ok) {
        loading = Loading.service({ text: '上传编译中...' })
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
    const handleClick = (item) => {
      if (addBeforeValidate()) {
        addNode({ ...item, nodeType: 1 << 0 })
        setTabName([tabName.nodeTree, '', tabName.nodeProperty])
        project.componentDownload.push(item)
      }
    }
    return {
      list,
      server: process.env.VUE_APP_FILE_SERVER,
      handleBeforeUpload,
      handleSuccess,
      handleClick
    }
  }
})
</script>

<style lang="less">
.component-upload {
}
</style>
