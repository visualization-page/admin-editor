import { ref, reactive } from '@vue/composition-api'

export const isEdit = ref(false)
export function setState (type: boolean) {
  isEdit.value = type
}
type CurrCode = {
  title: string
  code: string
  update: (code: string) => void | false
  language: 'javascript' | 'css'
}
export const currentCode = reactive<CurrCode>({
  title: '',
  code: '',
  language: 'javascript',
  update (code) {}
})

export const setCodeState = (
  title: string,
  code: string,
  update: (code: string) => void,
  language: CurrCode['language'] = 'javascript') => {
  currentCode.title = title
  currentCode.code = code
  currentCode.language = language
  currentCode.update = update
  setState(true)
}
