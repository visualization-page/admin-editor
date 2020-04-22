export type Item = {
  id: number
  title: string
  icon: string
  class: string
}

const items = [
  {
    id: 11,
    title: '内容居中',
    icon: 'el-icon-rank f16',
    class: 'flex-center',
    elementUi: true
  },
  {
    id: 1,
    title: '内容两头水平居中',
    icon: 'el-icon-c-scale-to-original f16',
    class: 'flex-center-between',
    elementUi: true
  },
  {
    id: 5,
    title: '内容垂直居中',
    icon: 'icon-align-center',
    class: 'flex-center-align'
  },
  {
    id: 6,
    title: '内容水平居中',
    icon: 'icon-align-middle',
    class: 'flex-center-justify'
  },
  {
    id: 7,
    title: '横向填充',
    icon: 'icon-full-width',
    class: 'width-100'
  },
  {
    id: 8,
    title: '横向1/2填充',
    icon: 'icon-half-width',
    class: 'width-50'
  },
  {
    id: 9,
    title: '纵向填充',
    icon: 'icon-full-height',
    class: 'height-100'
  },
  {
    id: 10,
    title: '纵向1/2填充',
    icon: 'icon-half-height',
    class: 'height-50'
  }
]
const itemsFixed = items.concat([
  {
    id: 101,
    title: '居中',
    icon: 'el-icon-rank f16',
    class: 'absolute-center',
    elementUi: true
  },
  {
    id: 50,
    title: '垂直居中',
    icon: 'icon-align-center',
    class: 'absolute-center-v'
  },
  {
    id: 60,
    title: '水平居中',
    icon: 'icon-align-middle',
    class: 'absolute-center-h'
  },
  {
    id: 10,
    title: '上对齐',
    icon: 'icon-align-top',
    class: 't0'
  },
  {
    id: 20,
    title: '右对齐',
    icon: 'icon-align-right',
    class: 'r0'
  },
  {
    id: 30,
    title: '下对齐',
    icon: 'icon-align-bottom',
    class: 'b0'
  },
  {
    id: 40,
    title: '左对齐',
    icon: 'icon-align-left',
    class: 'l0'
  }
])
export default (fixed: boolean = true) => fixed ? itemsFixed : items

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
