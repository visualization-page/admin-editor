import { Http } from 'esc-ui'

export const http = new Http({
  baseUrl: 'http://localhost:3000',
  urlMap: {
    component: {
      list: '/butterfly/component/:type',
      update: '/butterfly/component/:type'
    }
  },
  contentType: 'application/json'
})
