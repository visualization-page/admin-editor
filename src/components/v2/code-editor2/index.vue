<template>
  <div
    v-if="isEditNew"
    class="editor-v3__code-editor flex-grow-1 f14 relative"
  >
    <div class="flex justify-between mb10">
      <p>
        <i class="el-icon-edit mr10" />
        <span>代码编辑</span>
      </p>
      <div class="bf-btn" @click="handleCancel()">
        <div class="bf-btn__container" style="background-color: #f2f2f2;">
          退出编辑
        </div>
      </div>
    </div>
    <transition name="el-fade-in">
      <div
        v-if="canMountAfterLoading"
        class="absolute r0 b0 tc c-ccc f14 pt50 z1000"
        style="top: 70px;left:200px;background-color: #1e1e1e"
      >
        <span>代码准备中...</span>
      </div>
    </transition>
    <div class="flex" style="height: calc(100% - 40px)">
      <div class="editor-v3__code-editor--left bg-fff flex-shrink-0 height-100 oa plr15 pb50">
        <left-block title="可编辑的代码块" @on-refresh="handleCollectionBlock()">
          <i class="el-icon-refresh" slot="right" />
          <div
            v-for="(item, i) in editBlockList"
            :key="i"
            class="f12 ptb5 cp hover-main c-999"
            @click="handleOpenCodeBlock(item)"
          >
            <i class="el-icon-edit c-main mr5" />
            <span>{{ item.label }}</span>
          </div>
          <el-tree
            :data="codeRenderNotice.nodes"
            :expand-on-click-node="false"
            @node-click="handleOpenCodeBlock"
          >
            <div class="flex-center-between f12 ptb5 c-999 flex-grow-1" slot-scope="{ data }">
              <span>
                <i v-if="data.title.startsWith('页面事件')" class="el-icon-edit c-main mr5" />
                <span>{{ data.title }}</span>
              </span>
              <a
                v-if="data.events && data.events.length"
                href="javascript:;"
                style="color: #3b8ff6"
                @click.stop="handleOpenCodeBlock(data.events[0])"
              >
                {{ data.events[0].title.split(' ')[1] }}
              </a>
            </div>
          </el-tree>
        </left-block>
        <left-block title="快捷引用页面级">
          <el-tree
            :data="codeRenderNotice.state"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          />
          <div
            v-for="(item, i) in codeRenderNotice.methods"
            :key="i"
            class="f12 cp c-aaa c-main-hover"
            style="line-height: 18px"
            @click="handleClickFx({ code: `$$page.methods${item.value}()` })"
          >
            <i class="bficon c-main icon-function" />
            <span class="ml5">{{ item.label }}</span>
          </div>
        </left-block>
        <left-block title="快捷引用内置的">
          <div
            v-for="(item, i) in varList"
            :key="i"
            class="f12 cp c-aaa c-main-hover th1 ptb5"
            style="line-height: 18px"
            @click="handleClickFx(item)"
          >
            <span class="">{{ item.name }}</span>
          </div>
          <div
            v-for="(item, i) in fxList"
            :key="i"
            class="f12 cp c-aaa c-main-hover th1 ptb5"
            style="line-height: 18px"
            @click="handleClickFx(item)"
          >
            <i class="bficon c-main icon-function" />
            <span class="ml5">{{ item.name }}</span>
          </div>
        </left-block>
      </div>
      <div class="editor-v3__code-editor--right">
        <div class="plr20 ptb10 bg-333 c-fff f12">编辑 {{ currentCode.title }}</div>
        <monaco-editor
          v-if="canMount"
          :style="{ height: `${areaHeight - 190 - 37}px` }"
          :amdRequire="amdRequire"
          :value="code"
          :language="currentCode.language"
          :options="{
            fontSize: 12,
            showUnused: true,
            smoothScrolling: true,
            tabCompletion: 'on',
            tabSize: 2,
            formatOnPaste: true,
            detectIndentation: false
          }"
          theme="vs-dark"
          @change="handleCodeChange"
          @editorDidMount="handleMounted"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, onMounted, ref, watch, computed, reactive } from '@vue/composition-api'
