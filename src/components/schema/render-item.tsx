import Vue from 'vue'
import CompositionApi, { ref, reactive } from '@vue/composition-api'

Vue.use(CompositionApi)

export const renderInput = (item: any, data: any) => {
  const props = {
    attrs: {
      type: item.type,
      placeholder: '请输入',
      ...(item.elAttrs || {})
    },
    ...(item.elProps || {})
  }
  return <el-input {...props} />
}

export const renderSelect = (item: any, data: any) => {
  const field = item.field.split('.').reduce((res: any, x: string) => res[x], data)
  return (
    <el-select value={field}>
      { item.options.map((x: any) => <el-option label={x.label} value={x.value} />) }
    </el-select>
  )
}
