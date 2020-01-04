import Vue from 'vue'
import CompositionApi, { ref, reactive } from '@vue/composition-api'
import { getParentRef } from '@/assets/util'

Vue.use(CompositionApi)

export const renderInput = (item: any, data: any, updateField: any) => {
  const { pref, field } = getParentRef(item.field, data)
  const props = {
    attrs: {
      ...(item.elAttrs || {}),
      type: item.type,
      placeholder: '请输入',
      value: pref[field]
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
