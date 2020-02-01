import Vue from 'vue'
import { NodeItem } from './node'

export const getDocHeight = () => {
  let h = 0
  return h || (() => {
    h = document.documentElement.offsetHeight
    return h
  })()
}

export const getParentRef = (field: string, data: any) => {
  const fieldSpace = field.split('.')
  if (fieldSpace.length > 1) {
    let res = data[fieldSpace.shift()!]
    while (fieldSpace.length > 1 && res !== undefined) {
      res = res[fieldSpace.shift()!]
    }
    return {
      pref: res,
      field: fieldSpace[0]
    }
  }
  return {
    pref: data,
    field
  }
}

export const updateByField = (target: any, str: string, val: any) => {
  const { pref, field } = getParentRef(str, target)
  if (pref[field] !== undefined) {
    pref[field] = val
  } else {
    Vue.set(pref, field, val)
  }
}

export const findTreePath = (
  target: NodeItem,
  nodes: Array<NodeItem>,
  res: string[] = []
) => {
  for (let item of nodes.values()) {
    res.push(item.id as string)
    if (item.id === target.id) {
      return res
    } else if (item.children && item.children.length) {
      const hasRes = findTreePath(target, item.children, res)
      if (hasRes) {
        return res
      } else {
        res.pop()
      }
    } else {
      res.pop()
    }
  }
}

export const deepClone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

export const getUnitValue = (str: string): { value?: string, unit?: string } => {
  if (str === null || str === undefined) {
    return {
      value: undefined,
      unit: 'px'
    }
  }
  const m = String(str).match(/px|%|vw/)
  return {
    value: m ? str.replace(m[0], '') : str,
    unit: m ? m[0] : 'px'
  }
}

export const parseCodeValid = (code: string | null) => {
  const res = { ok: false, msg: '', value: null }
  try {
    // eslint-disable-next-line no-new-func
    res.value = new Function(`return ${code}`)()
    res.ok = true
  } catch (e) {
    res.msg = e.message || e.name || '语法错误'
  }
  return res
}
