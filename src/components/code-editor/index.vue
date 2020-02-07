<template>
  <div
    v-if="areaHeight > 0 && canMount"
    class="code-editor"
    :style="{ height: areaHeight + 'px' }"
  >
    <template v-if="isEdit">
      <div class="code-editor__title h30 flex-center-between plr10 c-aaa bg-333">
        <span>编辑{{ currentCode.title }}</span>
        <div>
          <el-button type="text" @click="handleConfirm">保存</el-button>
          <el-button type="text" @click="handleCancel">关闭</el-button>
        </div>
      </div>
      <monaco-editor
        :style="{ height: areaHeight - 30 + 'px' }"
        :amdRequire="amdRequire"
        :value="code"
        language="javascript"
        theme="vs-dark"
        @change="handleCodeChange"
      />
    </template>
    <div v-else class="flex-center p30">
      <p class="c-999">请选择要编辑的代码片段</p>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, onMounted, ref, watch } from '@vue/composition-api'
import { setTabName, tabCurrent, tabName } from '@/assets/tab'
import { setState, isEdit, currentCode } from '@/assets/code-edit'
import { getDocHeight, parseCodeValid } from '@/assets/util'
import { Message, MessageBox } from 'element-ui'

export default createComponent({
  setup () {
    const areaHeight = ref(0)
    const code = ref('')
    const isCodeValid = ref(true)
    // tab 隐藏时编辑器无法正常渲染，并不是因为高度问题
    // 用一个变量来标记初始化
    const canMount = ref(false)
    watch(() => tabCurrent.tab4, val => {
      if (val === tabName.codeEdit) {
        canMount.value = true
      }
    })
    watch(() => currentCode.code, (val: string) => {
      code.value = val
    })
    onMounted(() => {
      areaHeight.value = getDocHeight() - 105
    })
    return {
      isEdit,
      areaHeight,
      canMount,
      code,
      currentCode,
      amdRequire: window.require,
      handleCancel () {
        setState(false)
        setTabName(['', '', '', tabName.previewArea])
      },
      async handleConfirm () {
        if (!isCodeValid.value) {
          await MessageBox.confirm('代码存在语法错误，不会保存错误的代码，是否继续？')
        }
        currentCode.update(code.value)
        Message.success(`保存成功`)
      },
      handleCodeChange (val: string) {
        // 校验语法规则
        // 错误则提示不更新
        const { ok, msg } = parseCodeValid(val)
        isCodeValid.value = ok
        if (ok) {
          code.value = val
        } else {
          // console.log(msg)
        }
      }
    }
  }
})
</script>