// import { project } from '@/assets/project'
import { currentCode, isEditNew, setCodeState, setStateNew } from '@/assets/code-edit'
import { currentPage, Page } from '@/assets/page'
import { getDocHeight, parseCodeValid, updateByField } from '@/assets/util'
// import { MessageBox } from 'element-ui'
import { fxList, varList } from '@/assets/event'
import { NodeItem } from '@/assets/node'
import { initGlobalConfig } from '@/components/mobile-render/render/utils'
import LeftBlock from './left-block.vue'
import { blockList } from './config'

type Editor = {
  getPosition: any,
  executeEdits: any,
  setPosition: any,
  focus: any
}
type BlockItem = {
  label: string
  field: string
  getData: () => any
}
type ResItem = { label: string, value: string, children: ResItem[] }

export default createComponent({
  components: {
    LeftBlock
  },

  setup () {
    const areaHeight = ref(0)
    const code = ref('')
    // const isCodeValid = ref(true)
    const canMount = ref(false)
    const canMountAfterLoading = ref(false)
    const editor = ref<Editor>(null)
    const editBlockList = reactive<Array<BlockItem>>(blockList)
    const codeRenderNotice = ref<{ state: ResItem[], methods: ResItem[], nodes: any[] }>({
      state: [],
      methods: [],
      nodes: []
    })
    let codeChangeTimer = 0

    const handleCancel = () => {
      setStateNew(false)
    }
    // const handleConfirm = async (close = true) => {
    //   if (!isCodeValid.value) {
    //     await MessageBox.confirm('代码存在语法错误，不会保存错误的代码，是否继续？')
    //   }
    //   const updateRes = currentCode.update(code.value)
    //   if (updateRes !== false) {
    //     window.globalApp.$notify({
    //       title: '成功',
    //       message: `保存 ${currentCode.title}`,
    //       type: 'success',
    //       duration: 2000,
    //       position: 'top-left'
    //     })
    //     if (close) {
    //       handleCancel()
    //     }
    //   }
    // }
    const handleClickFx = (item: any) => {
      if (editor.value) {
        const position = editor.value.getPosition()
        editor.value.executeEdits('', [
          {
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            text: item.code
          }
        ])
        position.column += item.code.length
        editor.value.setPosition(position)
        editor.value.focus()
      }
    }
    const isObj = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj)
    const _df = (obj: any, path: string[], res: Array<ResItem>): any => {
      if (isObj(obj)) {
        Object.keys(obj).forEach((k: string) => {
          const item = { label: k, value: `${path.join('.')}.${k}`, children: [] }
          res.push(item)
          if (isObj(obj[k])) {
            path.push(k)
            _df(obj[k], path, item.children)
            path.pop()
          }
        })
      }
    }
    const _dfBy = (arr: any[], newArr: any = [], assert: any, cb: any) => {
      let flag = false
      for (let i = 0; i < arr.length; i++) {
        const tmp = cb(arr[i])
        let childrenFlag = false
        if (arr[i].children) {
          childrenFlag = _dfBy(arr[i].children, tmp.children, assert, cb)
        }
        if (assert(arr[i])) {
          flag = true
          newArr.push(tmp)
        } else if (childrenFlag) {
          flag = true
          newArr.push(tmp)
        }
      }
      return flag
    }
    const handleCollectionBlock = (page: Page | null = currentPage.value) => {
      if (page) {
        // 重置
        codeRenderNotice.value = {
          state: [],
          methods: [],
          nodes: []
        }
        const { state, methods, events, nodes } = page as Page
        const ctx = { $$page: { state: {}, methods: {} }, $$global: initGlobalConfig(page as Page) }
        // 解析视图
        const stateRes = parseCodeValid(state, ctx)
        if (stateRes.ok) {
          const result: Array<ResItem> = []
          _df(stateRes.value, [], result)
          codeRenderNotice.value.state = result
        }
        // 解析方法
        const methodsRes = parseCodeValid(methods, ctx)
        if (methodsRes.ok) {
          const result: Array<ResItem> = []
          _df(methodsRes.value, [], result)
          codeRenderNotice.value.methods = result
        }
        // 解析节点事件和自定义render
        events.forEach((item) => {
          codeRenderNotice.value.nodes.push({
            title: `页面事件 ${item.desc || item.eventType}`,
            fxCode: item.fxCode,
            self: item,
            field: 'fxCode',
            isBlockEvent: true
          })
        })
        const asserts = (node: NodeItem) => {
          return node.events.length || node.nodeType === 4
        }
        const dealItem = (node: NodeItem) => {
          const isBlockEvent = !!node.events.length
          const isSpa = node.nodeType === 4
          const res = {
            title: node.title,
            events: [],
            renderString: '',
            field: 'renderString',
            language: node.subType === 'spa' ? 'html' : undefined,
            children: [],
            self: isSpa ? node : null,
            isSpa
          }
          if (isBlockEvent) {
            res.events = node.events.map((x :any) => ({
              title: `${node.title} ${x.desc || x.eventType}`,
              fxCode: x.fxCode,
              self: x,
              field: 'fxCode',
              isBlockEvent
            }))
          }
          if (isSpa) {
            res.renderString = node.renderString
          }
          return res
        }
        _dfBy(nodes, codeRenderNotice.value.nodes, asserts, dealItem)
        // console.log('1111', codeRenderNotice.value.nodes)
        // handleOpenCodeBlock(editBlockList[0])
      }
    }
    const handleOpenCodeBlock = (item: any) => {
      if (item.isSpa !== undefined || item.isBlockEvent !== undefined) {
        // 节点编辑
        if (item.isSpa || item.isBlockEvent) {
          const update = (val: string) => {
            updateByField(item.self, item.field, val)
          }
          setCodeState(item.title, item.isSpa ? item.renderString : item.fxCode, update, item.language, true)
        }
      } else {
        const data = item.getData()
        setCodeState(item.label, data[item.field], (val: string) => { updateByField(data, item.field, val) }, item.language, true)
      }
    }

    watch(() => currentCode.code, (val: string) => {
      code.value = val
    })
    // 必须等到动画过完才能渲染编辑器
    watch(() => isEditNew.value, val => {
      if (val) {
        canMountAfterLoading.value = true
        // hide popover
        document.body.click()
        setTimeout(() => {
          canMount.value = true
        }, 500)
      } else {
        canMount.value = false
      }
    })
    watch(() => currentPage.value, (page) => { handleCollectionBlock(page) }, { lazy: true })

    onMounted(() => {
      areaHeight.value = getDocHeight()
    })

    return {
      areaHeight,
      code,
      canMount,
      canMountAfterLoading,
      isEditNew,
      currentCode,
      amdRequire: window.require,
      // hasLeftPanel: computed(() => currentCode.title !== '系统配置'),
      codeRenderNotice,
      fxList,
      varList,
      editBlockList,
      handleClickFx,
      handleNodeClick (data: any) {
        handleClickFx({ code: `$$page.state${data.value[0] === '.' ? '' : '.'}${data.value}` })
      },
      handleCancel,
      // handleConfirm,
      handleOpenCodeBlock,
      handleCollectionBlock,
      handleCodeChange (val: string) {
        code.value = val
        if (codeChangeTimer) {
          clearTimeout(codeChangeTimer)
          codeChangeTimer = 0
        }
        // 自动保存
        codeChangeTimer = setTimeout(() => {
          console.log(`auto save ${currentCode.title}`)
          currentCode.update(val)
        }, 500)
      },
      handleMounted (editorInstance: any) {
        editor.value = editorInstance
        canMountAfterLoading.value = false
        editorInstance.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_S, function () {
          // handleConfirm(false)
          currentCode.update(code.value)
        })
        editorInstance.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_D, function () {
          handleCancel()
        })
      }
    }
  }
})
</script>

<style lang="less">
.editor-v3 {
  .hover-main:hover {
    color: #ff7d00;
  }
  &__code-editor {
    // background: #262a30;
    &--left {
      width: 200px;
      // width: 20%;
      border-left: 2px #eee solid;
      // border-right: 2px #eee solid;
      .el-tree-node__content {
        .is-leaf {
          display: none;
        }
      }
    }
    &--right {
      //width: 80%;
      flex-grow: 1;
    }
    .el-tree {
      background: transparent;
      &__empty-block {
        min-height: 10px;
        text-align: left;
      }
      &__empty-text {
        position: static;
        font-size: 12px;
      }
    }
    .el-tree-node__label {
      font-size: 12px;
      color: #aaa;
      height: 20px;
    }
    .el-tree-node__content>.el-tree-node__expand-icon {
      padding: 0 3px;
    }
    .el-tree-node__content {
      background-color: transparent !important;
      &:hover {
        background-color: transparent;
        .el-tree-node__label {
          color: #ff7d00;
        }
      }
    }
  }
}
</style>
