import { project, Project } from '@/assets/project'
import { Page } from '@/assets/page'
import { NodeItem, NodeItemBasic } from '@/assets/node'
import { getParentRef, parseCodeValid } from '@/assets/util'
import { FormEvent } from '@/assets/event'
import { Loading, Dialog, Dot, Http } from 'esc-ui'
// @ts-ignore
import Native from '@xm/native'

const native = new Native()
export const loadItem = (item: NodeItemBasic): Promise<{ default: any }> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script.${item.name}`)) {
      // @ts-ignore
      return resolve(window[item.name])
    }
    const script = document.createElement('script')
    script.src = `${project.config[project.env].componentAbsoluteUrl}${item.jsUrl}`
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
    dotInstance: null,
    config: project.config[project.env],
    http: null,
    initHttp: function (httpOptions: Project['httpOptions'], ctx: any) {
      let other: any = {}
      const options = parseCodeValid(httpOptions.options!, ctx)
      if (options.ok) {
        other = options.value
      }
      let baseUrl = httpOptions.baseUrl
      const baseUrlRes = parseCodeValid(httpOptions.baseUrl, ctx)
      if (baseUrlRes.ok) {
        baseUrl = baseUrlRes.value!
      }
      // @ts-ignore
      this.http = new Http({
        baseUrl,
        urlMap: httpOptions.urlMap,
        contentType: httpOptions.contentType,
        ...other
      })
    },
    dot: function (base: string) {
      if (!this.dotInstance) {
        // @ts-ignore
        this.dotInstance = new Dot({
          base
        })
      }
      return this.dotInstance
    },
    native,
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
    // @ts-ignore
    toast: window.vant.Toast,
    loading: Loading.instance,
    dialog: Dialog,
    cookie: {
      get: native.cookieGet
    },
    toPage (pageId: string) {
      location.href = `#/page/${pageId}`
    },
    findNodeById (nodeId: string) {
      if (this.page) {
        return findNode(this.page.nodes, nodeId)
      }
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
