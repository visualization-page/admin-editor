<template>
  <div class="events-manage f12">
    <el-button type="text" @click="handleAdd">添加事件</el-button>
    <ul>
      <li
        v-for="(item, i) in eventList"
        :key="i"
        class="flex-center-between">
        <span class="c-666">{{ item.desc }}</span>
        <span>
          <i class="el-icon-edit c-blue cp" @click="handleEdit(item, i)" />
          <i class="el-icon-delete c-main cp" @click="handleDel(i)"/>
        </span>
      </li>
    </ul>

    <el-dialog
      :visible.sync="showModal"
      title="事件管理"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="60px"
        ref="form"
      >
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型" prop="eventType">
          <el-select v-model="form.eventType">
            <el-option
              v-for="item in eventType"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标节点" prop="targetNodeIdPath">
          <cascader
            v-if="currentPage"
            v-model="form.targetNodeIdPath"
            :options="currentPage.nodes"
            :props="{
              label: 'title',
              value: 'id',
              checkStrictly: true
            }"
            clearable
          />
        </el-form-item>
        <el-form-item label="动作" prop="fx">
          <el-button
            v-for="(item, i) in fxList"
            :key="i"
            :type="form.fx === item.name ? 'primary' : 'default'"
            @click="form.fx = item.name"
          >
            {{ item.name }}
          </el-button>
        </el-form-item>
        <el-form-item label="动作代码" prop="fxCode">
          <vue-monaco
            v-model="form.fxCode"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createComponent, ref, reactive, watch } from '@vue/composition-api'
import { eventType, fxList } from '@/assets/event'
import { currentPage } from '@/assets/page'
import { currentNode } from '@/assets/node'
import { findTreePath, getParentRef, deepClone } from '@/assets/util'
import VueMonaco from '@/components/vue-monaco/index.vue'
import { Cascader, ButtonGroup, MessageBox } from 'element-ui'

export default createComponent({
  props: {
    schema: Object,
    schemaData: Object
  },

  components: {
    Cascader,
    ButtonGroup,
    VueMonaco
  },

  setup (props, ctx) {
    type FormEvent = {
      eventType: string
      targetNodeIdPath?: string[]
      fx: string
      fxCode: string
      desc: string
      [k: string]: any
    }
    const eventList = ref<FormEvent[]>([])
    const showModal = ref(false)
    const editItemIndex = ref(-1)
    const defaultForm: FormEvent = {
      eventType: 'click',
      targetNodeIdPath: [],
      fx: '',
      fxCode: 'const noop = () => {}',
      desc: ''
    }
    const form = reactive<FormEvent>(deepClone(defaultForm))

    watch(() => props.schemaData, val => {
      if (val) {
        const { pref, field } = getParentRef(props.schema!.field, val)
        eventList.value = pref[field]
      }
    }, { deep: true })

    const handleConfirm = () => {
      // @ts-ignore
      ctx.refs.form.validate((valid: boolean) => {
        if (valid) {
          showModal.value = false
          if (editItemIndex.value > -1) {
            eventList.value[editItemIndex.value] = deepClone(form)
          } else {
            eventList.value.push(deepClone(form))
          }
          ctx.emit('change', eventList)
          // @ts-ignore
          ctx.refs.form.resetFields()
        }
      })
    }
    const resetForm = (obj: FormEvent) => {
      Object.keys(obj).forEach(k => {
        form[k] = obj[k]
      })
    }

    return {
      showModal,
      form,
      eventList,
      eventType,
      fxList,
      currentPage,
      rules: {
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        fx: [
          { required: true, message: '请选择动作', trigger: 'blur' }
        ]
      },
      handleConfirm,
      handleAdd () {
        showModal.value = true
        resetForm(defaultForm)
        // 从树形中查找节点并记录 path
        form.targetNodeIdPath = findTreePath(currentNode.value!, currentPage.value!.nodes, [])
        Vue.nextTick(() => {
          // @ts-ignore
          ctx.refs.form.clearValidate()
        })
      },
      handleEdit (item: FormEvent, i: number) {
        showModal.value = true
        resetForm(item)
        editItemIndex.value = i
        Vue.nextTick(() => {
          // @ts-ignore
          ctx.refs.form.clearValidate()
        })
      },
      handleDel (i: number) {
        MessageBox.confirm('确定要删除吗？').then(() => {
          eventList.value.splice(i, 1)
          ctx.emit('change', eventList)
        })
      }
    }
  }
})
</script>

<style lang="less">
.events-manage {
  &__editor {
  }
}
</style>
