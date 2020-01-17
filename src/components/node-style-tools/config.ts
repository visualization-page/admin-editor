export type Item = {
  id: number
  title: string
  icon: string
}

export default [
  {
    id: 1,
    title: '上对齐',
    icon: 'icon-align-top'
  },
  {
    id: 2,
    title: '右对齐',
    icon: 'icon-align-right'
  },
  {
    id: 3,
    title: '下对齐',
    icon: 'icon-align-bottom'
  },
  {
    id: 5,
    title: '垂直居中',
    icon: 'icon-align-center'
  },
  {
    id: 4,
    title: '左对齐',
    icon: 'icon-align-left'
  },
  {
    id: 6,
    title: '水平居中',
    icon: 'icon-align-middle'
  },
  {
    id: 7,
    title: '横向填充',
    icon: 'icon-full-width'
  },
  {
    id: 8,
    title: '横向1/2填充',
    icon: 'icon-half-width'
  },
  {
    id: 9,
    title: '纵向填充',
    icon: 'icon-full-height'
  },
  {
    id: 10,
    title: '纵向1/2填充',
    icon: 'icon-half-height'
  }
]

export const handleCenter = (cls: string, targetCls: string) => {
  const clsArr = cls.split(' ')
  const centerIndex = clsArr.findIndex(x => x === 'center')
  const centerHIndex = clsArr.findIndex(x => x === 'center-h')
  const centerVIndex = clsArr.findIndex(x => x === 'center-v')
  if (centerIndex > -1) {
    clsArr.splice(centerIndex, 1)
    clsArr.push(targetCls)
  } else if (targetCls === 'center-v') {
    if (centerHIndex > -1) {
      clsArr.splice(centerHIndex, 1)
      clsArr.push('center')
    } else if (centerVIndex === -1) {
      clsArr.push(targetCls)
    }
  } else if (targetCls === 'center-h') {
    if (centerVIndex > -1) {
      clsArr.splice(centerVIndex, 1)
      clsArr.push('center')
    } else if (centerHIndex === -1) {
      clsArr.push(targetCls)
    }
  }
  return clsArr.join(' ')
}

export const removeCenter = (cls: string) => {
  const clsArr = cls.split(' ')
  const centerIndex = clsArr.findIndex(x => x === 'center')
  const centerHIndex = clsArr.findIndex(x => x === 'center-h')
  const centerVIndex = clsArr.findIndex(x => x === 'center-v')
  if (centerIndex > -1) {
    clsArr.splice(centerIndex, 1)
  }
  if (centerHIndex > -1) {
    clsArr.splice(centerHIndex, 1)
  }
  if (centerVIndex > -1) {
    clsArr.splice(centerVIndex, 1)
  }
  return clsArr.join(' ')
}
