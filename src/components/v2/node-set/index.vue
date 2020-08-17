<template>
  <div class="width-50 height-100">
    <p class="f14">
      <i class="el-icon-setting mr10" />
      <span>节点设置</span>
    </p>
    <div class="editor-v2__page-set bg-fff">
      <tab :tabs="['属性', '样式']" :value="currentTab" @input="onChange" />
      <div v-if="!currentNode" class="tc pt50 c-ccc">
        <i class="el-icon-data-board f40" />
        <p class="mt20">请选中一个节点呢～</p>
      </div>
      <div class="plr15 pt15 pb50 oa no-scroll" style="height: calc(100% - 40px)" v-else>
        <transition name="el-fade-in">
          <node-property v-show="currentTab === 0" />
        </transition>
        <transition name="el-fade-in">
          <node-style v-show="currentTab === 1" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Tab from '@/components/v2/tab/index.vue'
import { computed } from '@vue/composition-api'
import { currentNode } from '@/assets/node'
import NodeProperty from '@/components/node-property/index.vue'
import NodeStyle from '@/components/node-style/index.vue'
import { tabName, tabCurrent, setTabName } from '@/assets/tab'

export default {
  components: {
    Tab,
    NodeProperty,
    NodeStyle
  },

  setup () {
    const index = [tabName.nodeSetProperty, tabName.nodeSetStyle]
    return {
      currentNode,
      currentTab: computed(() => index.findIndex(x => x === tabCurrent.tab6)),
      onChange (i) {
        setTabName(['', '', '', '', '', index[i]])
      }
    }
  }
}
</script>
