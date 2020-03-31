const treeData = [
  {
    label: 'esc-ui',
    children: [
      'Dialog',
      'Button',
      'Toast',
      'Empty',
      'Skeleton'
    ]
  },
  {
    label: 'vant',
    children: [
      'Cell',
      'Checkbox',
      'DatetimePicker',
      'Icon'
    ]
  }
]

export const getTreeData = () => treeData.map(x => {
  return {
    ...x,
    children: x.children.map(y => ({ label: y, library: x.label, id: `${x.label}-${y}` }))
  }
})
