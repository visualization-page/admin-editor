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
          <div class="p10">
            <project-set :schema="item.schema" />
          </div>
          <div slot="reference" class="editor-v2__header-item">
            <span>{{ item.title }}</span>
          </div>
        </el-popover>
      </template>
    </div>
    <div class="flex-center-align pr20">
      <div class="p10 cp c-main mr10">发布</div>
      <div class="bf-btn">
        <div class="bf-btn__container">
          保存
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import ProjectSet from '@/components/v2/project-set/index.vue'
import * as config from '@/components/v2/project-set/config'

export default defineComponent({
  components: {
    ProjectSet
  },

  data () {
    return {
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
