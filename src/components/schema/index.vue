<script lang="jsx">
import Vue from 'vue'
import { Notification } from 'element-ui'
import { defineComponent, createElement, reactive, watch } from '@vue/composition-api'
import { renderInput, renderInputBind, renderSelect, renderCheckbox, renderCheckboxGroup, renderUniversal, renderCodeEditor, renderDesc } from './render-item'
import RenderInputGroup from './render-input-group.vue'
import RenderInputGroupArr from './render-input-group-arr.vue'
import RenderEvents from './render-events.vue'
import RenderUnitSize from './render-unit-size.vue'
import RenderDirectionSize from './render-direction-size.vue'
import RenderRichText from './render-rich-text.vue'
import RenderImage from './render-image.vue'
import { getParentRef } from '@/assets/util'

export default defineComponent({
  props: {
    schema: Array,
    schemaData: Object,
    from: String
  },

  setup (props, ctx) {
    const updateField = (field, val) => {
      ctx.emit('updateByField', field, val)
    }
    const renderFormItem = (schema) => {
      // 检查 relation
      let showSchemaField = true
      if (schema.relation) {
        showSchemaField = schema.relation.every(item => {
          const { pref, field } = getParentRef(item.field, props.schemaData)
          return pref && pref[field] === item.value
        })
      }
      if (schema.relationCallback) {
        showSchemaField = schema.relationCallback(schema)
      }
      if (showSchemaField === false) {
        return null
      }
      // prop={/* schema.field */}
      return !schema.block ? (
        <el-form-item
          key={schema.field}
          label={schema.label}
          scopedSlots={{
            label: () => {
              return createElement('span', {
                on: {
                  click () {
                    if (schema.info) {
                      Notification({
                        type: 'info',
                        title: '提示',
                        message: schema.info,
                        position: 'top-right'
                      })
                    }
                  }
                }
              }, [
                schema.label,
                schema.info && createElement('i', { class: schema['info-icon'] })
              ])
            }
          }}
        >
          { renderItem(schema) }
        </el-form-item>
      ) : (
        <div>
          <p class="c-666 mb10">{ schema.label }</p>
          { renderItem(schema) }
        </div>
      )
    }
    const renderCompositeComponent = (component, schema) => {
      return createElement(component, {
        props: {
          schema,
          schemaData: props.schemaData,
          from: props.from
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
        case 'input-bind':
          return renderInputBind(schema, props.schemaData, updateField)
        case 'select':
          return renderSelect(schema, props.schemaData, updateField)
        case 'checkbox':
          return renderCheckbox(schema, props.schemaData, updateField)
        case 'checkbox-group':
          return renderCheckboxGroup(schema, props.schemaData, updateField)
        case 'slider':
          return renderUniversal('el-slider', schema, props.schemaData, updateField, true)
        case 'color':
          return renderUniversal('el-color-picker', schema, props.schemaData, updateField)
        case 'input-group':
          return renderCompositeComponent(RenderInputGroup, schema)
        case 'input-group-arr':
          return renderCompositeComponent(RenderInputGroupArr, schema)
        case 'unit-size':
          return renderCompositeComponent(RenderUnitSize, schema)
        case 'direction-size':
          return renderCompositeComponent(RenderDirectionSize, schema)
        case 'rich-text':
          return renderCompositeComponent(RenderRichText, schema)
        case 'events':
          return renderCompositeComponent(RenderEvents, schema)
        case 'code':
          return renderCodeEditor(schema, props.schemaData, updateField)
        case 'image':
          return renderCompositeComponent(RenderImage, schema)
        case 'description':
          return renderDesc(schema)
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
    padding-top: 9px;
    line-height: 14px;
  }
}
</style>
