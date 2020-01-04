import Vue from 'vue'
import Composition, { reactive, ref, watch } from '@vue/composition-api'
Vue.use(Composition)

export const project = reactive({
  id: 1,
  desc: '',
  dir: '',
  thumbCover: '',
  interactiveType: 'long-page',
  httpOptions: {
    baseUrl: '',
    contentType: 'application/json',
    urlMap: {
      test: '/path/to/get'
    }
  },
  url: '',
  pages: []
})

export const updateProject = (obj: typeof project) => {
  Object.keys(obj).forEach(key => {
    // @ts-ignore
    if (project[key] !== undefined && project[key] !== obj[key]) {
      // @ts-ignore
      project[key] = obj[key]
    } else {
      // @ts-ignore
      Vue.set(project, key, obj[key])
    }
  })
}

watch(() => project, val => {
  console.log(val)
}, { lazy: true, deep: true })
