<template>
  <div class="header-opt bg-333 height-100 flex-center-between pr15">
    <div class="flex items-center cp" @click="$router.push('/')">
      <img width="160px" src="../../assets/img/logo_small.png" alt="">
      <div class="ml10" v-if="false">
        <span class="f24 c-fff" style="line-height: 1;text-shadow: 2px 1px 3px rgba(0,0,0,0.1);color:#fff">Butterfly</span>
      </div>
      <div v-if="false" class="header-opt__line mr15" />
      <p v-if="false" class="c-ccc f10">讯盟 H5 在线开发平台</p>
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
            class="height-100 flex-center header-opt__btn"
          >
            <span slot="trigger" class="flex-center flex-column">
              <div style="height:19px">
                <i :class="item.icon" />
              </div>
              {{ item.label }}
            </span>
          </el-upload>
          <el-button
            v-else
            type="text"
            class="header-opt__btn"
            @click="item.action()"
          >
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

    <pub-modal
      v-if="showPubModal"
      @confirm="doPub"
      @close="showPubModal = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, ref } from '@vue/composition-api'
import { project, saveProject } from '@/assets/project'
// import { currentPage } from '@/assets/page'
import { Message } from 'element-ui'
import { http } from '@/api'
import Avatar from '@/components/avatar/index.vue'
import PubModal from '@/views/editor/components/before-publish-modal.vue'

export default defineComponent({
  props: {
    opts: Array
  },
  components: {
    Avatar,
    PubModal
  },
  setup (props, ctx) {
    const showPubModal = ref(false)
    const doPub = async (remark: string) => {
      showPubModal.value = false
      // console.log(remark, project.config.selectProEnv)
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
        },
        { successMessage: '项目发布成功' }
      )
    }
    const localOpts = [
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
          // const { value }: any = await MessageBox.prompt('请输入发布备注', {
          //   inputPlaceholder: '至少3个字',
          //   inputValue: sessionStorage.getItem('publish-remark') || ''
          // })
          // if (!value || value.length < 3) {
          //   return Message.error('至少3个字')
          // }
          // sessionStorage.setItem('publish-remark', value)
          showPubModal.value = true
        }
      },
      {
        label: '保存项目',
        icon: 'bficon icon-save',
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
      showPubModal,
      doPub,
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

<style lang="less">
.header-opt {
  &__line {
    width: 2px;
    height: 16px;
    // background: #999;
    /*margin: 0 10px;*/
  }
  &__btn {
    color: #999;
    &:hover {
      color: #ff7d00;
    }
  }
}
</style>
