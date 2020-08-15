<template>
  <div class="editor-v2__header bg-333 flex-center-between">
    <div class="flex-center-align">
      <img class="cp" src="@/assets/img/logo_home.png" alt="" width="160px" @click="$router.push('/')">
      <template v-for="(item, i) in opts">
        <div :key="`line${i}`" class="editor-v2__line" />
        <el-popover
          :key="`pop${i}`"
          placement="bottom"
          :title="item.title"
          trigger="click"
        >
          <div class="p10 oa" style="max-height: 65vh">
            <project-set :schema="item.schema" />
          </div>
          <div slot="reference" class="editor-v2__header-item">
            <span>{{ item.title }}</span>
          </div>
        </el-popover>
      </template>
    </div>
    <div class="flex-center-align pr20">
      <div class="p10 cp c-main mr10" @click="handleDown">下载</div>
      <div class="p10 cp c-main mr10" @click="handlePub()">发布</div>
      <div class="bf-btn" @click="handleSave">
        <div class="bf-btn__container">
          保存
        </div>
      </div>
    </div>

    <pub-modal
      v-if="showPubModal"
      @confirm="doPub"
      @close="showPubModal = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import ProjectSet from '@/components/v2/project-set/index.vue'
import * as config from '@/components/v2/project-set/config'
import { project, saveProject } from '@/assets/project'
import { http } from '@/api'
import Vue from 'vue'
import PubModal from '@/views/editor/components/before-publish-modal.vue'

export default defineComponent({
  components: {
    ProjectSet,
    PubModal
  },

  data () {
    return {
      showPubModal: false,
      config,
      opts: [
        {
          schema: config.http,
          title: 'http 配置'
        },
        {
          schema: config.env,
          title: '环境配置'
        },
        {
          schema: config.css,
          title: '全局 css'
        },
        {
          schema: config.utils,
          title: '全局 utils'
        },
        {
          schema: config.constant,
          title: '全局 constant'
        },
        {
          schema: config.scripts,
          title: '初始化脚本'
        }
      ]
    }
  },

  methods: {
    async handleSave () {
      const params = this.$route.params
      await saveProject(!!params.dir)
      this.$notify({
        title: '成功',
        type: 'success',
        message: '保存项目成功',
        position: 'top-left',
        duration: 2000
      })
    },

    handlePub () {
      // const sync = project.syncFile
      // let msg = ''
      // if (sync && project.config.appType === undefined) {
      //   msg = '请选择项目所属省份'
      // } else if (sync && !project.config.path) {
      //   msg = '请输入项目部署目标机器目录'
      // }
      // if (msg) {
      //   this.$notify({
      //     title: '错误',
      //     type: 'error',
      //     message: msg,
      //     position: 'top-left',
      //     duration: 2000
      //   })
      // }
      // @ts-ignore
      this.showPubModal = true
    },

    handleDown () {
      // 先拉接口校验是否存在 zip
      location.href = process.env.VUE_APP_FILE_SERVER + `/butterfly/project/download/${project.dir}`
    },

    async doPub (remark: string) {
      // @ts-ignore
      this.showPubModal = false
      await saveProject(true, remark, false)
      await http.post(
        'project/release',
        {
          dir: project.dir,
          info: {
            userName: Vue.prototype.$native.name,
            remark,
            time: Date.now()
          }
        }
      )
      this.$notify({
        title: '成功',
        type: 'success',
        message: '项目发布成功',
        position: 'top-left',
        duration: 2000
      })
    }
  }
})
</script>

<style lang="less">
.editor-v2 {
  &__header {
    font-size: 14px;
    &-item {
      color: #999;
      padding: 15px 30px;
      cursor: pointer;
      &:hover {
        color: #ff7d00;
      }
    }
  }
}
</style>
