<template>
  <div class="render-image">
    <p>
      <el-upload
        :action="action"
        :multiple="false"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :on-success="handleResponse"
        :on-error="handleResponse"
      >
        <el-button slot="trigger" type="text">上传图片</el-button>
      </el-upload>
    </p>
    <el-input
      type="textarea"
      placeholder="可以直接输入链接，或点击上传后自动输入"
      :value="src"
      @input="val => $emit('change', val)"
    />
  </div>
</template>

<script>
import { getParentRef } from '@/assets/util'
import { Message, Loading } from 'element-ui'

export default {
  props: {
    schema: Object,
    schemaData: Object
  },

  data () {
    return {
      src: '',
      action: process.env.VUE_APP_FILE_SERVER + '/butterfly/caiyun-file/upload',
      loading: null
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
    handleBeforeUpload (file) {
      const ok = file.type !== 'application/jpg' ||
        file.type !== 'application/png' ||
        file.type !== 'application/jpeg'
      if (!ok) {
        Message.error('文件格式只支持 jpg,png,jpeg')
      } else {
        this.loading = Loading.service({ text: '上传中' })
      }
      return ok
    },
    handleResponse (res) {
      this.loading && this.loading.close()
      if (res.success) {
        Message.success('上传成功')
        this.$emit('change', res.data.fileUrl.replace('statics.jituancaiyun', 'global.uban360') + '&fileType=2')
      } else {
        Message.error(res.msg)
      }
    }
  }
}
</script>
