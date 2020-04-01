import { ref, reactive } from '@vue/composition-api'

export const isEdit = ref(false)
export function setState (type: boolean) {
  isEdit.value = type
}

export const currentCode = reactive<{ title: string, code: string, update:(code: string) => void }>({
  title: '',
  code: '',
  update (code) {}
})

export const setCodeState = (title: string, code: string, update: (code: string) => void) => {
  currentCode.title = title
  currentCode.code = code
  currentCode.update = update
  setState(true)
}
