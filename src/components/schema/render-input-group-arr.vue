<template>
  <div class="render-input-group-arr">
    <el-button type="text" @click="handleAdd">添加环境</el-button>
    <div
      v-for="(item, i) in list"
      :key="i"
    >
      <div class="flex-center-between f12">
        <div class="flex">
          <span class="flex-shrink-0 c-666 mr10">环境名称</span>
          <el-input type="input" v-model="item.name" placeholder="请输入" />
        </div>
        <el-button type="text" @click="handleDel(i)">删除</el-button>
      </div>
      <input-group
        label="添加键值对"
        :schema="item"
        :schema-data="item"
        @change="v => handleKvChange(v, i)"
      />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from '@vue/composition-api'
// @ts-ignore
import InputGroup from './render-input-group.vue'
import { getParentRef, deepClone } from '@/assets/util'
import { MessageBox } from 'element-ui'

export default defineComponent({
  components: {
    InputGroup
  },
  data () {
    return {
      list: [],
      updated: false
    }
  },
  props: {
    schema: Object,
    schemaData: Object
  },
  watch: {
    schemaData: {
      handler (val) {
        const { pref, field } = getParentRef(this.schema.field, val)
        if (pref[field]) {
          this.list = deepClone(pref[field])
        }
      },
      deep: true
    }
  },
  created () {
  },
  methods: {
    handleAdd () {
      // @ts-ignore
      this.list.push({
        name: '发布环境2套',
        field: 'kv',
        kv: {
          baseUrl: '',
          publicPath: './'
        }
      })
    },
    handleKvChange (val, i) {
      // console.log('handleKvChange', val, i, this.list[i])
      // @ts-ignore
      this.list[i].kv = val
      // console.log('handleKvChange', this.list.length)
      this.$emit('change', deepClone(this.list))
    },
    async handleDel (i) {
      await MessageBox.confirm('确定要删除吗')
      this.list.splice(i, 1)
      this.$emit('change', deepClone(this.list))
    }
  }
})
</script>
