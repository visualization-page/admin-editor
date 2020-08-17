<template>
  <el-dialog
    :visible.sync="localShow"
    class="before-publish-modal"
    title="发布配置"
    width="600px"
    @close="$emit('close')"
  >
    <div class="flex items-center mb20">
      <span class="flex-shrink-0 f12" style="width: 80px">发布备注</span>
      <el-input placeholder="请输入至少 3 个字符" v-model="remark" />
    </div>
    <div class="flex">
      <p class="f12" style="width: 80px">选择环境</p>
      <el-radio-group
        v-model="project.env"
      >
        <div class="mb5 f12">
          <el-radio label="dev">本机开发环境</el-radio>
        </div>
        <div class="mb5 f12">
          <el-radio label="pro">默认发布环境</el-radio>
        </div>
        <template v-if="project.config.proArr">
          <div
            v-for="(it, i) in project.config.proArr.map(x => x.name)"
            :key="i"
            class="mb5"
          >
            <el-radio :label="it" />
          </div>
        </template>
      </el-radio-group>
    </div>
    <schema-form
      :schema="pubSchema"
      :schema-data="project"
      @updateByField="updateProjectByField"
    />
    <template slot="footer">
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { project } from '@/assets/project'
import { Message } from 'element-ui'
import SchemaForm from '@/components/schema/index.vue'
import { pub } from '@/components/v2/project-set/config'
import { updateByField } from '@/assets/util'

export default {
  components: {
    SchemaForm
  },
  data () {
    const sessionKey = `${this.$route.params.dir}-remark`
    return {
      localShow: true,
      project,
      sessionKey,
      remark: sessionStorage.getItem(sessionKey),
      pubSchema: pub
    }
  },
  watch: {
    'project.env': {
      handler: function (env) {
        let item
        if (env === 'dev' || env === 'pro') {
          item = project.config[env]
        } else {
          item = project.config.proArr.find(x => x.name === env).kv
        }
        const { syncPath, onlineUrl } = item
        project.config.path = syncPath || ''
        project.url = onlineUrl || ''
      },
      immediate: true
    }
  },
  methods: {
    updateProjectByField (field, val) {
      updateByField(project, field, val)
    },
    confirm () {
      if (project.env === 'dev') {
        Message.error('请选择非开发环境')
      } else if (!this.remark) {
        Message.error('请输入发布备注')
      } else if (this.remark.trim().length < 3) {
        Message.error('发布备注至少为3个字符')
      } else {
        sessionStorage.setItem(this.sessionKey, this.remark)
        this.$emit('confirm', this.remark)
      }
    }
  }
}
</script>
