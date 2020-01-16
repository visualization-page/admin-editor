import Vue from 'vue'
import CompositionApi, { createElement } from '@vue/composition-api'
import { getParentRef, getUnitValue } from '@/assets/util'

Vue.use(CompositionApi)

export const renderInput = (item: any, data: any, updateField: any) => {
  const { pref, field } = getParentRef(item.field, data)
  const props = {
    attrs: {
      placeholder: item.placeholder || '请输入',
      ...(item.elAttrs || {}),
      type: item.type,
      value: pref && pref[field]
    },
    props: {
      ...(item.elProps || {})
    },
    on: {
      input (val: string) {
        updateField(item.field, val)
      }
    }
  }
  return <el-input {...props} />
}

export const renderSelect = (item: any, data: any, updateField: any) => {
  const { pref, field } = getParentRef(item.field, data)
  return (
    <el-select
      value={pref[field]}
      on={{
        change (val: string) {
          updateField(item.field, val)
        }
      }}
    >
      { item.options.map((x: any) => <el-option label={x.label} value={x.value} />) }
    </el-select>
  )
}

export const renderUniversal = (
  name: string,
  item: any,
  data: any,
  updateField: any,
  valueHasUnit: boolean
) => {
  const { pref, field } = getParentRef(item.field, data)
  const { value, unit } = getUnitValue(pref[field])
  return createElement(name, {
    props: {
      value: valueHasUnit ? value : pref[field]
    },
    on: {
      input (val: string) {
        updateField(item.field, valueHasUnit ? (val + unit) : val)
      }
    }
  })
}

export const renderCheckbox = (item: any, data: any, updateField: any) => {
  const { pref, field } = getParentRef(item.field, data)
  return (
    <el-checkbox
      value={pref[field]}
      on={{
        change (val: string) {
          updateField(item.field, val)
        }
      }}
    />
  )
}
