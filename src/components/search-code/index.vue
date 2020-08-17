<template>
  <transition name="el-fade-in">
    <div v-show="show" class="search-wrap" @click.stop="">
      <div class="search-wrap__input">
        <i class="el-icon-search" />
        <input ref="input" v-model="content" type="text" placeholder="搜索代码" >
      </div>
      <div class="search-wrap__result" v-if="result.length">
        <div class="search-wrap__result-left">
          <div
            v-for="(it, i) in result"
            :key="i"
            class="search-wrap__result-item"
            :class="{
              active: resultSelect.index === it.index
            }"
            @click="resultSelect = it"
            @dblclick="handleDoubleClick(it)"
          >
            {{ it.text }}
          </div>
        </div>
        <div v-show="resultSelect" class="search-wrap__result-right">
          <pre v-for="(it, i) in resultSelect.code" :key="i" v-html="`<span style=color:#e6a23c>搜索结果(${i + 1})</span>\n${it}`" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { project } from '@/assets/project'
import { FormEvent } from '@/assets/event'
import { Page, setCurrentPage } from '@/assets/page'
import { NodeItem, setCurrentNode, findNode } from '@/assets/node'
import { setTabName, tabName, hideComponent } from '@/assets/tab'
import { basicSchemaMap } from '@/components/basic-components'

type Item = {
  text: string
  code: string[]
  type: 'project' | 'page' | 'node'
  index: number
  pageId?: string
  nodeId?: string
  isEvent?: boolean
  isStyle?: boolean
}

const content = ref('')
const result = ref<Array<Item>>([])
const resultSelect = ref<Item>()
function findStringIndex (str: string | null, val: string) {
  const indexArr: number[] = []
  if (typeof str !== 'string') {
    return indexArr
  }
  let i = -1
  let preLen = 0
  while ((i = str.indexOf(val)) > -1) {
    const len = str.substr(0, i + 1).length
    str = str.substr(i + 1)
    indexArr.push(i + preLen)
    preLen += len
  }
  return indexArr
}
function html2Escape (sHtml: string) {
  const m: any = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;'
  }
  return sHtml.replace(/[<>&"]/g, function (c) {
    return m[c]
  })
}
function getStringByIndexArr (str: string, val: string, arr: number[]) {
  return arr.map(index => {
    const pre = str.substring(index - 50 > 0 ? index - 50 : 0, index)
    const after = html2Escape(str.substring(index, index + 50)).replace(val, `<span style="color:red">${val}</span>`)
    return html2Escape(pre) + after
  })
}
function doSearch (val: string) {
  result.value = []
  if (!val.trim()) {
    return
  }
  // 定义搜索的字段
  const projectField = [['css', '全局css'], ['utils', '全局utils'], ['initScript', '初始化脚本'], ['constant', '全局constant']]
  const pageField = [['state', '视图模型'], ['methods', '页面方法'], ['events', '事件管理'], ['className', 'class']]
  const nodeField = [['className', 'class'], ['vShow', 'v-show'], ['vIf', 'v-if'], ['events', '事件管理'], ['style', '样式'], ['renderString', 'render']]
  let index = 0
  _add(projectField, 'project', project, (k) => {
    return {
      text: `项目设置 - ${k}`
    }
  })
  project.pages.forEach(page => {
    _add(pageField, 'page', page, (k, evDesc) => {
      return {
        text: `【页面：${page.title || page.id}】-【属性：${k}】${evDesc ? ` - ${evDesc}` : ''}`,
        pageId: page.id
      }
    })
    page.nodes.forEach(node => _deepFind(page, node))
  })
  function _deepFind (page: Page, node: NodeItem) {
    _add(nodeField, 'node', node, (k, evDesc) => {
      return {
        text: `【页面：${page.title || page.id}】-【节点：${node.title}】-【属性：${k}】${evDesc ? ` - ${evDesc}` : ''}`,
        pageId: page.id,
        nodeId: node.id
      }
    })
    if (node.children && node.children.length) {
      node.children.forEach(nodeC => _deepFind(page, nodeC))
    }
  }
  function _add (
    fieldArr: string[][],
    type: Item['type'],
    target: { [k: string]: any },
    rest: (k: string, evDesc?: string) => { text: string, pageId?: string, nodeId?: string }
  ) {
    const newArr = [...fieldArr]
    if (type === 'node') {
      let schema = []
      if (target.nodeType === 1 << 0) {
        const winSchema = target.name && window[target.name] && window[target.name].schema
        // @ts-ignore
        schema = winSchema || basicSchemaMap[target.subType || target.type]
        if (schema) {
          schema.forEach((x: { label: string, field: string }) => {
            const key = x.field.split('.').pop()
            if (newArr.every(y => y[1] !== key)) {
              newArr.push([key!, x.label, 'props'])
            }
          })
        }
      }
    }
    // console.log(newArr.length)
    newArr.forEach(arr => {
      const k = arr[0]
      // @ts-ignore
      let v = target[k]
      if (arr[2] === 'props' && target.props) {
        v = target.props[k]
      }
      if (k === 'events') {
        v.forEach((ev: FormEvent) => {
          const indexArr = ev.fxCode ? findStringIndex(ev.fxCode, val) : []
          if (indexArr && indexArr.length) {
            index += 1
            result.value.push({
              type,
              code: getStringByIndexArr(ev.fxCode, val, indexArr),
              index,
              isEvent: true,
              ...rest(arr[1], ev.desc)
            })
          }
        })
      } else if (k === 'style') {
        const indexArr = v.code ? findStringIndex(v.code, val) : []
        if (indexArr && indexArr.length) {
          index += 1
          result.value.push({
            type,
            code: getStringByIndexArr(v.code, val, indexArr),
            index,
            isStyle: true,
            ...rest(arr[1], '样式补充')
          })
        }
      } else {
        const indexArr = v ? findStringIndex(v, val) : []
        if (indexArr && indexArr.length) {
          index += 1
          result.value.push({
            type,
            code: getStringByIndexArr(v, val, indexArr),
            index,
            ...rest(arr[1])
          })
        }
      }
    })
  }
  resultSelect.value = result.value[0]
}

