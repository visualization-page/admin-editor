import { http } from '@/api'

type Item = {
  name: string
  jsUrl: string
  cssUrl: string
  existCss: boolean
}

export const loadItem = (item: Item) => {
  // @ts-ignore
  const defineBak = window.define
  return new Promise((resolve, reject) => {
    // @ts-ignore
    window.define = undefined
    const script = document.createElement('script')
    script.src = `${http.options.baseUrl}${item.jsUrl}`
    // script.className = item.name
    script.setAttribute('class', item.name)
    if (item.existCss) {
      const link = document.createElement('link')
      link.href = `${http.options.baseUrl}${item.cssUrl}`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    document.body.appendChild(script)
    script.onload = () => {
      // @ts-ignore
      resolve(window[item.name])
      setTimeout(() => {
        // @ts-ignore
        window.define = defineBak
      })
    }
    script.onerror = reject
  })
}
