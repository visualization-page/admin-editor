<script lang="jsx">
import Vue from 'vue'
import { createComponent, createElement, reactive, watch } from '@vue/composition-api'
import { renderInput, renderSelect, renderCheckbox } from './render-item'
import RenderUrlMap from './render-url-map.vue'
import RenderEvents from './render-events.vue'
import RenderUnitSize from './render-unit-size.vue'

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
    const renderCompositeComponent = (component, schema) => {
      return createElement(component, {
        props: {
          schema,
          schemaData: props.schemaData
        },
        on: {
          change (val) {
            updateField(schema.field, reactive(val))
          }
        }
      })
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
          return renderCompositeComponent(RenderUrlMap, schema)
        case 'unit-size':
          return renderCompositeComponent(RenderUnitSize, schema)
        case 'events':
          return renderCompositeComponent(RenderEvents, schema)
        default:
          return <p />
      }
    }

    const propsForm = reactive({
      props: {
        model: props.schemaData,
        rules: {},
        'label-width': '80px',
        'label-position': 'left'
      },
      ref: 'form'
    })

    watch(() => props.schema, schema => {
      const rules = {}
      schema.forEach(x => {
        if (x.rules) {
          rules[x.field] = x.rules
        }
      })
      Vue.set(propsForm.props, 'rules', rules)
    })
    watch(() => props.schemaData, schemaData => {
      propsForm.props.model = schemaData
    })

    return () => (
      <div class="schema-form">
        <el-form {...propsForm}>
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
