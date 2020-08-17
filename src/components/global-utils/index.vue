<template>
  <div class="component-umd">
    <div>
      <el-button icon="el-icon-plus" type="text" @click="handleAddUmd()">添加工具函数库</el-button>
    </div>
    <van-grid
      class="van-hairline--left"
      :column-num="3"
      clickable
    >
      <van-grid-item
        v-for="(item, i) in list"
        :key="item"
        class="cp relative"
        :class="{
          active: selected.includes(item.label)
        }"
        @click="handleAdd(item)"
      >
        <span class="c-666">{{ item.label }}</span>
        <p class="c-999">by {{ item.userName }}</p>
        <div v-if="item.userName === $native.name" class="absolute r10 t0">
          <i class="el-icon-delete c-main mr10" @click.stop="handleDelete(item, i)" />
          <i class="el-icon-edit c-blue" @click.stop="handleEdit(item)" />
        </div>
      </van-grid-item>
    </van-grid>

    <el-dialog
      :visible.sync="showDialog"
      title="添加函数"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="dialogForm" :rules="dialogFormRules">
        <el-form-item label="函数标题" prop="label">
          <el-input v-model="dialogForm.label" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="函数名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="函数体" prop="code">
          <monaco-editor
            v-model="dialogForm.code"
            :style="{ height: 250 + 'px' }"
            :amdRequire="amdRequire"
            :language="'javascript'"
            theme="vs-dark"
          />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, ref, watch, computed } from '@vue/composition-api'
import { MessageBox, Message } from 'element-ui'
import { http } from '@/api'
import { tabCurrent, tabName } from '@/assets/tab'
import { project } from '@/assets/project'
import { parseCodeValid } from '@/assets/util'

const empty = {
  label: '',
  name: '',
  code: 'function yourFunctionName () {}'
}
type NodeUtils = typeof empty

export default defineComponent({
  name: 'global-utils',
  props: {
    show: Boolean
  },
  setup (props, ctx) {
    const showDialog = ref(false)
    const list = ref([])
    const dialogForm = ref({})
    const selected = computed(() => project.componentUmd.map(x => x.label))
    const handleEdit = (item: NodeUtils) => {
      handleAddUmd(item)
    }
    const handleAddUmd = (item?: NodeUtils) => {
      if (item) {
        dialogForm.value = { ...item }
      } else {
        dialogForm.value = { ...empty }
      }
      showDialog.value = true
    }
    const handleDelete = async (item: NodeUtils, i: number) => {
      await MessageBox.confirm('确定要删除吗？')
      await http.post('component/utilsSave', { ...item, delete: true }, { successMessage: '删除成功' })
      list.value.splice(i, 1)
    }
    const confirm = () => {
      // @ts-ignore
      ctx.refs.form.validate((valid: boolean) => {
        if (valid) {
          http.post('component/utilsSave', {
            ...dialogForm.value,
            userName: Vue.prototype.$native.name
          }, { successMessage: '操作成功' }).then(() => {
            getList()
            showDialog.value = false
          })
        }
      })
    }
    const getList = () => {
      http.get('component/list', { type: 'utils' }).then(res => {
        list.value = res.data
      })
    }
    watch(() => props.show, val => {
      if (val) {
        getList()
      }
    })
    // const stop = watch(() => tabCurrent.tab1, cur => {
    //   if (cur === tabName.globalUtils) {
    //     getList()
    //     stop()
    //   }
    // })
    const handleAdd = async (item: NodeUtils) => {
      const { ok, value, msg } = parseCodeValid(project.utils)
      if (ok) {
        if (value![item.name]) {
          Message.info('该函数在 全局 utils 中已存在')
        } else {
          project.utils = project.utils.replace('return {', `return {\n    ${item.name}: ${item.code},`)
          Message.success(`添加成功，调用方式：$$global.utils.${item.name}`)
        }
        ctx.emit('hide')
      } else {
        Message.error(msg)
      }
    }
    return {
      showDialog,
      dialogForm,
      amdRequire: window.require,
      dialogFormRules: {
        label: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      list,
      selected,
      handleEdit,
      handleAddUmd,
      handleDelete,
      confirm,
      handleAdd
    }
  }
})
</script>

<style lang="less">
.component-umd {
  .active .van-grid-item__content {
    background-color: #f2f2f2;
  }
}
</style>
