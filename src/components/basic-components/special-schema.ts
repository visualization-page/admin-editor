import { specialSchema as div } from './div'

export const getSpecialByType = (type?: 'div' | 'img') => {
  switch (type) {
    case 'div':
      return div
    default:
      return []
  }
}
