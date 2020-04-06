<template>
  <div class="component-upload">
    <div class="flex-center-between">
      <el-button
        icon="el-icon-download"
        type="text"
        @click="handleTemplate"
      >
        下载自定义组件模版
      </el-button>
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
    </div>
    <div class="basic-component__list flex flex-wrap">
      <div
        v-for="item in list"
        :key="item.id"
        class="basic-component__item relative"
        @click="handleClick(item)"
      >
        <div v-if="false" class="basic-component__cover">
          <img :src="item.cover" width="100%" alt="">
        </div>
        <div @click.stop="downloadItem(item)" class="cp absolute r10 t0"><i class="el-icon-download"></i></div>
        <p class="mt5">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { http } from '@/api'
import { Message, Loading, MessageBox } from 'element-ui'
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
    const downloadItem = async (item) => {
      await MessageBox.confirm('确定要下载组件 zip 包吗')
      // console.log(item)
      // await http.post('component/download', { name: item.name, type: 'upload' })
      location.href = `${http.options.baseUrl}/butterfly/component/download/upload?name=${item.name}`
    }
    const handleTemplate = () => {
      window.open('https://github.com/visualization-page/custom-component-template.git')
    }
    return {
      list,
      server: process.env.VUE_APP_FILE_SERVER,
      handleBeforeUpload,
      handleSuccess,
      handleClick,
      downloadItem,
      handleTemplate
    }
  }
})
</script>

<style lang="less">
.component-upload {
}
</style>
