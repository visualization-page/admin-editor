<template>
  <div class="editor-v2__header-under flex-center-between">
    <div class="flex">
      <p class="f18 c-333 th1 pr40" style="width: 445px">
        <i class="el-icon-edit mr10" />
        <span>编辑 poverty-alleviation-network</span>
        <span class="f12 c-999 ml5">| 广西八桂彩云活动</span>
      </p>
      <div class="editor-v2__header-opts flex-center f12 c-666">
        <el-popover
          v-for="(item, i) in opts"
          :key="i"
          placement="bottom"
          :title="item.title"
          trigger="click"
        >
          <div class="p15 f12">
            <component :is="item.component" />
          </div>
          <div slot="reference" class="editor-v2__header-opt">
            <i :class="`mr5 ${item.icon}`" />
            <span>{{ item.title }}</span>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="flex-center f14 c-666">
      <div class="flex-center mr15 c-main-hover">
        <i class="el-icon-picture-outline mr5" />
        <span>图片走廊</span>
      </div>
      <div class="flex-center c-main-hover">
        <i class="el-icon-search mr5" />
        <span>代码搜索</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import ComponentBasic from '@/components/basic-components/index.vue'

export default defineComponent({
  components: {
    ComponentBasic
  },
  setup () {
    return {
      opts: [
        {
          title: '基础组件',
          icon: 'el-icon-folder',
          component: ComponentBasic.name
        },
        {
          title: '内置组件',
          icon: 'el-icon-folder-opened'
        },
        {
          title: '封装组件',
          icon: 'el-icon-folder-add'
        },
        {
          title: '上传组件',
          icon: 'el-icon-folder-checked'
        },
        {
          title: 'cdn 库',
          icon: 'el-icon-paperclip'
        },
        {
          title: '工具函数库',
          icon: 'el-icon-scissors'
        }
      ]
    }
  }
})
</script>

<style lang="less">
.editor-v2__header {
  &-opts {
    border-right: 1px #cdcdcd solid;
  }
  &-opt {
    padding: 5px 12px;
    border: 1px #cdcdcd solid;
    border-right: none;
    cursor: pointer;
    transition: all .2s;
    &:not(:last-of-type) {
      // border-right: none;
    }
    &:hover {
      background: linear-gradient(90deg, #ff7d00 20%, #ffb400);
      color: #fff;
      border-color: #ff7d00;
    }
  }
  &-under {
    height: 70px;
    padding: 0 20px;
    // border-bottom: 1px #ccc dashed;
  }
}
</style>
