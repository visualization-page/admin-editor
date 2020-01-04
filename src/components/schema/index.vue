<script lang="jsx">
import { createComponent, reactive } from '@vue/composition-api'
import { renderInput, renderSelect, renderCheckbox } from './render-item'
import RenderUrlMap from './render-url-map.vue'

export default createComponent({
  props: {
    schema: Array,
    schemaData: Object
  },

  setup (props, ctx) {
    const updateField = (field, val) => {
      ctx.emit('updateByField', field, val)
    }
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
    const renderItem = (schema) => {
      switch (schema.type) {
        case 'input':
        case 'textarea':
          return renderInput(schema, props.schemaData, updateField)
        case 'select':
          return renderSelect(schema, props.schemaData, updateField)
        case 'checkbox':
          return renderCheckbox(schema, props.schemaData, updateField)
        case 'input-group':
          return (
            <RenderUrlMap
              schema={schema}
              schemaData={props.schemaData}
              onChange={(val) => {
                updateField('httpOptions.urlMap', reactive(val))
              }}
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
          resolve(props.schemaData)
        } else {
          // eslint-disable-next-line
          reject()
        }
      })
    })

    const propsForm = {
      props: {
        model: props.schemaData,
        rules,
        'label-width': '80px',
        'label-position': 'left'
      },
      ref: 'form'
    }
    return () => (
      <div class="schema-form">
        <el-form {...propsForm} >
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
