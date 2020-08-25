<template>
  <div class="editor-v2__header-under flex-center-between">
    <div class="flex">
      <div class="flex items-center f18 c-333 th1" style="width: 445px;padding-right: 70px">
        <div class="editor-v2__header-opts flex-center f12 c-666 mr10" @click="$router.push('/project/list')">
          <div class="editor-v2__header-opt">
            <i class="mr5 el-icon-back" />
            <span>返回</span>
          </div>
        </div>
        <i class="el-icon-edit mr10" />
        <span>编辑 {{ info.dir }}</span>
        <span v-if="false" class="f12 c-999 ml5">| {{ info.desc || '暂无项目描述' }}</span>
      </div>
      <div class="editor-v2__header-opts flex-center f12 c-666">
        <el-popover
          v-for="(item, i) in opts"
          :key="i"
          placement="bottom"
          :title="item.title"
          trigger="click"
          @show="handleComponentShow(item, true)"
          @hide="handleComponentShow(item, false)"
        >
          <div class="p15 f12 oa" style="max-height: 60vh;width:450px">
            <component
              :is="item.component"
              v-bind="{ show: localShowState[item.component] }"
              v-on="{ hide: handleHidePopover }"
            />
          </div>
          <div slot="reference" class="editor-v2__header-opt">
            <i :class="`mr5 ${item.icon}`" />
            <span>{{ item.title }}</span>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="flex-center f12 c-666">
      <div class="flex-center mr15 c-main-hover cp" @click="handleOpen">
        <i class="el-icon-monitor mr5" />
        <span>查看项目</span>
      </div>
      <div class="flex-center mr15 c-main-hover cp" @click="handleShowImage">
        <i class="el-icon-picture-outline mr5" />
        <span>图片走廊</span>
      </div>
      <div class="flex-center c-main-hover">
        <i class="el-icon-search mr5" />
        <span class="cp" data-target="1" @click="handleShowSearchCode">代码搜索</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import ComponentBasic from '@/components/basic-components/index.vue'
import ComponentLibrary from '@/components/component-library/index.vue'
import ComponentCompose from '@/components/component-compose/index.vue'
import ComponentUpload from '@/components/component-upload/index.vue'
import ComponentUmd from '@/components/component-umd/index.vue'
import GlobalUtils from '@/components/global-utils/index.vue'
import { project } from '@/assets/project'
import { showImageResource, showSearchCode } from '@/assets/render'

export default defineComponent({
  components: {
    ComponentBasic,
    ComponentLibrary,
    ComponentCompose,
    ComponentUpload,
    ComponentUmd,
    GlobalUtils
  },
  computed: {
    info () {
      return {
        dir: project.dir,
        desc: project.desc
      }
    }
  },
  setup () {
    const localShowState = ref<{ [k: string]: boolean }>({
      [ComponentCompose.name]: false,
      [ComponentUpload.name]: false,
      [ComponentUmd.name]: false,
      [GlobalUtils.name]: false
    })
    return {
      opts: [
        {
          title: '基础组件',
          icon: 'el-icon-folder',
          component: ComponentBasic.name
        },
        {
          title: '内置组件',
          icon: 'el-icon-folder-opened',
          component: ComponentLibrary.name
        },
        {
          title: '封装组件',
          icon: 'el-icon-folder-add',
          component: ComponentCompose.name
        },
        {
          title: '上传组件',
          icon: 'el-icon-folder-checked',
          component: ComponentUpload.name
        },
        {
          title: 'cdn 库',
          icon: 'el-icon-paperclip',
          component: ComponentUmd.name
        },
        {
          title: '工具函数库',
          icon: 'el-icon-scissors',
          component: GlobalUtils.name
        }
      ],
      showImageResource,
      localShowState,
      handleComponentShow (item: { component: string }, show: boolean) {
        localShowState.value[item.component] = show
      }
    }
  },
  methods: {
    handleShowImage () {
      showImageResource.value = true
    },
    handleShowSearchCode () {
      showSearchCode.value = true
    },
    handleHidePopover () {
      document.body.click()
    },
    handleOpen () {
      if (project.url) {
        window.open(project.url)
      } else {
        window.open(process.env.VUE_APP_MOBILE + `#/project/${project.dir}`)
      }
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
