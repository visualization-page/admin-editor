import { project, Project } from '@/assets/project'
import { Page } from '@/assets/page'
import { NodeItem, NodeItemBasic, NodeUmd } from '@/assets/node'
import { getParentRef, parseCodeValid } from '@/assets/util'
import { FormEvent } from '@/assets/event'
import { Loading, Dialog, Dot, Http, Toast } from 'esc-ui'
// @ts-ignore
import MpHttp from 'esc-ui/lib/http/miniprogram'
import { basicSchemaMap } from '@/components/basic-components'

const getNative = () => window.Native ? new window.Native() : {}
export const isPc = !/android|iphone|ipad|tv/i.test(navigator.userAgent)
export const loadItem = (item: NodeItemBasic): Promise<{ default: any }> => {
  const basicNames = Object.keys(basicSchemaMap).map(x => `bf-${x}`)
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (basicNames.includes(item.name || `bf-${item.type}`)) {
      return resolve()
    }
    if (document.querySelector(`script.${item.name}`)) {
      return resolve(window[item.name])
    }
    const script = document.createElement('script')
    script.src = `${project.config.dev.componentAbsoluteUrl}${item.jsUrl}`
    script.setAttribute('class', item.name!)
    // if (item.existCss) {
    //   const link = document.createElement('link')
    //   link.href = `${process.env.VUE_APP_FILE_SERVER}${item.cssUrl}`
    //   link.rel = 'stylesheet'
    //   document.head.appendChild(link)
    // }
    document.body.appendChild(script)
    script.onload = () => {
      resolve(window[item.name])
    }
    script.onerror = () => {
      reject(new Error(`${item.jsUrl} download fail`))
    }
  })
}

