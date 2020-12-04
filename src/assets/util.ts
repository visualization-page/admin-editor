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

export const updateByField = (target: any, path: string, val: any) => {
  const { pref, field } = getParentRef(path, target)
  if (pref[field] !== undefined) {
    if (Array.isArray(pref[field])) {
      pref[field].splice(0, pref[field].length)
      pref[field].push.apply(pref[field], val)
    } else if (typeof pref[field] === 'object') {
      Vue.set(pref, field, val)
    } else {
      pref[field] = val
    }
  } else {
    Vue.set(pref, field, val)
  }
  // Vue.set(pref, field, val)
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

export const parseCodeValid = (code: string | null, ctx?: any) => {
  const res = { ok: false, msg: '', value: null, stack: '' }
  if (!code) {
    res.msg = '要执行的 code 为 null'
    return res
  }
  let funBody = ''
  const isFunReg = /(^\(function \(h?\) {)/
  const isNewCodeReg = /(\$\$global\.export|\$\$global\["export"\]) =/
  const isFunc = isFunReg.test(code)
  const isNewCodeStyle = isNewCodeReg.test(code)
  if (isNewCodeStyle) {
    funBody = code.replace(isNewCodeReg, 'return ')
  } else if (isFunc) {
    funBody = code.replace(isFunReg, 'return $1')
  } else {
    funBody = `return ${code}`
  }
  if (ctx) {
    funBody = `var ym = arguments[0];${funBody.replace(/(\$\$)/g, 'ym.$1')}`
  }
  try {
    res.value = new Function(funBody)(ctx) // eslint-disable-line no-new-func
    res.ok = true
  } catch (e) {
    // console.log(code, ctx)
    // console.log(code, e)
    res.msg = e.message || e.name || '语法错误'
    res.stack = e.stack
  }
  return res
}

export const sleepUntil = (assets: () => boolean) => {
  let handler: any
  let count = 0
  return new Promise((resolve, reject) => {
    if (assets()) {
      resolve()
    } else {
      handler = setInterval(() => {
        count += 1
        if (assets()) {
          clearInterval(handler)
          handler = null
          resolve()
        } else if (count >= 6000) {
          clearInterval(handler)
          handler = null
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
        }
      })
    }
  })
}

export const deepMerge = (origin: any, obj?: any): any => {
  if (obj) {
    for (const k in obj) {
      if (
        origin[k] === undefined ||
        origin[k] === 0 ||
        origin[k] === null ||
        typeof obj[k] === 'string'
      ) {
        origin[k] = obj[k]
      } else if (Array.isArray(obj[k])) {
        if (typeof origin[k] === 'string') {
          origin[k] = [origin[k]]
        }
        origin[k] = (origin[k] || []).concat(obj[k])
      } else if (typeof obj[k] === 'object') {
        deepMerge(origin[k], obj[k])
      }
    }
  }
}

export function addScript (id: string, url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = id
    script.src = url
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      const er = new Error(`load js [${id}] error`)
      console.log(er)
      reject(er)
    }
    document.body.appendChild(script)
  })
}

export function addStyle (id: string, url: string) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.id = id
    link.href = url
    link.rel = 'stylesheet'
    link.onload = () => {
      resolve()
    }
    link.onerror = () => {
      const er = `load css [${id}] error`
      console.log(er)
      reject(new Error(er))
    }
    document.body.appendChild(link)
  })
}

export function removeNode (id: string) {
  const item = document.getElementById(id)
  if (item) {
    document.body.removeChild(item)
  }
}

export const isInMiniapp = /hwminiapp/i.test(navigator.userAgent)

export function loadSdkSystem (sdkIds: string[], config: { [k: string]: { js: string, css?: string } }) {
  return sdkIds.sort().map(id => {
    const jid = `J_${id}`
    const cid = `C_${id}`
    if (document.getElementById(jid)) {
      return []
    }
    if (isInMiniapp) {
      return [
        addScript(jid, `shinemosdk://${id}/index.js`),
        // 样式文件可能不存在
        addStyle(cid, `shinemosdk://${id}/index.css`).catch(() => '')
      ]
    } else if (config[id]) {
      const res = [addScript(jid, config[id].js)]
      if (config[id].css) {
        res.push(addStyle(cid, config[id].css!).catch(() => ''))
      }
      return res
    }
  }).flat().filter(Boolean)
}

export function loadSdk (type: string) {
  const typeMap: { [k: string]: { id: string, src: string } } = {
    'long-page': {
      id: 'native',
      src: (window._PUBLIC_PATH || '') + 'native/native.js'
    },
    xmmp: {
      id: 'xmmp',
      src: isInMiniapp ? 'shinemosdk://20000/index.js' : (window._PUBLIC_PATH || '') + 'xmmp/xmmp.min.js'
    }
  }
  return new Promise((resolve, reject) => {
    const { id, src } = typeMap[type]
    if (document.getElementById(id)) {
      console.log('load sdk ', id, 'exist!')
      return resolve()
    }
    // 移除旧节点
    Object.keys(typeMap).map(it => typeMap[it].id).forEach(removeNode)
    if (!window.defineBak && window.define) {
      window.defineBak = window.define
    }
    window.JSBridge = undefined
    // hack monaco editor require
    window.define = undefined
    addScript(id, src).then(() => {
      window.define = window.defineBak
      resolve()
    }).catch(err => {
      window.define = window.defineBak
      reject(err)
    })
  })
}
