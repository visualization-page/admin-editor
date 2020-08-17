<template>
  <div class="width-50 height-100">
    <p class="f14">
      <i class="el-icon-setting mr10" />
      <span>页面设置</span>
    </p>
    <div class="editor-v2__page-set bg-fff">
      <tab :value="currentTab" @input="onChange" :tabs="['属性', '节点树']" />
      <div v-if="!currentPage" class="tc pt50 c-ccc">
        <i class="el-icon-data-board f40" />
        <p class="mt20">请选中一个页面呢～</p>
      </div>
      <div class="plr15 pt15 pb50 oa no-scroll" style="height: calc(100% - 40px)" v-else>
        <transition name="el-fade-in">
          <page-setting v-show="currentTab === 0" />
        </transition>
        <transition name="el-fade-in">
          <node-tree v-show="currentTab === 1" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import Tab from '@/components/v2/tab/index.vue'
import PageSetting from '@/components/page-set/index.vue'
import NodeTree from '@/components/node-tree/index.vue'
import { tabName, tabCurrent, setTabName } from '@/assets/tab'

export default {
  components: {
    Tab,
    PageSetting,
    NodeTree
  },

  setup () {
    const index = [tabName.pageSetProperty, tabName.pageSetTree]
    return {
      currentPage,
      currentTab: computed(() => index.findIndex(x => x === tabCurrent.tab5)),
      onChange (i) {
        setTabName(['', '', '', '', index[i]])
      }
    }
  }
}
</script>
