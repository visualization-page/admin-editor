<template>
  <div class="render-input-bind flex">
    <m-input
      :value="value"
      :item="item"
      @input="val => $emit('input', val)"
    />
    <div class="w40 ml10 bd bd-eee flex-center br3 cp" @click="handleShow">
      <i class="el-icon-thumb" />
    </div>

    <el-dialog
      :visible.sync="show"
      title="选择页面状态"
      width="400px"
    >
      <div
        v-for="(it, i) in stateKeys"
        :key="i"
        class="flex-center-between bd bb bd-eee cp"
        @click="handleSelect(it)"
      >
        <span class="">{{ it }}</span>
        <div v-if="false">
          <el-button type="text">控件1</el-button>
          <el-button type="text">控件1</el-button>
        </div>
      </div>
      <div v-if="!stateKeys.length" class="flex-center c-999 pt20">该页面无视图状态可供选择</div>
    </el-dialog>
  </div>
</template>

<script>
import Input from './input.vue'
import { currentPage } from '@/assets/page'
import { parseCodeValid } from '@/assets/util'

export default {
  components: {
    MInput: Input
  },
  props: {
    value: String,
    item: Object
  },
  data () {
    return {
      show: false,
      stateKeys: []
    }
  },
  methods: {
    handleShow () {
      this.show = true
      if (currentPage.value) {
        const { ok, value } = parseCodeValid(currentPage.value.state)
        if (ok) {
          this.stateKeys = Object.keys(value)
        }
      }
    },
    handleSelect (val) {
      this.show = false
      this.$emit('input', `$$page.state.${val}`)
    }
  }
}
</script>
