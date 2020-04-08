<template>
  <div class="header-opt height-100 flex-center-between plr20">
    <div class="flex items-center cp" @click="$router.push('/')">
      <span class="f32 c-fff">Butterfly</span>
      <div class="ml10">
        <img height="14px" src="https://img.shields.io/badge/-beta 0.0.1-lightgrey" alt="">
        <p class="c-aaa">快速搭建h5</p>
      </div>
    </div>
    <div class="flex">
      <template v-for="(item, i) in opts || localOpts">
        <div :key="item.label" class="plr15">
          <el-button type="text" @click="item.action()">
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
      <div class="avatar flex-center c-aaa ml20">
        <div class="avatar-img relative c-fff flex-center" overflow-h >
          {{ name.substr(-2) }}
          <div v-if="false" class="absolute t0 l0 b0 r0" :style="{ background: `url(${avatar}) center / cover no-repeat` }" />
        </div>
        <p class="ml10" v-if="false">{{ name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, ref } from '@vue/composition-api'
import { project, initProject, exportProjectLocal } from '@/assets/project'
import { currentPage } from '@/assets/page'
import { Message, MessageBox } from 'element-ui'
import { http } from '@/api'

export default defineComponent({
  props: {
    opts: Array
  },
  setup () {
    const native = Vue.prototype.$native
    const avatar = ref(process.env.VUE_APP_AVATAR + native.uid)
    const localOpts = [
      {
        label: '导入项目',
        icon: 'el-icon-upload f16',
        action: async () => {
          const { value }: any = await MessageBox.prompt('请输入项目英文名称')
          if (!value) {
            return Message.error('名称不能为空')
          }
          const item = await http.get('project/get', { dir: value })
          // @ts-ignore
          await initProject(item.data.project)
          Message.success('导入成功')
        }
      },
      {
        label: '同步组件到cdn',
        icon: 'el-icon-refresh-right f16',
        action: () => {
        }
      },
      {
        label: '下载项目',
        icon: 'el-icon-download f16',
        action: () => {
        }
      },
      {
        label: '发布项目',
        icon: 'el-icon-position f16',
        action: () => {
          // 编译 code
          // copy dist 容器
          // 替换 publicPath
          // 生成 zip 包
        }
      },
      {
        label: '保存项目',
        icon: 'iconfont icon-save',
        action: async () => {
          if (!project.dir) {
            return Message.error('请输入英文名 dir')
          }
          const { value }: any = await MessageBox.prompt('请输入改动描述')
          if (!value || value.length < 5) {
            return Message.error('描述至少5个字')
          }
          const _save = (force?: boolean) => http.post('project/save', {
            dir: project.dir,
            force,
            project: {
              ...project,
              info: {
                userName: Vue.prototype.$native.name,
                remark: value,
                time: Date.now()
              }
            }
          }, {
            codeCallback: {
              6001: async () => {
                await MessageBox.confirm('项目已存在，确认覆盖？')
                await _save(true)
                Message.success('保存成功')
              }
            }
          })
          await _save()
          Message.success('保存成功')
        }
      },
      {
        label: '保存本地',
        icon: 'el-icon-finished f16',
        action: () => {
          exportProjectLocal()
          Message.success('保存成功')
        }
      },
      {
        label: '预览页面',
        icon: 'el-icon-document-remove f16',
        action: () => {
          if (currentPage.value) {
            window.open(process.env.VUE_APP_MOBILE + `#/page/${project.dir}/${currentPage.value.id}`)
          } else {
            Message.info('请选中一个页面')
          }
        }
      },
      {
        label: '预览项目',
        icon: 'el-icon-folder-opened f16',
        action: () => {
          window.open(process.env.VUE_APP_MOBILE + `#/project/${project.dir}`)
        }
      }
    ]
    return {
      localOpts,
      avatar,
      name: native.name
    }
  }
})
</script>

<style lang="less">
.avatar-img {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: #488ff9;
}
</style>
