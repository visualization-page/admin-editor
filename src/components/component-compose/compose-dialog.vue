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
      <el-form-item v-if="false" label="开启 tinypng 压缩">
        <el-checkbox v-model="minify" />
      </el-form-item>
      <el-form-item label="组件封面">
        <p class="f12 c-main">tips: 上传功能限制内网使用</p>
        <textarea
          class="el-input__inner"
          placeholder="截图粘贴或直接输入链接地址"
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
import { upFile } from '@/api'

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
      localCover: this.cover,
      minify: false
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
        if (blob.size >= 2 * 1024 * 1024) {
          // 小于 2 M
          Message.error('截图大小必须小于2M')
          return false
        }
        upFile(blob).then(url => {
          this.localCover = url
        })
        // const rdr = new FileReader()
        // rdr.onloadend = () => {
        //    base64: rdr.result.split(',')[1]
        // }
        // rdr.readAsDataURL(blob)
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
