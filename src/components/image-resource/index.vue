<template>
  <transition name="el-zoom-in-center">
    <div v-show="show" class="image-resource">
      <div
        class="absolute r0 t0 w50 h50 flex-center f24 bg-666 cp"
        @click="$emit('update:show', false)"
      >
        <i class="el-icon-close"></i>
      </div>

      <p class="tc f20 c-fff pt20">{{ currentImage && currentImage.title ? currentImage.title : '查看图片资源' }}</p>
      <div class="image-resource__center">
        <div class="image-resource__img flex-center">
          <img
            v-if="currentImage"
            :src="currentImage.url"
            style="max-width: 100%;max-height: 100%"
          >
        </div>
        <div class="h50 tc">
          <el-button
            v-if="currentImage && currentImage.url"
            class="mt10"
            type="warning"
            @click="handleFocus"
          >
            定位到图片节点
          </el-button>
        </div>
        <div class="tc">
          <template
            v-for="page in list"
          >
            <div
              v-if="page.images && page.images.length"
              class="dib-middle"
              :key="page.id"
            >
              <photo
                v-for="node in page.images"
                :key="node.id"
                class="image-resource__img--item cp dib-middle mr10"
                :class="{
                  active: currentImage && currentImage.id === node.id
                }"
                :width="80"
                :height="80"
                :src="node.url"
                @click.native="selected = { ...node, pageId: page.id }"
              />
              <p class="tc f12 c-fff th1" :style="{ width: '80px' }">{{ page.title || page.id }}</p>
            </div>
          </template>
        </div>
      </div>

      <div
        v-if="loading || !list.length || (currentImage && !currentImage.url)"
        class="tc absolute-center c-eee"
      >
        <i class="el-icon-shopping-cart-2" style="font-size: 70px"></i>
        <p class="pt15 f16">{{ loading ? ' 搜集项目图片中...' : '项目还没有添加图片资源' }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { watch, ref, computed } from '@vue/composition-api'
import { project } from '@/assets/project'
import { setCurrentPage, currentPage } from '@/assets/page'
import { currentNode, setCurrentNode } from '@/assets/node'
import { Photo } from 'esc-ui'
import { setTabName, tabName } from '@/assets/tab'
import { findNode } from '@/components/mobile-render/render/utils'

function findPageImageNodes (nodes, result) {
  nodes.forEach(node => {
    if (node.type === 'img' && node.props.src) {
      result.push({
        id: node.id,
        url: node.props.src,
        title: node.title
      })
    }
    if (node.children.length) {
      findPageImageNodes(node.children, result)
    }
  })
}

export default {
  props: {
    show: Boolean
  },
  components: {
    Photo
  },
  setup (p, ctx) {
    const list = ref([])
    const loading = ref(false)
    const selected = ref(null)
    const currentImage = computed(() => {
      if (selected.value) {
        return selected.value
      } else if (currentNode.value && currentNode.value.type === 'img') {
        const { id, title, props } = currentNode.value
        return {
          id,
          title,
          url: props.src,
          pageId: currentPage.value.id
        }
      } else if (list.value.length) {
        const first = list.value[0].images[0]
        return {
          ...first,
          pageId: list.value[0].id
        }
      }
    })
    watch(() => p.show, show => {
      if (show) {
        loading.value = true
        // 便利收集所有的图片节点
        const pages = project.pages
        // [{ id, title, images: [ url, label, id ] }]
        const result = []
        if (pages) {
          pages.forEach(page => {
            const images = []
            findPageImageNodes(page.nodes, images)
            result.push({
              id: page.id,
              title: page.title,
              images
            })
          })
          list.value = result
        }
        loading.value = false
      }
    })
    // watch(() => currentNode.value, node => {
    //   console.log('====', node)
    // }, { lazy: true })
    return {
      loading,
      list,
      currentImage,
      selected,
      handleFocus () {
        let page = currentPage.value
        if (!currentPage.value || currentPage.value.id !== currentImage.value.pageId) {
          page = project.pages.find(x => x.id === currentImage.value.pageId)
          setCurrentPage(page)
        }
        if (
          page &&
          (!currentNode.value || currentNode.value.id !== currentImage.value.id)
        ) {
          // 在原有的 node-property 中，切换页面会重置当前选中的节点
          // 在下一个 task 中执行
          setTimeout(() => {
            const node = findNode(page.nodes, currentImage.value.id)
            setCurrentNode(node)
            setTabName([tabName.nodeTree, '', tabName.nodeProperty])
          })
        }
        ctx.emit('update:show', false)
      }
    }
  }
}
</script>

<style lang="less">
.image-resource {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .8);
  z-index: 1000;
  &__center {
    width: 1000px;
    height: e('calc(100% - 80px)');
    // background-color: #fff;
    margin: 10px auto;
  }
  &__img {
    height: e('calc(100% - 150px)');
    &--item {
      border: 3px transparent solid;
      &.active {
        border-color: #e6a23c;
      }
    }
  }
}
</style>
