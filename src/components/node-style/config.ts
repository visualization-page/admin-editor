export default [
  {
    label: '宽度',
    field: 'style.width',
    type: 'unit-size'
  },
  {
    label: '高度',
    field: 'style.height',
    type: 'unit-size'
  },
  {
    label: '脱离文档流',
    field: 'style.positionType',
    type: 'select',
    options: [
      { label: 'absolute', value: 'absolute' },
      { label: 'fixed', value: 'fixed' }
    ],
    relation: [
      {
        field: 'outDocFlow',
        value: true
      }
    ]
  },
  {
    label: '位置',
    field: 'style.position',
    type: 'direction-size',
    relation: [
      {
        field: 'outDocFlow',
        value: true
      }
    ]
  },
  {
    label: '外边距',
    field: 'style.margin',
    type: 'direction-size'
  },
  {
    label: '内边距',
    field: 'style.padding',
    type: 'direction-size'
  },
  {
    label: '背景',
    field: 'style.background',
    type: 'background'
  },
  {
    label: '边框',
    field: 'style.border',
    type: 'direction-size'
  },
  {
    label: '边框样式',
    field: 'style.borderStyle',
    type: 'select',
    options: [
      { label: '实现', value: 'solid' },
      { label: '虚线', value: 'dashed' },
      { label: '小圆点', value: 'dotted' }
    ]
  },
  {
    label: '边框颜色',
    field: 'style.borderColor',
    type: 'color'
  },
  {
    label: '圆角',
    field: 'style.borderRadius',
    type: 'slider'
  }
]
