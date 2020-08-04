<template>
  <div class="component-umd">
    <div>
      <el-button icon="el-icon-plus" type="text" @click="handleAddUmd()">添加cdn库</el-button>
    </div>
    <van-grid
      class="van-hairline--left"
      :column-num="3"
      clickable
    >
      <van-grid-item
        v-for="(item, i) in list"
        :key="i"
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
      title="添加cdn库"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="dialogForm" :rules="dialogFormRules">
        <el-form-item label="库的类型" prop="type">
          <el-radio-group v-model="dialogForm.type">
            <el-radio label="js">js库</el-radio>
            <el-radio label="css">css库</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="库的名称" prop="label">
          <el-input v-model="dialogForm.label" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="url地址" prop="url">
          <el-input v-model="dialogForm.url" placeholder="请输入" />
        </el-form-item>
        <template v-if="dialogForm.type === 'js'">
          <el-form-item label="全局变量名" prop="umdName">
            <el-input v-model="dialogForm.umdName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="发布时是否将url下载到文件">
            <el-checkbox v-model="dialogForm.isReleaseDownload" />
          </el-form-item>
        </template>
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
import { NodeUmd } from '@/assets/node'
import { loadItemUmd } from '@/components/mobile-render/render/utils'
import { MessageBox, Message, Loading } from 'element-ui'
import { http } from '@/api'
import { tabCurrent, tabName } from '@/assets/tab'
import { project } from '@/assets/project'

const empty = {
  label: '',
  umdName: '',
  url: '',
  isReleaseDownload: false,
  type: 'js'
}

export default defineComponent({
  setup (props, ctx) {
    const showDialog = ref(false)
    const list = ref([])
    const dialogForm = ref({})
    const selected = computed(() => project.componentUmd.map(x => x.label))
    const handleEdit = (item: NodeUmd) => {
      handleAddUmd(item)
    }
    const handleAddUmd = (item?: NodeUmd) => {
      if (item) {
        // @ts-ignore
        dialogForm.value = { type: 'js', ...item }
      } else {
        dialogForm.value = { ...empty }
      }
      showDialog.value = true
    }
    const handleDelete = async (item: NodeUmd, i: number) => {
      await MessageBox.confirm('确定要删除吗？')
      await http.post('component/umdSave', { ...item, delete: true }, { successMessage: '删除成功' })
      list.value.splice(i, 1)
    }
    const confirm = () => {
      // @ts-ignore
      ctx.refs.form.validate((valid: boolean) => {
        if (valid) {
          http.post('component/umdSave', {
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
      http.get('component/list', { type: 'umd' }).then(res => {
        list.value = res.data
      })
    }
    const stop = watch(() => tabCurrent.tab2, cur => {
      if (cur === tabName.umdComponent) {
        getList()
        stop()
      }
    })
    const handleAdd = async (item: NodeUmd) => {
      const loading = Loading.service({ text: '加载中...' })
      const i = selected.value.findIndex(x => x === item.label)
      if (!window.defineBak && window.define) {
        window.defineBak = window.define
      }
      window.define = null
      await loadItemUmd(item, i === -1).catch(err => {
        Message.error(err)
        loading.close()
        return Promise.reject(err)
      })
      loading.close()
      window.define = window.defineBak
      if (i > -1) {
        project.componentUmd.splice(i, 1)
        Message.success('取消成功')
      } else {
        project.componentUmd.push(item)
        Message.success('添加成功')
      }
    }
    return {
      showDialog,
      dialogForm,
      dialogFormRules: {
        label: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        umdName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
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
