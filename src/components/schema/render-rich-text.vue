<template>
  <editor
    :value="content"
    :init="editorOptions"
    apiKey="1f4dburbo223re9wxcocxgqhrueu0424ae4dnnfm6b8m4mgj"
    @onChange="handleChange"
  />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { watch, ref } from '@vue/composition-api'
import { getParentRef } from '@/assets/util'
import { currentNode } from '@/assets/node'

export default {
  props: {
    schema: Object,
    schemaData: Object
  },

  components: {
    Editor
  },

  setup (props, ctx) {
    const content = ref('')
    const setContent = (setEditor = false) => {
      const { pref, field } = getParentRef(props.schema.field, props.schemaData)
      if (pref && pref[field]) {
        content.value = pref[field]
        if (setEditor && tinymce && tinymce.activeEditor) {
          tinymce.activeEditor.setContent(pref[field])
        }
      }
    }
    setContent()
    watch(() => currentNode.value, node => {
      if (node && node.type === 'rich-text') {
        setContent(true)
      }
    }, { lazy: true })
    const handleChange = (event, editor) => {
      if (event.originalEvent && event.originalEvent.is_removing) {
        // 编辑器卸载触发的 change
        console.log('removing rich text editor')
        return
      }
      ctx.emit('change', editor.getContent())
    }

    return {
      content,
      handleChange,
      editorOptions: {
        height: 500,
        menubar: false,
        language: 'zh_CN',
        language_url: './tinymce/langs/zh_CN.js',
        fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px',
        plugins: [
          'advlist autolink lists link image charmap',
          'searchreplace visualblocks code fullscreen',
          'print preview anchor insertdatetime media',
          'paste code help wordcount table'
        ],
        toolbar: [
          'forecolor backcolor bold italic underline strikethrough',
          'fontsizeselect formatselect', // image
          'undo redo numlist bullist link preview',
          'outdent indent alignleft aligncenter alignright alignjustify fullscreen'
        ]
      }
    }
  }
}
</script>

<style lang="less">
  .node-property {
    .tox .tox-tbtn {
      font-size: 12px;
    }
  }
</style>
