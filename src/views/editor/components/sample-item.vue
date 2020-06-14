<template>
  <div class="flex flex-wrap" @click.stop="">
    <div
      v-for="item in list"
      :key="item.id"
      class="mr10 flex-shrink-0 break mb10"
      style="max-width: 30%"
      :style="{
        border: active(item) ? '1px solid rgba(64, 158, 255, 0.2)' : '1px #eee solid',
        color: active(item) ? 'rgba(64, 158, 255, 1)' : '#666',
        background: type === 'img' && (active(item) ? 'rgba(64, 158, 255, 0.1)' : '')
      }"
      @click="handleSelect(item)"
    >
      <template v-if="type === 'text'">
        <div
          class="flex-center-between plr10 ptb5"
          :style="{
            background: active(item) ? 'rgba(64, 158, 255, 0.1)' : '#f7f8f9',
          }"
        >
          <span class="mr10">{{ item.title }}</span>
          <i class="el-icon-edit cp" @click="$emit('edit')"></i>
        </div>
        <div class="p10">
          <div class="th2">
            <span>{{ item.props.bindState || item.props.content }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="pt5">
          <Photo
            :src="item.props.src"
            :width="200"
            :height="100"
          />
          <p class="tc ptb5">{{ item.title }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Photo } from 'esc-ui'
import { currentNode, setCurrentNode } from '@/assets/node'

export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    type: String
  },
  components: {
    Photo
  },
  methods: {
    active (item) {
      return currentNode.value && currentNode.value.id === item.id
    },
    handleSelect (item) {
      setCurrentNode(item)
    }
  }
}
</script>
