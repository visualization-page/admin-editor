import { project } from '@/assets/project'
import { currentPage } from '@/assets/page'

export const blockList: any[] = [
  {
    label: 'constants',
    field: 'constant',
    getData: () => project
  },
  {
    label: 'utils',
    field: 'utils',
    getData: () => project
  },
  {
    label: '全局css',
    field: 'css',
    language: 'css',
    getData: () => project
  },
  {
    label: '初始化脚本',
    field: 'initScripts',
    getData: () => project
  },
  {
    label: '页面视图',
    field: 'state',
    getData: () => currentPage.value
  },
  {
    label: '页面方法',
    field: 'methods',
    getData: () => currentPage.value
  }
]
