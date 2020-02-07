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
      width="700px"
      class="events-manage-dialog"
      top="0"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="60px"
        ref="form"
        style="height: 500px;overflow: auto"
      >
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型" prop="eventType">
          <el-select v-model="form.eventType">
            <el-option
              v-for="item in eventTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!isFromPage"
          label="目标节点"
          prop="targetNodeIdPath"
        >
          <el-cascader
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
        <el-form-item class="events-btn" label="内置动作" prop="fx">
          <el-button
            v-for="(item, i) in fxList"
            :key="i"
            type="warning"
            @click="handleClickFx(item)"
          >
            <i class="iconfont icon-function" />
            {{ item.name }}
          </el-button>
        </el-form-item>
        <el-form-item label="逻辑代码" prop="fxCode">
          <monaco-editor
            v-model="form.fxCode"
            :amdRequire="amdRequire"
            style="height: 300px"
            language="javascript"
            theme="vs-dark"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="handleConfirm">保 存</el-button>
        <el-button @click="showModal = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createComponent, ref, reactive, watch, computed } from '@vue/composition-api'
import { eventType, eventTypePage, fxList } from '@/assets/event'
import { currentPage } from '@/assets/page'
import { currentNode } from '@/assets/node'
import { findTreePath, getParentRef, deepClone } from '@/assets/util'
// import VueMonaco from '@/components/vue-monaco/index.vue'
import { MessageBox } from 'element-ui'

export default createComponent({
  props: {
    schema: Object,
    schemaData: Object,
    from: {
      type: String,
      default: 'node'
    }
  },

  setup (props, ctx) {
    type FormEvent = {
      eventType: string
      targetNodeIdPath?: string[]
      fxCode: string
      desc: string
      [k: string]: any
    }
    const eventList = ref<FormEvent[]>([])
    const showModal = ref(false)
    const editItemIndex = ref(-1)
    const defaultForm: FormEvent = {
      eventType: '',
      targetNodeIdPath: [],
      fxCode: '',
      desc: ''
    }
    const isFromPage = computed(() => props.from === 'page')
    const form = reactive<FormEvent>(deepClone(defaultForm))
    const eventTypeOptions = computed(() => isFromPage.value ? eventTypePage : eventType)

    watch(() => props.schemaData, val => {
      if (val) {
        const { pref, field } = getParentRef(props.schema!.field, val)
        eventList.value = deepClone(pref[field])
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
          ctx.emit('change', eventList.value)
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
    const handleClickFx = (item: any) => {
      // console.log(item)
      form.fxCode += `\n${item.code}`
    }

    return {
      showModal,
      form,
      eventList,
      eventTypeOptions,
      isFromPage,
      fxList,
      currentPage,
      rules: {
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        eventType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ]
      },
      handleConfirm,
      handleAdd () {
        showModal.value = true
        resetForm(defaultForm)
        if (!isFromPage.value) {
          // 从树形中查找节点并记录 path
          form.targetNodeIdPath = findTreePath(currentNode.value!, currentPage.value!.nodes, [])
          Vue.nextTick(() => {
            // @ts-ignore
            ctx.refs.form.clearValidate()
          })
        }
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
          ctx.emit('change', eventList.value)
        })
      },
      amdRequire: window.require,
      handleClickFx
    }
  }
})
</script>

<style lang="less">
.events-manage {
  &__editor {
  }
  &-dialog {
    & > div {
      top: 50%;
      transform: translateY(-50%);
    }
    .el-form-item__label {
      color: #ccc;
    }
    .el-input__inner {
      background-color: transparent;
      border-color: #666;
    }
    .events-btn .el-button {
      margin: 0 10px 10px 0;
    }
    .el-dialog {
      &__header {
        padding: 5px 10px;
        background-color: #333;
      }
      &__title {
        color: #ccc;
        font-size: 14px;
      }
      &__headerbtn {
        top: 5px;
        right: 10px;
      }
      &__body {
        padding: 20px;
        background-color: #222;
      }
      &__footer {
        padding: 10px;
        text-align: center;
        background-color: #333;
      }
    }
  }
}
</style>
