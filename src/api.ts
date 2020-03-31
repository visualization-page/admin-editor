import { Http } from 'esc-ui'
import { Message, Loading } from 'element-ui'

const loadingMethods = {
  self: null,
  open () {
    if (!this.self) {
      // @ts-ignore
      this.self = Loading.service({ background: 'transparent' })
    }
  },
  close () {
    if (this.self) {
      // @ts-ignore
      this.self.close()
      this.self = null
    }
  }
}

export const http = new Http({
  baseUrl: process.env.VUE_APP_FILE_SERVER,
  urlMap: {
    component: {
      list: '/butterfly/component/:type',
      update: '/butterfly/component/:type',
      export: '/butterfly/component/export/:type'
    }
  },
  notify: Message.error,
  loadingMethods,
  contentType: 'application/json'
})
