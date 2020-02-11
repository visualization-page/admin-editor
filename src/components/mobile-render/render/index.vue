<template>
  <render-item
    v-if="currentPage"
    :nodes="currentPage.nodes"
  />
</template>

<script lang="ts">
import Vue from 'vue'
// import { MessageBox } from 'element-ui'
import { createComponent, watch, reactive, ref } from '@vue/composition-api'
import { currentPage } from '@/assets/page'
import { NodeItem } from '@/assets/node'
import { project } from '@/assets/project'
import { deepClone, parseCodeValid, getParentRef } from '@/assets/util'
import RenderItem from './render-item.vue'

const updateField = (target: any, obj: any) => {
  if (!obj) {
    return
  }
  Object.keys(obj).forEach(k => {
    if (target[k] === undefined) {
      Vue.set(target, k, obj[k])
    } else {
      target[k] = obj[k]
    }
  })
}

window.$$global = reactive({
  constant: {},
  state: {}
})
window.getConstant = (key) => window.$$global.constant[key]

const findNode = (nodes: NodeItem[], id: string): NodeItem | undefined => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return nodes[i]
    }
    if (nodes[i].children && nodes[i].children.length) {
      const it = findNode(nodes[i].children, id)
      if (it) {
        return it
      }
    }
  }
}

function initSystem (nodes: NodeItem[]) {
  window.$$system = {
    getNodeProperty (id, property) {
      const it = findNode(nodes, id)
      if (it) {
        const { pref, field } = getParentRef(property, it)
        return pref && pref[field]
      }
    },
    setNodeProperty (id, property, val) {
      const it = findNode(nodes, id)
      if (it) {
        const { pref, field } = getParentRef(property, it)
        pref && (pref[field] = val)
      }
    }
  }
}

export default createComponent({
  components: {
    RenderItem
  },
  setup () {
    const renderNodes = ref([])

    // 挂载页面 state 和项目常量
    watch(() => project.constant, cons => {
      const { ok, value } = parseCodeValid(cons)
      ok && updateField(window.$$global.constant, value)
    }, { deep: true })
    watch(() => currentPage.value && currentPage.value.state, state => {
      const { ok, value } = parseCodeValid(state)
      ok && updateField(window.$$global.state, value)
    }, { deep: true })
    watch(() => currentPage.value && currentPage.value.nodes, nodes => {
      if (nodes) {
        // renderNodes.value = deepClone(nodes)
        // renderNodes.value = nodes
        initSystem(nodes)
      } else {
        // renderNodes.value = []
      }
    }, { deep: true })
    return {
      currentPage,
      renderNodes,
      deepClone
    }
  }
})
</script>
