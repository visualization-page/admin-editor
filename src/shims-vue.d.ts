declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '@xm/native' {
  export default class Native {
    name: string | null
    cookie: (name: string) => string | null
  }
}
