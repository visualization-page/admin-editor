<template>
  <div ref="editor" class="vue-monaco" :style="{ height: this.height }" />
</template>

<script lang="ts">
import { editor } from 'monaco-editor'
import { createComponent, onMounted, onUnmounted } from '@vue/composition-api'

export default createComponent({
  props: {
    value: String,
    height: {
      type: String,
      default: '300px'
    }
  },

  setup (props, ctx) {
    let editorIns: any
    onMounted(() => {
      // @ts-ignore
      editorIns = editor.create(ctx.refs.editor, {
        value: props.value,
        language: 'javascript',
        theme: 'vs-dark'
      })
      editorIns.onDidChangeModelContent((event: any) => {
        const value = editorIns.getValue()
        if (props.value !== value) {
          ctx.emit('change', value, event)
        }
      })
    })
    onUnmounted(() => {
      editorIns.dispose()
    })
  }
})
</script>
