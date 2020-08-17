<template>
  <transition name="el-zoom-in-bottom">
    <div
      v-if="isEdit"
      class="editor-v2__code-editor"
    >
      <div class="editor-v2__code-editor-header flex-center-between">
        <img src="@/assets/img/logo_small.png" alt="" width="160px">
        <span class="f14 c-aaa">编辑{{ currentCode.title }}</span>
        <div class="flex-center mr15">
          <div class="p10 cp c-main mr10" @click="handleCancel">退出编辑器</div>
          <div class="bf-btn" @click="handleConfirm">
            <div class="bf-btn__container">
              保存代码
            </div>
          </div>
        </div>
      </div>
      <transition name="el-fade-in">
        <div
          v-if="canMountAfterLoading"
          class="absolute l0 r0 b0 tc c-ccc f14 pt50"
          style="top: 60px;background-color: #1e1e1e"
        >
          <span>代码准备中...</span>
        </div>
      </transition>
      <monaco-editor
        v-if="canMount"
        :style="{ height: areaHeight - 30 + 'px' }"
        :amdRequire="amdRequire"
        :value="code"
        :language="currentCode.language"
        :options="{
          fontSize: 14,
          showUnused: true,
          smoothScrolling: true,
          tabCompletion: 'on',
          tabSize: 2,
          formatOnPaste: true,
          detectIndentation: false
        }"
        theme="vs-dark"
        @change="handleCodeChange"
        @editorDidMount="handleMounted"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import { createComponent, onMounted, ref, watch } from '@vue/composition-api'
import { currentCode, isEdit, setState } from '@/assets/code-edit'
import { getDocHeight } from '@/assets/util'
import { MessageBox } from 'element-ui'

export default createComponent({
  setup () {
    const areaHeight = ref(0)
    const code = ref('')
    const isCodeValid = ref(true)
    const canMount = ref(false)
    const canMountAfterLoading = ref(false)
    watch(() => currentCode.code, (val: string) => {
      code.value = val
    })
    // 必须等到动画过完才能渲染编辑器
    watch(() => isEdit.value, val => {
      if (val) {
        canMountAfterLoading.value = true
        setTimeout(() => {
          canMount.value = true
        }, 500)
      } else {
        canMount.value = false
      }
    })
    onMounted(() => {
      areaHeight.value = getDocHeight()
    })
    const handleCancel = () => {
      setState(false)
    }
    return {
      areaHeight,
      code,
      canMount,
      canMountAfterLoading,
      isEdit,
      currentCode,
      amdRequire: window.require,
      handleCancel,
      async handleConfirm () {
        if (!isCodeValid.value) {
          await MessageBox.confirm('代码存在语法错误，不会保存错误的代码，是否继续？')
        }
        currentCode.update(code.value)
        window.globalApp.$notify({
          title: '成功',
          message: `保存 ${currentCode.title}`,
          type: 'success',
          duration: 2000,
          position: 'top-left'
        })
        handleCancel()
      },
      handleCodeChange (val: string) {
        code.value = val
      },
      handleMounted () {
        canMountAfterLoading.value = false
      }
    }
  }
})
</script>

<style lang="less">
.editor-v2 {
  &__code-editor {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #262a30;
    z-index: 9999;
  }
}
</style>
