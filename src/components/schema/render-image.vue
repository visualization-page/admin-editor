<template>
  <div class="render-image">
    <p v-if="false" class="flex-center-between">
      <el-checkbox v-model="minify">
        <span class="f12 c-999">开启 tinypng 压缩</span><br>
      </el-checkbox>
      <el-button v-if="src" type="text" @click="handleShowImage">查看图片</el-button>
    </p>
    <p>
      <el-upload
        name="upfile"
        :action="action"
        :multiple="false"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :on-success="handleResponse"
        :on-error="handleResponse"
        :data="{ minify: minify || '' }"
        :http-request="handleUpload"
      >
        <el-button slot="trigger" type="text">上传图片</el-button>
        <span class="f10 c-main ml10">(tips: 上传功能限制内网使用)</span>
      </el-upload>
    </p>
    <el-input
      type="textarea"
      placeholder="可以直接输入链接，或点击上传后自动输入"
      :value="src"
      @input="val => src = val"
      @blur="$emit('change', src)"
    />
  </div>
</template>

<script>
import { getParentRef } from '@/assets/util'
import { Message, Loading } from 'element-ui'
import { showImageResource } from '@/assets/render'
import { upFile } from '@/api'

export default {
  props: {
    schema: Object,
    schemaData: Object
  },

  data () {
    return {
      src: '',
      // action: process.env.VUE_APP_FILE_SERVER + '/butterfly/caiyun-file/upload',
      action: '',
      loading: null,
      minify: false
    }
  },

  watch: {
    schemaData: {
      handler (data) {
        if (data) {
          const { pref, field } = getParentRef(this.schema.field, data)
          this.src = pref[field]
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    async handleUpload (data) {
      const fileUrl = await upFile(data.file)
      return {
        code: 200,
        fileUrl
      }
    },

    handleBeforeUpload (file) {
      if (!['jpg', 'png', 'jpeg'].includes(file.type.split('/')[1])) {
        Message.error('文件格式只支持 jpg,png,jpeg')
        return false
      } else if (file.size >= 2 * 1024 * 1024) {
        // 小于 2 M
        Message.error('文件大小必须小于2M')
        return false
      }
      this.loading = Loading.service({ text: '上传中' })
      return true
    },

    handleResponse (res) {
      this.loading && this.loading.close()
      if (res.code === 200) {
        Message.success('上传成功')
        this.$emit('change', res.fileUrl.replace('statics.jituancaiyun', 'global.uban360') + '&fileType=2')
      } else {
        Message.error(res.msg)
      }
    },
    handleShowImage () {
      showImageResource.value = true
    }
  }
}
</script>
