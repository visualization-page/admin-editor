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
    label: '背景颜色',
    field: 'style.backgroundColor',
    type: 'color'
  },
  {
    label: '背景图片',
    field: 'style.backgroundImage',
    type: 'input',
    placeholder: '请输入图片地址'
  },
  {
    label: '背景位置',
    field: 'style.backgroundPosition',
    type: 'select',
    options: [
      { label: 'center', value: 'center' },
      { label: 'left top', value: 'left top' },
      { label: 'left center', value: 'left center' }
    ],
    props: {
      filterable: true,
      'allow-create': true,
      clearable: true
    }
  },
  {
    label: '背景尺寸',
    field: 'style.backgroundSize',
    type: 'select',
    options: [
      { label: 'cover', value: 'cover' },
      { label: 'contain', value: 'contain' },
      { label: '100%', value: '100%' },
      { label: '100% 100%', value: '100% 100%' }
    ],
    props: {
      filterable: true,
      'allow-create': true,
      clearable: true
    }
  },
  {
    label: '背景重复',
    field: 'style.backgroundRepeat',
    type: 'select',
    options: [
      { label: 'no-repeat', value: 'no-repeat' },
      { label: 'repeat-x', value: 'repeat-x' },
      { label: 'repeat-y', value: 'repeat-y' }
    ],
    props: {
      filterable: true,
      'allow-create': true,
      clearable: true
    }
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
  },
  {
    label: '样式补充',
    field: 'style.code',
    type: 'code'
  }
]
