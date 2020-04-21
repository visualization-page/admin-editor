<template>
  <div
    v-show="show"
    class="share-wrap"
    @touchmove.prevent=""
    @click="$emit('close')"
  >
    <div class="share-box" @click.stop="">
      <div class="share-title" v-if="false">分享</div>
      <ul class="share-methods">
        <li
          v-for="item in items.filter(x => showArr.some(y => Number(y) === x.type))"
          :key="item.type"
          class="method-item"
          @click="share(item.type)"
        >
          <img :src="item.icon" alt="">
          <div class="method-name fz12">{{ item.label }}</div>
        </li>
      </ul>
      <div class="btn-cancel" @click="$emit('close')">取消</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'share',

  data () {
    return {
      items: [
        {
          label: this.getSelf().name,
          icon: this.getSelf().rlogo,
          type: 3
        },
        {
          label: '微信好友',
          icon: require('./img/wx.png'),
          type: 2
        },
        {
          label: 'QQ',
          icon: require('./img/qq.png'),
          type: 4
        },
        {
          label: '朋友圈',
          icon: require('./img/wx-c.png'),
          type: 1
        }
      ]
    }
  },

  props: {
    show: Boolean,
    title: String,
    desc: String,
    pic: String,
    link: String,
    linkMain: String,
    showArr: {
      type: Array,
      default () {
        return [1, 2, 3, 4]
      }
    }
  },

  methods: {
    getSelf () {
      // eslint-disable-next-line no-undef
      return _APP_CONFIG
    },
    share (type) {
      this.$emit('close')
      Vue.prototype.$native.native('outershare',
        {
          type: type,
          title: this.title,
          desc: this.desc,
          link: type === 3 ? (this.linkMain || location.href) : this.link,
          pic: this.pic
        }
      )
    }
  }
}
</script>

<style lang="less">
.share-wrap {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 0;
  background-color: rgba(0,0,0, .6);
  z-index: 11;

  .share-box {
    position: fixed;
    width: 100%;
    bottom: 0;
    font-size: 18px;
    background-color: #fff;
  }

  .share-methods {
    width: 100%;
    height: 150 / 375 * 100vw;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: #f2f2f2;
    font-size: 12px;
    border-top: 2px #fa565a solid;

    .method-item {
      width: 25%;
      text-align: center;
      img {
        width: 60 / 375 * 100vw;
      }
    }
    .method-name {
      margin-top: 10px;
    }
  }

  .btn-cancel {
    line-height: 50px;
    text-align: center;
  }
}
</style>
