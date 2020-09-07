<template>
  <el-dialog
    :visible.sync="localShow"
    class="before-publish-modal"
    title="发布配置"
    width="600px"
    @close="$emit('close')"
  >
    <div class="flex mb20">
      <span class="flex-shrink-0 f12" style="width: 80px">发布备注</span>
      <el-input type="textarea" placeholder="请输入至少 3 个字符" v-model="remark" />
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
    <div class="flex mtb20" v-if="project.syncFile">
      <span class="flex-shrink-0 f12" style="width: 80px">从发布系统中导入项目配置</span>
      <el-select
        v-model="deployProjectKeyword"
        filterable
        remote
        reserve-keyword
        placeholder="请输入项目标题"
        :remote-method="handleSearch"
        :loading="loadingSearch"
      >
        <el-option
          v-for="item in deployProjectList"
          :key="item.id"
          :label="item.label"
          :value="item.targetPath">
        </el-option>
      </el-select>
    </div>
    <schema-form
      :schema="pubSchema"
      :schema-data="project"
      @updateByField="updateProjectByField"
    />
    <template v-if="hasIoc && project.interactiveType === 'xmmp'">
      <p class="f12 mb10 bd bd-eee bt pt10 b">对接第三方发布</p>
      <schema-form
        :schema="iocSchema"
        :schema-data="project"
        @updateByField="updateProjectByField"
      />
    </template>
    <template slot="footer">
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { project } from '@/assets/project'
import { Message } from 'element-ui'
import SchemaForm from '@/components/schema/index.vue'
import { pub, pubIoc } from '@/components/v2/project-set/config'
import { updateByField } from '@/assets/util'
import { http } from '@/api'

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
      deployProjectKeyword: '',
      deployProjectList: [],
      pubSchema: pub,
      iocSchema: pubIoc,
      loadingSearch: false,
      hasIoc: !!process.env.VUE_APP_ENV_TTILE
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
        project.config.path = syncPath || project.config.path || ''
        project.url = onlineUrl || project.url || ''
      },
      immediate: true
    },
    deployProjectKeyword (val) {
      if (val) {
        project.config.path = val.replace('/data/webapps/', '')
      }
    }
  },
  methods: {
    handleSearch (query) {
      if (query) {
        this.loadingSearch = true
        http.get('project/pubSearch', { keyword: query }).then(res => {
          this.loadingSearch = false
          this.deployProjectList = res.data.map(x => ({
            ...x,
            // label: `${x.title}|${x.name}`
            label: x.title
          }))
        })
      } else {
        this.loadingSearch = false
      }
    },
    updateProjectByField (field, val) {
      updateByField(project, field, val)
    },
    confirm () {
      const {
        env,
        config: {
          iocSync,
          iocAddress,
          iocAppId,
          iocAppType,
          iocSyncMethod,
          iocAppName,
          iocAppIcon,
          iocComponentSymbol
        }
      } = project
      if (env === 'dev') {
        return Message.error('请选择非开发环境')
      } else if (!this.remark) {
        return Message.error('请输入发布备注')
      } else if (this.remark.trim().length < 3) {
        return Message.error('发布备注至少为3个字符')
      } else if (iocSync) {
        if (!iocAddress) {
          return Message.error('请输入环境地址')
        } else if (!iocAppId) {
          return Message.error('请输入AppId')
        } else if (!iocAppType) {
          return Message.error('请选择类型')
        } else if (!iocSyncMethod) {
          return Message.error('请选择方式')
        } else if (!iocAppName) {
          return Message.error('请输入卡片或小程序名称')
        } else if (iocAppType === 'mp' && iocSyncMethod === 'create' && !iocAppIcon) {
          return Message.error('请输入小程序 icon')
        } else if (iocAppType === 'card' && iocSyncMethod === 'create' && !iocComponentSymbol) {
          return Message.error('请输入卡片 componentSymbol')
        }
      }
      sessionStorage.setItem(this.sessionKey, this.remark)
      this.$emit('confirm', this.remark)
    }
  }
}
</script>
