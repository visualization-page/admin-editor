<template>
  <div class="component-library">
    <p class="c-666 mb10">1. 勾选需要使用的组件</p>
    <el-tree
      :data="data"
      show-checkbox
      :check-strictly="true"
      check-on-click-node
      :default-checked-keys="defaultCheck"
      :props="{ disabled: handleDisabled }"
      node-key="id"
      @check-change="handleCheck"
    />
    <p class="c-666 mtb10">2. 点击已勾选的组件添加到页面中</p>
    <van-grid
      class="van-hairline--left"
      :column-num="4"
      clickable
    >
      <template v-for="item in Object.keys(checkData)">
        <van-grid-item
          v-for="k in checkData[item]"
          :key="item + k"
          class="cp"
          @click="handleAdd(item, k)"
        >
          <div v-if="false" class="w40 h40 bg-f2"></div>
          <span class="c-666">{{ k }}</span>
        </van-grid-item>
      </template>
    </van-grid>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, ref, computed, watch } from '@vue/composition-api'
import { getTreeData } from './config'
import { TreeNode } from 'element-ui/types/tree'
import { updateProject, project } from '@/assets/project'
import { addBeforeValidate, addNode } from '@/assets/node'
import { setTabName, tabName, hideComponent } from '@/assets/tab'

export default defineComponent({
  setup () {
    const checkData = ref<{ [k: string]: Array<string> }>({})
    watch(() => project.componentLibrary, val => {
      checkData.value = { ...val }
    })
    const defaultCheck = computed(() => {
      const res: string[] = []
      Object.keys(checkData.value).forEach(x => {
        checkData.value[x].forEach(y => {
          res.push(`${x}-${y}`)
        })
      })
      return res
    })
    const handleCheck = (data: { label: string, library: string }, check: boolean) => {
      if (!checkData.value[data.library]) {
        Vue.set(checkData.value, data.library, [])
      }
      if (check) {
        checkData.value[data.library].push(data.label)
      } else {
        const i = checkData.value[data.library].findIndex(x => x === data.label)
        checkData.value[data.library].splice(i, 1)
      }
      updateProject({ componentLibrary: checkData.value })
    }
    const handleDisabled = (
      data: { label: string },
      node: TreeNode<string, { label: string }>
    ) => {
      return node.level === 1
    }
    const handleAdd = (library: string, name: string) => {
      if (addBeforeValidate()) {
        addNode({ library, name, nodeType: 1 << 2, type: 'div' })
        setTabName([tabName.nodeTree, '', tabName.nodeProperty])
        hideComponent(true)
      }
    }

    return {
      defaultCheck,
      checkData,
      data: getTreeData(),
      handleCheck,
      handleDisabled,
      handleAdd
    }
  }
})
</script>
