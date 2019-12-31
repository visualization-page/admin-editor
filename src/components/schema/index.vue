<script lang="jsx">
import { Form, FormItem, Input, Select, Option, Button } from 'element-ui'
import { createComponent, reactive, isRef, watch } from '@vue/composition-api'
import { renderInput, renderSelect } from './render-item'
import RenderUrlMap from './render-url-map.vue'

export default createComponent({
  props: {
    schema: Array,
    schemaData: Object
  },

  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option,
    ElButton: Button
  },

  setup (props, ctx) {
    const schemaData = reactive(JSON.parse(JSON.stringify(props.schemaData)))
    const renderFormItem = (schema) => {
      return (
        <el-form-item
          key={schema.field}
          label={schema.label}
          prop={schema.field}
        >
          { renderItem(schema) }
        </el-form-item>
      )
    }

    watch(() => schemaData, val => {
      // console.log(val)
      // 返回一个新的对象
      ctx.emit('change', val)
    }, { deep: true, lazy: true })

    const renderItem = (schema) => {
      switch (schema.type) {
        case 'input':
        case 'textarea':
          return renderInput(schema, schemaData)
        case 'select':
          return renderSelect(schema, schemaData)
        case 'input-group':
          // return renderInputGroup(schema, schemaData)
          return (
            <RenderUrlMap
              schema={schema}
              schemaData={schemaData}
              onChange={(val) => { schemaData.httpOptions.urlMap = reactive(val) }}
            />
          )
        default:
          return <p />
      }
    }

    const rules = props.schema.reduce((obj, x) => {
      if (x.rulers) {
        return Object.assign(obj, { [x.field]: x.rulers })
      }
      return obj
    }, {})

    const validate = () => new Promise((resolve, reject) => {
      ctx.refs.form.validate((valid) => {
        if (valid) {
          resolve(schemaData)
        } else {
          // eslint-disable-next-line
          reject()
        }
      })
    })

    return () => (
      <div class="schema-form">
        <el-form
          rules={rules}
          label-width="80px"
          label-position="left"
          ref="form"
        >
          { props.schema.map(renderFormItem) }
        </el-form>
      </div>
    )
  }
})
</script>

<style lang="less">
.schema-form {
  .el-form-item__label {
    font-size: 12px;
  }
}
</style>
