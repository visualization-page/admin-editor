<template>
  <div class="events-manage f12">
    <el-button type="text" @click="handleAdd">添加事件</el-button>
    <ul>
      <li
        v-for="(item, i) in eventList"
        :key="i"
        class="flex-center-between">
        <span class="c-666">{{ i + 1 }}. {{ item.desc || item.eventType }}</span>
        <span>
          <i class="el-icon-edit c-blue cp mr10" @click="handleEdit(item, i)" />
          <i class="el-icon-delete c-main cp" @click="handleDel(i)"/>
        </span>
      </li>
    </ul>

    <div v-if="showAddForm" class="bg-f7 p10">
      <p class="c-666" v-if="editItemIndex !== -1">编辑事件 {{ editItemIndex + 1 }}</p>
      <el-select
        v-model="form.eventType"
        size="mini"
        class="mtb5"
        placeholder="请选择事件类型"
        style="width: 110px"
      >
        <el-option
          v-for="item in eventTypeOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button type="text" class="ml10" @click="handleEditCode">编辑事件代码</el-button>
      <el-input v-model="form.desc" size="mini" type="input" placeholder="请输入事件描述(非必填)" />
      <div class="mt5">
        <el-button size="mini" type="warning" class="" @click="handleConfirm()">保存</el-button>
        <el-button size="mini" type="default" class="ml20" @click="handleCancel()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import Vue from 'vue'
import { createComponent, ref, reactive, watch, computed } from '@vue/composition-api'
import { eventType, eventTypePage } from '@/assets/event'
import { currentPage } from '@/assets/page'
import { currentNode } from '@/assets/node'
import { findTreePath, getParentRef, deepClone } from '@/assets/util'
// import VueMonaco from '@/components/vue-monaco/index.vue'
import { MessageBox, Message } from 'element-ui'
// import Modal from '@/components/v2/modal.vue'
import { setCodeState } from '@/assets/code-edit'

export default createComponent({
  props: {
    schema: Object,
    schemaData: Object,
    from: {
      type: String,
      default: 'node'
    }
  },
  components: {
    // Modal
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
    // const showModal = ref(false)
    // const canMount = ref(false)
    const editItemIndex = ref(-1)
    // const editor = ref<{
    //   getPosition: any,
    //   executeEdits: any,
    //   setPosition: any,
    //   focus: any
    // }>(null)
    const defaultForm: FormEvent = {
      eventType: '',
      targetNodeIdPath: [],
      fxCode: '',
      desc: ''
    }
    const isFromPage = computed(() => props.from === 'page')
    const form = reactive<FormEvent>(deepClone(defaultForm))
    const eventTypeOptions = computed(() => isFromPage.value ? eventTypePage : eventType)
    // const addForm = reactive({ desc: '', fxCode: '', eventType: '' })
    const showAddForm = ref(false)

    // watch(() => showModal.value, val => {
    //   if (val) {
    //     setTimeout(() => {
    //       canMount.value = val
    //     }, 500)
    //   } else {
    //     canMount.value = val
    //   }
    // })
    watch(() => [currentNode.value, currentPage.value], () => {
      showAddForm.value = false
    })

    watch(() => props.schemaData, val => {
      if (val) {
        const { pref, field } = getParentRef(props.schema!.field, val)
        eventList.value = deepClone(pref[field]).filter(Boolean)
      }
    }, { deep: true })

    const handleConfirm = () => {
      // @ts-ignore
      // ctx.refs.form.validate((valid: boolean) => {
      //   if (valid) {
      //     if (close) {
      //       showModal.value = false
      //     }
      //     if (editItemIndex.value > -1) {
      //       eventList.value[editItemIndex.value] = deepClone(form)
      //     } else {
      //       eventList.value.push(deepClone(form))
      //     }
      //     ctx.emit('change', eventList.value)
      //     // @ts-ignore
      //     ctx.refs.form.resetFields()
      //   }
      // })
      if (!form.eventType) {
        return Message.error('请选择事件类型')
      }
      if (editItemIndex.value > -1) {
        eventList.value[editItemIndex.value] = deepClone(form)
      } else {
        eventList.value.push(deepClone(form))
      }
      ctx.emit('change', eventList.value)
      // 重置表单
      resetForm(defaultForm)
      showAddForm.value = false
    }
    const resetForm = (obj: FormEvent) => {
      Object.keys(obj).forEach(k => {
        form[k] = obj[k]
      })
    }
    const handleCancel = () => {
      resetForm(defaultForm)
      showAddForm.value = false
    }
    const handleEditCode = () => {
      setCodeState('事件代码', form.fxCode, (val: string) => {
        // updateField(schema.field, val || '')
        form.fxCode = val
        if (form.eventType) {
          handleConfirm()
        }
      })
    }
    // const handleClickFx = (item: any) => {
    //   if (editor.value) {
    //     const position = editor.value.getPosition()
    //     editor.value.executeEdits('', [
    //       {
    //         range: {
    //           startLineNumber: position.lineNumber,
    //           startColumn: position.column,
    //           endLineNumber: position.lineNumber,
    //           endColumn: position.column
    //         },
    //         text: item.code
    //       }
    //     ])
    //     position.column += item.code.length
    //     editor.value.setPosition(position)
    //     editor.value.focus()
    //   }
    // }

    return {
      // showModal,
      // canMount,
      form,
      eventList,
      eventTypeOptions,
      // isFromPage,
      showAddForm,
      editItemIndex,
      // fxList,
      // currentPage,
      // rules: {
      //   desc: [
      //     { required: true, message: '请输入描述', trigger: 'blur' }
      //   ],
      //   eventType: [
      //     { required: true, message: '请选择类型', trigger: 'blur' }
      //   ]
      // },
      handleConfirm,
      handleCancel,
      handleEditCode,
      handleAdd () {
        editItemIndex.value = -1
        showAddForm.value = true
        // showModal.value = true
        // editItemIndex.value = -1
        // resetForm(defaultForm)
        // if (!isFromPage.value) {
        //   // 从树形中查找节点并记录 path
        //   form.targetNodeIdPath = findTreePath(currentNode.value!, currentPage.value!.nodes, [])
        //   Vue.nextTick(() => {
        //     // @ts-ignore
        //     ctx.refs.form.clearValidate()
        //   })
        // }
      },
      handleEdit (item: FormEvent, i: number) {
        // showModal.value = true
        resetForm(item)
        editItemIndex.value = i
        // Vue.nextTick(() => {
        //   // @ts-ignore
        //   ctx.refs.form.clearValidate()
        // })
        showAddForm.value = true
        handleEditCode()
      },
      handleDel (i: number) {
        MessageBox.confirm('确定要删除吗？').then(() => {
          showAddForm.value = false
          eventList.value.splice(i, 1)
          ctx.emit('change', eventList.value)
        })
      }
      // amdRequire: window.require,
      // handleClickFx,
      // handleMounted (editorInstance: any) {
      //   editor.value = editorInstance
      //   editorInstance.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_S, function () {
      //     handleConfirm(false)
      //   })
      //   editorInstance.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_D, function () {
      //     showModal.value = false
      //   })
      // }
    }
  }
})
</script>

<style lang="less">
.events-manage {
  //.el-input__inner {
  //  background: transparent;
  //  border-color: #666;
  //  color: #ccc;
  //}
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
        height: e('calc(100% - 86px)');
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
