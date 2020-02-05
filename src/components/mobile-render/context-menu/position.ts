import { reactive } from '@vue/composition-api'

export const contextPosition = reactive({
  top: 0,
  left: 0,
  show: false
})

export function setPosition (e: MouseEvent) {
  const { top, left } = document.querySelector('.app__mobile-webview')!.getBoundingClientRect()
  contextPosition.top = e.pageY - top
  contextPosition.left = e.pageX - left
  contextPosition.show = true
}

document.addEventListener('click', () => {
  contextPosition.show = false
})
