<template>
  <div class="page-list flex flex-wrap">
    <div
      v-for="(item, i) in pages"
      :key="item.id"
      class="page-list__item flex-center c-999 relative"
      :class="{
        active: selected && selected.id === item.id
      }"
      @click="setSelect(item)"
    >
      <span>{{ item.title }}</span>
      <div class="absolute r0 t0 flex dn">
        <i class="el-icon-edit" @click.stop="handleEdit(item, i)" />
        <i class="el-icon-delete" @click.stop="handleDel(item, i)" />
      </div>
    </div>
    <div class="page-list__item flex-center c-999" @click="addPages">
      <i class="el-icon-plus f32" />
    </div>
  </div>
</template>

<script>
import { createComponent, reactive, ref, toRefs } from '@vue/composition-api'
// import Vue from 'vue'
import { Dialog, Button } from 'element-ui'

export default createComponent({
  components: {
    ElDialog: Dialog,
    ElButton: Button
  },

  setup () {
    const modal = reactive({
      showEditPage: true
    })
    const pages = reactive([])
    const selected = ref(null)
    const addPages = () => {
      const item = reactive({
        id: Date.now(),
        title: '',
        url: '',
        nodes: []
      })
      pages.push(item)
      setSelect(item)
    }
    const setSelect = (item) => {
      selected.value = item
    }
    const handleEdit = (item, i) => {
    }
    const handleDel = (item, i) => {
    }

    return {
      ...toRefs(modal),
      pages,
      selected,
      setSelect,
      addPages,
      handleEdit,
      handleDel
    }
  }
})
</script>

<style lang="less">
.page-list {
  // justify-content: space-between;
  &__item {
    width: 80px;
    height: 100px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .3);
    margin-right: 15px;
    margin-bottom: 15px;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
    &.active {
      box-shadow: 0 0 3px rgba(#409eff, .7);
      color: #409eff;
    }
  }
}
</style>
