<template>
  <el-dialog
    title="封装组件"
    :visible.sync="localShow"
    width="400px"
  >
    <el-form>
      <el-form-item label="组件名称">
        <el-input type="input" placeholder="字母/数字/短杠" v-model="localName" />
      </el-form-item>
      <el-form-item label="组件封面">
        <textarea
          class="el-input__inner"
          placeholder="截图粘贴"
          style="height: 80px; line-height: 20px"
          v-model="localCover"
          @paste="paste"
        />
      </el-form-item>
    </el-form>
    <el-button slot="footer" type="primary" @click="handleConfirm">确定</el-button>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import { http } from '@/api'

export default {
  props: {
    show: Boolean,
    name: String,
    cover: String,
    callback: Function
  },
  data () {
    return {
      localShow: false,
      localName: this.name,
      localCover: this.cover
    }
  },
  watch: {
    localShow (val) {
      if (!val) {
        this.$emit('update:show', false)
      }
    },
    show (val) {
      if (val) {
        this.localShow = true
      }
    },
    name (val) {
      this.localName = val
    },
    cover (val) {
      this.localCover = val
    }
  },
  methods: {
    handleConfirm () {
      if (!/^[a-zA-Z][a-zA-Z0-9-]{0,50}$/.test(this.localName)) {
        Message.error('组件名称不合法')
        return
      }
      if (!/^http/.test(this.localCover)) {
        Message.error('组件封面链接不合法')
        return
      }
      this.callback(this.localName, this.localCover)
      this.localShow = false
    },

    paste (e) {
      const pasteItem = e.clipboardData.items[0]
      if (pasteItem && /image/.test(pasteItem.type)) {
        e.preventDefault()
        const blob = pasteItem.getAsFile()
        const rdr = new FileReader()
        rdr.onloadend = () => {
          http.post('login/upload', {
            base64: rdr.result.split(',')[1],
            size: blob.size
          }).then(res => {
            this.localCover = res.data.fileUrl.replace('statics.jituancaiyun', 'global.uban360') + '&fileType=2'
          })
        }
        rdr.readAsDataURL(blob)
      } else {
        pasteItem.getAsString(content => {
          // console.log(content)
          // this.$message.info('复制的是字符串')
          this.localCover = content
        })
      }
    }
  }
}
</script>
