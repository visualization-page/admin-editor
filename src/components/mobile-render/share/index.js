import Vue from 'vue'
import Index from './index.vue'

const Construct = Vue.extend(Index)
let fxInstance

export default (obj) => {
  return new Promise((resolve, reject) => {
    if (!fxInstance) {
      fxInstance = new Construct({
        el: document.createElement('div')
      })
      fxInstance.$on('close', () => {
        fxInstance.show = false
        // eslint-disable-next-line
        reject()
      })
      document.body.appendChild(fxInstance.$el)
    }
    fxInstance.show = true
    fxInstance.resolve = resolve
    fxInstance.reject = reject
    Object.assign(fxInstance, obj)
    return fxInstance
  })
}
