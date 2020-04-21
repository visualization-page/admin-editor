<template>
  <div class="suggest">
    <div class="app-header">
      <header-opt
        :opts="[{
          label: '返回',
          icon: 'el-icon-back f16',
          action: () => {
            this.$router.back()
          }
        }]"
      />
    </div>
    <div class="suggest__title flex-center-between">
      <span class="f16">反馈建议</span>
      <el-button icon="el-icon-plus" type="primary">添加</el-button>
    </div>
    <div class="suggest__title">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column v-if="false" type="expand">
          <template slot-scope="props">
            <div v-html="props.row.detail" />
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="反馈内容"
        />
        <el-table-column
          label="提交人"
          prop="user.name"
          width="80"
        />
        <el-table-column
          label="状态"
          prop="status"
          width="120"
        >
          <template slot-scope="props">
            <span :style="{ color: props.row.status.color }">
              {{ props.row.status.label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="处理意见"
          prop="reason"
          width="200"
        />
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="props">
            <el-button type="text" @click="handleDel(props.row)">删除</el-button>
            <el-button type="text">编辑</el-button>
            <el-button v-if="isAdmin" type="text">更改状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import HeaderOpt from '@/components/header-opts'

const status = [
  {
    label: '待处理',
    value: 0,
    color: '#909399'
  },
  {
    label: '已采纳，处理中',
    value: 1,
    color: '#E6A23C'
  },
  {
    label: '处理完成，待上线',
    value: 2,
    color: '#67C23A'
  },
  {
    label: '已处理上线',
    value: 3,
    color: '#67C23A'
  },
  {
    label: '已驳回',
    value: 4,
    color: '#F56C6C'
  }
]

export default {
  components: {
    HeaderOpt
  },
  data () {
    return {
      isAdmin: this.$native.name === '杨明',
      tableData: [
        {
          title: '大风范围哥如果为而为热王菲王菲各个人萨尔服务',
          detail: '',
          user: {
            name: '',
            id: ''
          },
          status: 0,
          reason: ''
        },
        {
          title: '大风范围哥如果为而为热王菲王菲各个人萨尔服务',
          detail: '',
          user: {
            name: '',
            id: ''
          },
          status: 1,
          reason: ''
        }
      ].map(x => ({
        ...x,
        status: status.find(y => y.value === x.status)
      }))
    }
  }
}
</script>

<style lang="less">
.suggest {
  &__title {
    width: 1100px;
    margin: 20px auto;
  }
}
</style>