export const loadItemUmd = (item: NodeUmd, load: boolean = true): Promise<{ default: any }> => {
  const elem = document.getElementsByClassName(item.label)[0]
  const isCss = item.type === 'css'
  return new Promise((resolve, reject) => {
    if (!load) {
      if (elem) {
        // @ts-ignore
        elem.remove()
        if (!isCss) {
          delete window[item.umdName]
        }
      }
      return resolve()
    }
    if (elem) {
      return resolve(!isCss && window[item.umdName])
    }
    if (isCss) {
      const link = document.createElement('link')
      link.href = item.url
      link.rel = 'stylesheet'
      link.setAttribute('class', item.label)
      link.onload = () => {
        resolve()
      }
      link.onerror = (e) => {
        reject(e)
      }
      document.head.appendChild(link)
      return
    }
    const script = document.createElement('script')
    script.src = item.url
    script.setAttribute('class', item.label)
    script.onload = () => {
      resolve(window[item.umdName])
    }
    script.onerror = () => {
      reject(new Error(`item.label ${item.url} download fail`))
    }
    document.body.appendChild(script)
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

export const setCodeField = (field: string, obj: any, str: string | null) => {
  if (str) {
    const { ok, value } = parseCodeValid(str)
    if (ok) {
      obj[field] = value
    }
  }
}
export const setGlobalUtils = (obj: any, utils: string | null) => {
  setCodeField('utils', obj, utils)
}
export const setGlobalConstant = (obj: any, cons: string | null) => {
  setCodeField('constant', obj, cons)
}

export const initGlobalConfig = (page: Page | null) => {
  const native = getNative()
  return {
    win: window,
    page,
    utils: {},
    dotInstance: null,
    config: project.config[window.globalProject ? project.env : 'dev'], // 预览时走开发环境配置
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
      const obj = {
        baseUrl,
        urlMap: httpOptions.urlMap,
        loadingMethods: Loading.instance,
        notify: Toast,
        contentType: httpOptions.contentType,
        ...other
      }
      const isMp = project.interactiveType === 'xmmp'
      function miniprogramRequestHandle (method: string, url: string, data: any) {
        return new Promise((resolve, reject) => {
          const isPost = /post/i.test(method)
          if (!isPost && data) {
            const param: string[] = []
            Object.keys(data).forEach(k => {
              param.push(`${k}=${encodeURIComponent(data[k])}`)
            })
            url += `?${param.join('&')}`
          }
          // eslint-disable-next-line
          window.xm
            .fetch(baseUrl + url, {
              method,
              headers: { 'content-type': obj.contentType },
              cache: 'no-cache',
              body: isPost && data ? JSON.stringify(data) : null,
              // credentials: 'same-origin'
              credentials: true,
              // 小程序发起请求，由客户端拼上 baseUrl
              isRelative: true
            })
            .then((res: any) => res.json())
            .then((res: any) => {
              console.log('fetch 返回', res)
              if (res.success || res.code === 200 || res.retcode === 0) {
                resolve({ success: true, data: res })
              } else {
                reject(res)
              }
            })
            .catch((err: any) => {
              console.log('fetch 报错', err)
              reject(err)
            })
        })
      }
      // @ts-ignore
      this.http = isMp ? new MpHttp({ ...obj, miniprogramRequestHandle }) : new Http(obj)
    },
    dot: function () {
      const release = process.env.VUE_APP_RELEASE
      if (!this.dotInstance) {
        // @ts-ignore
        this.dotInstance = new Dot({
          orgId: native.orgId,
          userId: native.uid || undefined,
          base: `${release ? window._APP_CONFIG.adminHost : 'http://admin.jituancaiyun.net'}/dot-log/logExt.json`
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
    toast: Toast,
    loading: Loading.instance,
    dialog: Dialog,
    cookie: {
      get (name: string) {
        let cookieValue = null
        if (document.cookie && document.cookie !== '') {
          let cookies = document.cookie.split(';')
          for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim()
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
              break
            }
          }
        }
        return cookieValue
      }
    },
    toPage (
      pageId: string,
      query?: { [k: string]: string },
      options?: { methods: 'push' | 'replace' }
    ) {
      const queryStr: string[] = []
      const dir = window.globalProject ? window.globalProject.project.dir : project.dir
      if (query) {
        Object.keys(query).forEach(k => {
          queryStr.push(`${k}=${query[k]}`)
        })
      }
      const url = `#/page/${dir}/${pageId}${queryStr.length ? `?${queryStr.join('&')}` : ''}`
      if (options && options.methods === 'replace') {
        location.replace(url)
      } else {
        location.href = url
      }
    },
    route () {
      return window.globalApp.$route
    },
    router () {
      return window.globalApp.$router
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
    },
    search () {
      let search = location.search.slice(1)
      let searchObj: { [k: string]: any } = {}
      let key = ''
      let splitArr = []

      if (search) {
        let paramArr = search.split('&')
        for (let i = 0; i < paramArr.length; i++) {
          splitArr = paramArr[i].split('=')
          key = splitArr[0]
          searchObj[key] = decodeURIComponent(splitArr[1])
        }
        return searchObj
      }
      return null
    },
    env () {
      const ua = navigator.userAgent
      const inPlatformPreview = /render\.html/.test(location.pathname)
      const inClient = /iphone|android|ipad/i.test(ua)
      return {
        inApp: /hwniapp/.test(ua),
        inTv: /tv/.test(ua),
        inClient,
        inPlatform: /tms/.test(location.hostname),
        inPlatformPreview,
        inPlatformPreviewAppMode: inPlatformPreview && inClient
      }
    },
    vw (num: number) {
      const { inApp, inPlatformPreviewAppMode } = this.env()
      if (inApp || inPlatformPreviewAppMode) {
        return (num / (project.config.vwBase / 100)).toFixed(2) + 'vw'
      }
      return num + 'px'
    },
    objToString (obj: any) {
      return Object.keys(obj).map(k => {
        return `${k}=${encodeURIComponent(obj[k])}`
      }).join('&')
    }
  }
}

export const getEventHandler = (ev: FormEvent, ctx: any) => {
  const { ok, msg, value } = parseCodeValid(`(function () {\n${ev.fxCode}\n})()`, ctx)
  if (ok) {
    return value
  }
  console.warn(`event [${ev.eventType}] error: ${msg}`)
}
