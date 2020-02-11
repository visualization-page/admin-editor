import Vue from 'vue'
import Composition, { reactive, watch } from '@vue/composition-api'
// import { updateByField } from './util'
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
  pages: [],
  constant: '(function () {\n  return {\n    test: \'test\'\n  }\n})()'
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
    // updateByField(project, key, obj[key])
  })
}

export const exportProjectLocal = () => {
  localStorage.setItem('local', JSON.stringify(project))
}

export const importProjectLocal = () => {
  const item = localStorage.getItem('local')
  if (item) {
    updateProject(JSON.parse(item))
  }
}

importProjectLocal()

watch(() => project, val => {
  console.log(val)
}, { lazy: true, deep: true })
