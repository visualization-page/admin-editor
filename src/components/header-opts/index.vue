<template>
  <div class="header-opt height-100 flex-center-between plr20">
    <div class="flex items-center">
      <span class="f32 c-fff">Butterfly</span>
      <div class="ml10">
        <img height="14px" src="https://img.shields.io/badge/-beta 0.0.1-lightgrey" alt="">
        <p class="c-aaa">让写业务变得简单</p>
      </div>
    </div>
    <div class="flex">
      <template v-for="(item, i) in opts">
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
        <div :key="i" v-if="i < opts.length - 1" class="h30 bg-666 mt10" style="width:2px" />
      </template>
      <div class="avatar flex-center c-aaa ml20">
        <div class="avatar-img mr10 relative c-fff flex-center" overflow-h >
          {{ name }}
          <div class="absolute t0 l0 b0 r0" :style="{ background: `url(${avatar}) center / cover no-repeat` }" />
        </div>
        <p>{{ name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, ref } from '@vue/composition-api'
import { exportProjectLocal } from '@/assets/project'
import { Message } from 'element-ui'

export default defineComponent({
  setup () {
    const native = Vue.prototype.$native
    const avatar = ref(process.env.VUE_APP_AVATAR + native.uid)
    const handleSave = () => {
      exportProjectLocal()
      Message.success('保存成功')
    }
    const opts = [
      {
        label: '下载',
        icon: 'el-icon-download f16',
        action: () => {
        }
      },
      {
        label: '保存',
        icon: 'iconfont icon-save',
        action: () => {
        }
      },
      {
        label: '构建',
        icon: 'el-icon-position f16',
        action: () => {
        }
      },
      {
        label: '同步到Git',
        icon: 'el-icon-sort f16',
        action: () => {
        }
      },
      {
        label: '预览',
        icon: 'el-icon-view f16',
        action: () => {
          window.open(process.env.VUE_APP_MOBILE)
        }
      }
    ]

    return {
      opts,
      avatar,
      name: native.name
    }
  }
})
</script>

<style lang="less">
.avatar-img {
  width: 35px;
  height: 35px;
  border-radius: 4px;
  background-color: #488ff9;
}
</style>