export default defineComponent({
  props: {
    show: Boolean
  },
  setup (props, ctx) {
    document.addEventListener('click', (e) => {
      if (!(e.target as HTMLDivElement).getAttribute('data-target')) {
        ctx.emit('update:show', false)
      }
    })

    let timer = 0
    watch(() => content.value, val => {
      if (timer) {
        clearTimeout(timer)
        timer = 0
      }
      timer = setTimeout(() => {
        doSearch(val)
      }, 1000)
    }, { lazy: true })
    watch(() => props.show, val => {
      if (val) {
        (ctx.refs.input as HTMLInputElement).focus()
        doSearch(content.value)
      }
    }, { lazy: true })

    return {
      project,
      content,
      result,
      resultSelect
    }
  },

  methods: {
    handleDoubleClick (it: Item) {
      if (!it.pageId && !it.nodeId) {
        setTabName([tabName.projectSet])
      }
      if (it.pageId) {
        const page = project.pages.find(x => x.id === it.pageId)
        if (page) {
          setCurrentPage(page)
        }
        if (it.nodeId) {
          setTabName([tabName.nodeTree, '', tabName.nodeProperty, '', tabName.pageSetTree, tabName.nodeSetProperty])
          this.$nextTick().then(() => {
            const res = findNode(it.nodeId!, page!.nodes)
            res && setCurrentNode(res.data)
            if (it.isStyle) {
              // 定位到样式 tab
              setTabName(['', '', tabName.nodeStyle, '', '', tabName.nodeSetStyle])
            }
          })
        } else {
          setTabName([tabName.pageList, '', tabName.pageSet, '', tabName.pageSetProperty])
        }
      }
      hideComponent(true)
      this.$emit('update:show', false)
    }
  }
})
</script>

<style lang="less">
.search-wrap {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 5px rgba(0,0,0,.5);
  background: rgba(0,0,0,.7);
  border-radius: 7px;
  padding: 7px 10px;
  border: 1px #ccc solid;
  z-index: 10;
  &__input {
    white-space: nowrap;
    i {
      font-size: 28px;
      color: #fff;
      margin-right: 10px;
    }
    input {
      width: 40vw;
      height: 45px;
      border: none;
      background: transparent;
      font-size: 24px;
      color: #fff;
      &:focus {
        outline: none;
      }
    }
  }
  &__result {
    display: flex;
    height: 50vh;
    color: #f2f2f2;
    user-select: none;
    border-top: 1px #999 solid;
    margin-top: 7px;
    &-left {
      width: 50%;
      height: 100%;
      overflow: auto;
      border-right: 1px #666 solid;
    }
    &-item {
      // line-height: 30px;
      cursor: pointer;
      padding: 10px;
      border-bottom: 1px #999 dashed;
      &.active,
      &:hover {
        background: #666;
      }
    }
    &-right {
      width: 50%;
      height: 100%;
      padding: 0 10px;
      overflow: auto;
      pre {
        white-space: pre-wrap;
        color: #fff;
      }
    }
  }
}
</style>
