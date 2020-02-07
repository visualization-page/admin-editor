import Vue from 'vue'
import CompositionApi, { createElement } from '@vue/composition-api'
import { getParentRef, getUnitValue } from '@/assets/util'
// import { Message } from 'element-ui'
import { setCodeState } from '@/assets/code-edit'
import { setTabName, tabName } from '@/assets/tab'

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
      props={item.props}
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
  if (!pref) {
    return null
  }
  const { value, unit } = getUnitValue(pref[field])
  return createElement(name, {
    props: {
      value: valueHasUnit ? Number(value) : pref[field]
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

export const renderCodeEditor = (schema: any, data: any, updateField: any) => {
  const setCurrentCode = () => {
    const { pref, field } = getParentRef(schema.field, data)
    setTabName(['', '', '', tabName.codeEdit])
    setCodeState(schema.label, pref[field], (val: string) => {
      updateField(schema.field, val)
    })
  }
  return <el-button type="text" onClick={setCurrentCode}>编辑代码片段</el-button>
}
