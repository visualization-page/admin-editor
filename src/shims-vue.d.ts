declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '@xm/native' {
  export default class Native {
    name: string | null
    uid: string | null
    orgId: string
    cookie: (name: string) => string | null
    menuCallJs: (name: string, cb: () => void) => void
    noMenu: () => void
  }
}
