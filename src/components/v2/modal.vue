<template>
  <transition name="el-zoom-in-bottom">
    <div
      v-if="show"
      class="editor-v2__code-editor"
    >
      <div class="editor-v2__code-editor-header flex-center-between">
        <img src="@/assets/img/logo_small.png" alt="" width="160px">
        <span class="f14 c-aaa">{{ title }}</span>
        <div class="mr15 flex-center" style="line-height: 17px">
          <div
            v-if="btns[1]"
            class="p10 cp c-main mr10 f14"
            @click="$emit('update:show', false),$emit('cancel')"
          >
            {{ btns[1] }}
          </div>
          <div class="bf-btn" @click="$emit('update:show', false),$emit('confirm')">
            <div class="bf-btn__container">
              {{ btns[0] }}
            </div>
          </div>
        </div>
      </div>
      <div class="oa" style="height: calc(100vh - 50px);background:#1e1e1e">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: Boolean,
    title: String,
    btns: {
      type: Array,
      default () {
        return ['保存', '取消']
      }
    }
  }
}
</script>
