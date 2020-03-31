import { NodeItemBasic } from '@/assets/node'

export const loadItem = (item: NodeItemBasic): Promise<{ default: any }> => {
  // @ts-ignore
  const defineBak = window.define
  return new Promise((resolve, reject) => {
    // @ts-ignore
    window.define = undefined
    const script = document.createElement('script')
    script.src = `${process.env.VUE_APP_FILE_SERVER}${item.jsUrl}`
    // script.className = item.name
    script.setAttribute('class', item.name!)
    if (item.existCss) {
      const link = document.createElement('link')
      link.href = `${process.env.VUE_APP_FILE_SERVER}${item.cssUrl}`
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
