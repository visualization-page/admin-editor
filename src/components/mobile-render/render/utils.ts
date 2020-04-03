import { NodeItem, NodeItemBasic } from '@/assets/node'
import { Page } from '@/assets/page'
import { getParentRef, parseCodeValid } from '@/assets/util'
import { FormEvent } from '@/assets/event'
import { Toast, Loading, Dialog } from 'esc-ui'
// @ts-ignore
import Native from '@xm/native'

const native = new Native()
export const loadItem = (item: NodeItemBasic): Promise<{ default: any }> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${process.env.VUE_APP_FILE_SERVER}${item.jsUrl}`
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
    }
    script.onerror = () => {
      reject(new Error(`${item.jsUrl} download fail`))
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
    page,
    constant: {},
    updatePage (page: Page) {
      this.page = page
    },
    getNodeProperty (id: string, property: string) {
      if (this.page) {
        const it = findNode(this.page.nodes, id)
        if (it) {
          const { pref, field } = getParentRef(property, it)
          return pref && pref[field]
        }
      }
    },
    setNodeProperty (id: string, property: string, val: any) {
      if (this.page) {
        const it = findNode(this.page.nodes, id)
        if (it) {
          const { pref, field } = getParentRef(property, it)
          pref && (pref[field] = val)
        }
      }
    },
    toast (message: string) {
      Toast(message)
    },
    loading: Loading.instance,
    dialog: Dialog,
    cookie: {
      get: native.cookieGet
    },
    toPage (pageId: string) {
      location.href = `#/page/${pageId}`
    },
    showNode (nodeId: string, show = true) {
      if (this.page) {
        const it = findNode(this.page.nodes, nodeId)
        if (it) {
          it.show = show
        }
      }
    },
    hideNode (nodeId: string) {
      this.showNode(nodeId, false)
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
