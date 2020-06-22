<template>
  <el-dialog
    :visible.sync="localShow"
    class="before-publish-modal"
    title="发布配置"
    width="400px"
    @close="$emit('close')"
  >
    <template v-if="project.config.proArr.length">
      <p class="mb10">选择发布环境</p>
      <el-radio-group
        v-model="project.env"
      >
        <div class="mb5">
          <el-radio label="dev">本机开发环境</el-radio>
        </div>
        <div class="mb5">
          <el-radio label="pro">默认发布环境</el-radio>
        </div>
        <div
          v-for="(it, i) in project.config.proArr.map(x => x.name)"
          :key="i"
          class="mb5"
        >
          <el-radio :label="it" />
        </div>
      </el-radio-group>
    </template>
    <div class="flex items-center mt20">
      <span class="flex-shrink-0 mr15">备注</span>
      <el-input placeholder="请输入至少 3 个字符" v-model="remark" />
    </div>
    <template slot="footer">
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { project } from '@/assets/project'
import { Message } from 'element-ui'

export default {
  data () {
    return {
      localShow: true,
      project,
      remark: ''
    }
  },
  methods: {
    confirm () {
      // if (project.config.proArr.length && project.env === 'dev') {
      //   Message.error('请选择发布环境')
      // } else
      if (!this.remark) {
        Message.error('请输入发布备注')
      } else if (this.remark.trim().length < 3) {
        Message.error('发布备注至少为3个字符')
      } else {
        this.$emit('confirm', this.remark)
      }
    }
  }
}
</script>
