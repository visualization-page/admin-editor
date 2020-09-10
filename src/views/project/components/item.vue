<template>
  <div class="folder-item">
    <div class="folder-item__bg relative">
      <div class="tc pt30">
        <p v-if="false" class="f20" v-html="item.dirSearch || item.dir" />
        <p class="mlr20 mt10 c-666 f16" v-html="item.desc || '暂无描述'" />
        <p class="mlr20 mt10 c-666 f16">
          <i class="el-icon-user" />
          <span class="mr5" v-html="item.createUser" />
          <i class="el-icon-edit-outline" />
          <span>{{ item.info.userName }}</span>
        </p>
      </div>
      <div
        class="folder-item__record flex-center-between f14 plr15 cp"
        @click.stop="item.info.remark ? $emit('record', item) : ''"
      >
        <span>{{ item.info.time }}</span>
        <span>{{ item.info.remark || '-' }}</span>
      </div>
      <div v-if="item.lockedBy" class="folder-item__active flex-center f14 c-fff">{{ item.lockedBy }}编辑中</div>
    </div>
    <div class="folder-item__box absolute width-100 height-100 l0 t0 cp" @click="$emit('click', item)">
      <div class="folder-item__title flex-center">
        <div class="th1">
          <span class="f20" v-html="item.dirSearch || item.dir" />
        </div>
      </div>
      <div class="folder-item__content flex-center">
        <div class="pt10">
          <el-tooltip effect="dark" content="查看" placement="bottom">
            <i class="el-icon-monitor" @click.stop="$emit('open', item)"></i>
          </el-tooltip>
          <template v-if="isDev">
            <el-tooltip effect="dark" content="复制" placement="bottom">
              <i class="el-icon-document-copy" @click.stop="$emit('copy', item)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="下载" placement="bottom">
              <i class="el-icon-download" @click.stop="$emit('down', item)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="导出" placement="bottom">
              <i class="el-icon-takeaway-box" @click.stop="$emit('export', item)"></i>
            </el-tooltip>
          </template>
          <template v-if="hasPriv">
            <el-tooltip v-if="isDev" effect="dark" content="删除" placement="bottom">
              <i class="el-icon-delete" @click.stop="$emit('del', item)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="bottom">
              <i class="el-icon-setting"></i>
            </el-tooltip>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isDev: Boolean
  },

  computed: {
    hasPriv () {
      const item = this.item
      const createUser = item.createUser.replace('<span class="c-main">', '').replace('</span>', '')
      return item.lockedBy === this.$native.name || (!item.lockedBy && (
        createUser === this.$native.name ||
        (item.info.whitelist || '').indexOf(this.$native.name) > -1 ||
        this.$native.name === '杨明'
      ))
    }
  }
}
</script>

<style lang="less">
.folder-item {
  position: relative;
  width: 240px;
  height: 240px;
  transform: scale(0.7);
  transform-origin: left top;
  font-size: 14 * 1.2px;
  &__bg {
    height: 180px;
    background: rgba(#afc7f0, 0.7);
    /*background: rgba(#ffb400, 0.2);*/
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  &__active {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    left: 0;
    /*background: rgba(red, 0.4);*/
    background: #ff4d00;
    z-index: 3;
  }
  &__record {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    left: 0;
    background: rgba(#afc7f0, 1);
    &:hover {
      background: #3b8ff6;
      color: #fff;
    }
    color: #666;
    z-index: 3;
  }
  &__box {
    &:hover {
      .folder-item__content {
        display: block;
      }
      .folder-item__title {
        display: none;
      }
    }
  }
  &__content {
    display: none;
  }
  &__title,
  &__content {
    position: absolute;
    bottom: 0;
    height: 60px;
    left: 0;
    width: 100%;
    background: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .1);
    padding: 10px;
    i {
      font-size: 20px;
      margin: 0 8px;
      color: #3b8ff6;
      font-weight: bolder;
    }
  }
}
</style>
