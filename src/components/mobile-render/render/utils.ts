import { NodeItem, NodeItemBasic } from '@/assets/node'
import { Page } from '@/assets/page'
import { getParentRef, parseCodeValid } from '@/assets/util'
import { FormEvent } from '@/assets/event'

export const loadItem = (item: NodeItemBasic): Promise<{ default: any }> => {
  // @ts-ignore
  // const defineBak = window.define
  return new Promise((resolve, reject) => {
    // @ts-ignore
    // window.define = undefined
    const script = document.createElement('script')
    script.src = `${process.env.VUE_APP_FILE_SERVER}${item.jsUrl}`
    // script.className = item.name
    script.setAttribute('class', item.name!)
    // if (item.existCss) {
    //   const link = document.createElement('link')
    //   link.href = `${process.env.VUE_APP_FILE_SERVER}${item.cssUrl}`
    //   link.rel = 'stylesheet'
    //   document.head.appendChild(link)
    // }
    document.body.appendChild(script)
    script.onload = () => {
      // @ts-ignore
      resolve(window[item.name])
      // setTimeout(() => {
      //   // @ts-ignore
      //   window.define = defineBak
      // })
    }
    script.onerror = () => {
      reject(new Error(`${item.jsUrl} download fail`))
      // setTimeout(() => {
      //   // @ts-ignore
      //   window.define = defineBak
      // })
    }
  })
}

type Obj = { [k: string]: string | null }
export const dealFx = (params: Obj, ctx: any): Obj => {
  if (!params) {
    return params
  }
  const _deal = (val: string | null) => {
    const { ok, value } = parseCodeValid(val, ctx)
    if (ok) {
      return value
    }
    return val
  }
  if (typeof params === 'object') {
    const result: Obj = {}
    Object.keys(params).forEach(k => {
      result[k] = _deal(params[k])
    })
    return result
  }
  return params
}

export const findNode = (nodes: NodeItem[], id: string): NodeItem | undefined => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return nodes[i]
    }
    if (nodes[i].children && nodes[i].children.length) {
      const it = findNode(nodes[i].children, id)
      if (it) {
        return it
      }
    }
  }
}

export const initGlobalConfig = (page: Page | null) => {
  return {
    constant: {},
    getNodeProperty (id: string, property: string) {
      if (page) {
        const { nodes } = page
        const it = findNode(nodes, id)
        if (it) {
          const { pref, field } = getParentRef(property, it)
          return pref && pref[field]
        }
      }
    },
    setNodeProperty (id: string, property: string, val: any) {
      if (page) {
        const { nodes } = page
        const it = findNode(nodes, id)
        if (it) {
          const { pref, field } = getParentRef(property, it)
          pref && (pref[field] = val)
        }
      }
    }
  }
}

export const getEventHandler = (ev: FormEvent, ctx: any) => {
  const { ok, msg, value } = parseCodeValid(`(function() {${ev.fxCode}})()`, ctx)
  if (ok) {
    return value
  }
  console.log(`event [${ev.eventType}] error: ${msg}`)
}
