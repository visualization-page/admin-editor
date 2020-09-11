import { Http } from 'esc-ui'
import { Message, Loading } from 'element-ui'
import { ElLoadingComponent } from 'element-ui/types/loading'

const loadingMethods: {
  self: ElLoadingComponent | null
  open: () => void
  close: () => void
} = {
  self: null,
  open () {
    if (!this.self) {
      this.self = Loading.service({ background: 'transparent' })
    }
  },
  close () {
    if (this.self) {
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
      export: '/butterfly/component/export/:type',
      download: '/butterfly/component/download/:type',
      delete: '/butterfly/component/delete/:type',
      umdSave: '/butterfly/umd-component',
      utilsSave: '/butterfly/utils-component'
    },
    project: {
      save: '/butterfly/project/:dir',
      get: '/butterfly/project/:dir',
      release: '/butterfly/project/release/:dir',
      copy: '/butterfly/project/copy/:dir',
      download: '/butterfly/project/download/:dir',
      'download-check': '/butterfly/project/download-check/:dir',
      lock: '/butterfly/project/lock/:dir',
      record: '/butterfly/project/record/:dir',
      pubSearch: '/butterfly/project/pub-search/:keyword'
    },
    delete: '/butterfly/delete/:type/:dir',
    login: {
      login: '/butterfly/login',
      user: '/butterfly/user',
      upload: '/butterfly/caiyun-file/upload'
    },
    suggest: {
      save: '/butterfly/suggest/save',
      get: '/butterfly/suggest/get'
    },
    folder: {
      save: '/butterfly/folder/save',
      del: '/butterfly/folder/delete',
      get: '/butterfly/folder/get'
    },
    list: '/butterfly/list',
    search: '/butterfly/search'
  },
  notify: {
    success: Message.success,
    error: Message.error
  },
  loadingMethods,
  contentType: 'application/json'
})
