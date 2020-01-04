import Vue from 'vue'

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
