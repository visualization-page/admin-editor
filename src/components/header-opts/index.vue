<template>
  <div class="header-opt height-100 flex-center-between plr20">
    <div class="flex items-center cp" @click="$router.push('/')">
      <img height="40px" src="../../assets/img/logo.png" alt="">
      <div class="ml10">
        <span class="f28 c-fff" style="line-height: 1;text-shadow: 2px 1px 3px rgba(0,0,0,0.1);color:#fff">Butterfly</span>
        <p class="c-ccc f10">产品运营也能用的 H5 在线开发平台</p>
      </div>
    </div>
    <div class="flex">
      <template v-for="(item, i) in opts || localOpts">
        <div :key="item.label" class="plr15">
          <el-upload
            v-if="item.isUpload"
            :action="item.action"
            :multiple="false"
            :show-file-list="false"
            :before-upload="item.handleBeforeUpload"
            :on-success="res => handleResponse(res, item)"
            :on-error="handleResponse"
            class="height-100 flex-center"
            style="color: #409eff"
          >
            <span slot="trigger" class="flex-center flex-column">
              <div style="height:20px">
                <i :class="item.icon" />
              </div>
              {{ item.label }}
            </span>
          </el-upload>
          <el-button v-else type="text" @click="item.action()">
            <span class="flex-center flex-column">
              <div style="height:20px">
                <i :class="item.icon" />
              </div>
              {{ item.label }}
            </span>
          </el-button>
        </div>
        <div :key="i" class="h30 bg-666 mt10" style="width:2px" />
      </template>
      <slot>
        <avatar />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'
import { project, saveProject } from '@/assets/project'
// import { currentPage } from '@/assets/page'
import { Message, MessageBox } from 'element-ui'
import { http } from '@/api'
import Avatar from '@/components/avatar/index.vue'

export default defineComponent({
  props: {
    opts: Array
  },
  components: {
    Avatar
  },
  setup (props, ctx) {
    // const handleSave = (force?: boolean, remark?: string, notify?: boolean) => http.post('project/save', {
    //   dir: project.dir,
    //   force,
    //   project: {
    //     ...project,
    //     info: {
    //       ...project.info,
    //       remark,
    //       userName: Vue.prototype.$native.name,
    //       time: Date.now()
    //     }
    //   }
    // }, {
    //   codeCallback: {
    //     6001: async () => {
    //       // await MessageBox.confirm('项目已存在，不允许覆盖！')
    //       // await handleSave(true)
    //       Message.error('项目已存在')
    //     }
    //   },
    //   notify: notify !== false
    // })
    const localOpts = [
      // {
      //   label: '生成源码',
      //   icon: 'el-icon-magic-stick f16',
      //   action: async () => {
      //     const res = await http.post('project/gen', { dir: project.dir })
      //     location.href = res.data.url
      //   }
      // },
      {
        label: '下载项目',
        icon: 'el-icon-download f16',
        action: () => {
          if (!project.dir) {
            return Message.error('项目名称必填！')
          }
          location.href = process.env.VUE_APP_FILE_SERVER + `/butterfly/project/download/${project.dir}`
        }
      },
      // {
      //   label: '反馈建议',
      //   icon: 'el-icon-chat-line-round f16',
      //   action: () => {
      //     ctx.root.$router.push('/suggest')
      //   }
      // },
      {
        label: '发布项目',
        icon: 'el-icon-position f16',
        action: async () => {
          const sync = project.syncFile
          if (!project.dir) {
            return Message.error('项目名称必填！')
          } else if (sync && project.config.appType === undefined) {
            return Message.error('请选择项目所属省份')
          } else if (sync && !project.config.path) {
            return Message.error('请输入项目部署目标机器目录')
          }
          // await MessageBox.confirm('发布不会保存项目，请确认已保存?')
          const { value }: any = await MessageBox.prompt('请输入发布备注', {
            inputPlaceholder: '至少3个字',
            inputValue: sessionStorage.getItem('publish-remark') || ''
          })
          if (!value || value.length < 3) {
            return Message.error('至少3个字')
          }
          sessionStorage.setItem('publish-remark', value)
          await saveProject(true, value, false)
          await http.post(
            'project/release',
            {
              dir: project.dir,
              info: {
                userName: Vue.prototype.$native.name,
                remark: value,
                time: Date.now()
              }
            },
            { successMessage: '项目发布成功' }
          )
        }
      },
      // {
      //   label: '清除本地',
      //   icon: 'el-icon-delete f16',
      //   action: () => {
      //     localStorage.removeItem('local')
      //     resetProject()
      //     Message.success('清除成功')
      //   }
      // },
      {
        label: '保存项目',
        icon: 'iconfont icon-save',
        action: async () => {
          if (!project.dir) {
            return Message.error('项目名称必填！')
          }
          const params = ctx.root.$route.params
          // const _save =
          await saveProject(!!params.dir)
          Message.success('保存项目成功')
          if (!params.dir) {
            ctx.root.$router.replace(`/editor/${project.dir}`)
          }
        }
      },
      // {
      //   label: '保存本地',
      //   icon: 'el-icon-finished f16',
      //   action: () => {
      //     exportProjectLocal()
      //     Message.success('保存成功')
      //   }
      // },
      // {
      //   label: '预览页面',
      //   icon: 'el-icon-document-remove f16',
      //   action: () => {
      //     if (currentPage.value) {
      //       window.open(process.env.VUE_APP_MOBILE + `#/page/${project.dir}/${currentPage.value.id}`)
      //     } else {
      //       Message.info('请选中一个页面')
      //     }
      //   }
      // },
      {
        label: '查看项目',
        icon: 'el-icon-folder-opened f16',
        action: () => {
          window.open(project.url || (process.env.VUE_APP_MOBILE + `#/project/${project.dir}`))
        }
      }
    ]
    return {
      localOpts,
      handleResponse (res: any, item: any) {
        if (res.success) {
          Message.success('上传成功')
          item.successCallback && item.successCallback()
        } else {
          Message.error(res.msg)
        }
      }
    }
  }
})
</script>
