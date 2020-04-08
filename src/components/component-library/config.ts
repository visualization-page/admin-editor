const treeData = [
  // {
  //   label: 'esc-ui',
  //   children: [
  //     'Dialog',
  //     'Button',
  //     'Toast',
  //     'Empty',
  //     'Skeleton'
  //   ]
  // },
  {
    label: 'vant',
    children: [
      'VanButton',
      'VanField',
      'VanCell',
      'VanIcon',
      'VanImage',
      'VanStyle',
      'VanCalendar',
      'VanCheckbox',
      'VanDatetimePicker',
      'VanPicker',
      'VanSearch',
      'VanSwitch',
      'VanUploader',
      'VanActionSheet',
      'VanDropdownMenu',
      'VanSwipeCell',
      'VanCollapse',
      'VanCountDown',
      'VanDivider',
      'VanImagePreview',
      'VanList',
      'VanNoticeBar',
      'VanProgress',
      'VanSkeleton',
      'VanSwipe',
      'VanGrid',
      'VanTabs',
      'VanTabbar'
    ]
  }
]

export const getTreeData = () => treeData.map(x => {
  return {
    ...x,
    children: x.children.map(y => ({ label: y, library: x.label, id: `${x.label}-${y}` }))
  }
})
