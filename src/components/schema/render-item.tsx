import { createElement } from '@vue/composition-api'
import { getParentRef, getUnitValue } from '@/assets/util'
import { setCodeState } from '@/assets/code-edit'
import { setTabName, tabName } from '@/assets/tab'
import Input from './input.vue'
import RenderInputBind from './render-input-bind.vue'

export const renderInput = (item: any, data: any, updateField: any) => {
  const { pref, field } = getParentRef(item.field, data)
  const isBlur = item.model === 'blur'
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
  return isBlur
    // @ts-ignore
    ? <Input value={pref && pref[field]} item={item} onInput={val => updateField(item.field, val)} />
    : (
      <div class="flex">
        {
          item.prepend && (
            <div
              class="prepend bg-f2 c-999 f10 flex-center plr10"
              style="border:1px solid #dcdfe6;margin-right:-4px;border-radius:4px 0 0 4px"
            >
              { item.prepend }
            </div>
          )
        }
        <el-input {...props} />
      </div>
    )
}

export const renderInputBind = (item: any, data: any, updateField: any) => {
  const { pref, field } = getParentRef(item.field, data)
  // @ts-ignore
  return <RenderInputBind value={pref && pref[field]} item={item} onInput={val => updateField(item.field, val)} />
}

export const renderSelect = (item: any, data: any, updateField: any) => {
  const { pref, field } = getParentRef(item.field, data)
  return (
    <el-select
      props={{ ...item.elProps, ...item.elAttrs }}
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
      value: valueHasUnit ? Number(value) : pref[field],
      ...(item.props || {})
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
      updateField(schema.field, val || '')
    }, schema['code-language'])
  }
  return <el-button type="text" onClick={setCurrentCode}>编辑代码片段</el-button>
}
