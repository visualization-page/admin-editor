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
        :action="server + '/butterfly/component/upload/upload'"
        :multiple="false"
        :data="{ userName: $native.name }"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
      >
        <el-button icon="el-icon-upload" type="text">上传组件 zip 包</el-button>
        <div v-if="false" slot="tip" class="el-upload__tip">只能上传 .zip 文件</div>
      </el-upload>
    </div>
    <van-grid
      class="van-hairline--left"
      :column-num="2"
      clickable
      square
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
import { defineComponent, ref, watch } from '@vue/composition-api'
import { http } from '@/api'
import { Message, Loading, MessageBox } from 'element-ui'
import { addBeforeValidate, addNode } from '@/assets/node'
import { setTabName, tabCurrent, tabName, hideComponent } from '@/assets/tab'
import { project } from '@/assets/project'
import { currentPage } from '@/assets/page'

export default defineComponent({
  name: 'component-upload',
  props: {
    show: Boolean
  },
  setup (props, ctx) {
    const list = ref([])
    const getList = () => {
      http.get('component/list', { type: 'upload' }).then(res => {
        list.value = res.data
      })
    }

    // const stop = watch(() => tabCurrent.tab2, cur => {
    //   if (cur === tabName.uploadComponent) {
    //     getList()
    //     stop()
    //   }
    // })

    watch(() => props.show, val => {
      if (val) {
        getList()
      }
    })

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
        setTabName([tabName.nodeTree, '', tabName.nodeProperty, '', tabName.pageSetTree, tabName.nodeSetProperty])
        hideComponent(true)
        const currentPageDeps = project.componentDownload.filter(x => x.pageId === currentPage.value.id)
        const dep = currentPageDeps.find(x => x.name === item.name)
        if (dep) {
          if (!dep.refNum) {
            dep.refNum = 0
          }
          dep.refNum += 1
        } else {
          project.componentDownload.push({
            ...item,
            pageId: currentPage.value.id,
            refNum: item.refNum || 1
          })
        }
        ctx.emit('hide')
      }
    }
    const downloadItem = async (item) => {
      await MessageBox.confirm('确定要下载组件 zip 包吗')
      location.href = `${http.options.baseUrl}/butterfly/component/download/upload?name=${item.name}`
    }
    const handleTemplate = () => {
      window.open('https://github.com/visualization-page/custom-component-template.git')
    }
    const deleteItem = async (item) => {
      await MessageBox.confirm('确定要删除组件吗')
      await http.post('component/delete', { type: 'upload', dir: item.name.replace('bf-', '') }, { successMessage: '删除成功' })
      getList()
    }
    return {
      list,
      server: process.env.VUE_APP_FILE_SERVER,
      handleBeforeUpload,
      handleSuccess,
      handleClick,
      downloadItem,
      handleTemplate,
      deleteItem
    }
  }
})
</script>

<style lang="less">
.component-upload {
}
</style>
