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
          <i class="el-icon-edit c-blue cp mr10" @click="handleEdit(item, i)" />
          <i class="el-icon-delete c-main cp" @click="handleDel(i)"/>
        </span>
      </li>
    </ul>

    <modal
      :show.sync="showModal"
      title="事件管理"
      @confirm="handleConfirm()"
      @cancel="showModal = false"
    >
      <div class="height-100 flex">
        <div
          class="flex-shrink-0 bg-333 height-100 oa plr15"
          style="width: 20%;border-top: 2px #1e1e1e solid"
        >
          <el-form
            :model="form"
            :rules="rules"
            label-position="top"
            ref="form"
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
              v-if="!isFromPage && false"
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
            <el-form-item label="内置函数">
              <div class="pl10">
                <div
                  v-for="(item, i) in fxList"
                  :key="i"
                  class="f12 cp c-aaa c-main-hover"
                  style="line-height: 18px"
                  @click="handleClickFx(item)"
                >
                  <i class="bficon c-main icon-function" />
                  <span class="ml5">{{ item.name }}</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="height-100" style="width: 80%">
          <monaco-editor
            v-if="canMount"
            v-model="form.fxCode"
            :amdRequire="amdRequire"
            style="height: 100%"
            language="javascript"
            theme="vs-dark"
            :options="{
              fontSize: 14,
              showUnused: true,
              smoothScrolling: true,
              tabCompletion: 'on',
              tabSize: 2,
              formatOnPaste: true,
              detectIndentation: false
            }"
            ref="editor"
            @editorDidMount="handleMounted"
          />
          <p class="tc c-aaa pt50">代码准备中...</p>
        </div>
      </div>
    </modal>
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
import Modal from '@/components/v2/modal.vue'

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
    Modal
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
    const canMount = ref(false)
    const editItemIndex = ref(-1)
    const editor = ref<{ getPosition: any, executeEdits: any }>(null)
    const defaultForm: FormEvent = {
      eventType: '',
      targetNodeIdPath: [],
      fxCode: '',
      desc: ''
    }
    const isFromPage = computed(() => props.from === 'page')
    const form = reactive<FormEvent>(deepClone(defaultForm))
    const eventTypeOptions = computed(() => isFromPage.value ? eventTypePage : eventType)

    watch(() => showModal.value, val => {
      if (val) {
        setTimeout(() => {
          canMount.value = val
        }, 500)
      } else {
        canMount.value = val
      }
    })

    watch(() => props.schemaData, val => {
      if (val) {
        const { pref, field } = getParentRef(props.schema!.field, val)
        eventList.value = deepClone(pref[field]).filter(Boolean)
      }
    }, { deep: true })

    const handleConfirm = (close = true) => {
      // @ts-ignore
      ctx.refs.form.validate((valid: boolean) => {
        if (valid) {
          if (close) {
            showModal.value = false
          }
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
      if (editor.value) {
        const position = editor.value.getPosition()
        editor.value.executeEdits('', [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column + item.code.length
            },
            text: item.code
          }
        ])
      }
    }

    return {
      showModal,
      canMount,
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
        editItemIndex.value = -1
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
      handleClickFx,
      handleMounted (editorInstance: any) {
        editor.value = editorInstance
        editorInstance.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_S, function () {
          handleConfirm(false)
        })
      }
    }
  }
})
</script>

<style lang="less">
.events-manage {
  .el-input__inner {
    background: transparent;
    border-color: #666;
    color: #ccc;
  }
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
