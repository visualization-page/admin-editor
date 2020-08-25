<template>
  <div class="suggest">
    <div class="app-header">
      <header-opt>
        <div class="bf-btn" @click="$router.back()">
          <div class="bf-btn__container">
            返回
          </div>
        </div>
      </header-opt>
    </div>
    <div class="suggest__title flex-center-between">
      <span class="f16">反馈建议</span>
      <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
    </div>
    <div class="suggest__title">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div v-html="props.row.detail" />
          </template>
        </el-table-column>
        <el-table-column
          prop="detail"
          label="反馈内容"
        >
          <template slot-scope="props">
            <div class="th2">{{ props.row.detail }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="提交人"
          prop="user.name"
          width="100"
        >
          <template slot-scope="props">
            <avatar
              :user-name="props.row.user.name"
              :user-id="props.row.user.id"
            />
          </template>
        </el-table-column>
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
          width="120"
        >
          <template slot-scope="props">
            <el-button v-if="false" type="text" @click="handleDel(props.row)">删除</el-button>
            <el-button
              v-if="isEditAble(props.row)"
              type="text"
              @click="handleEdit(props.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="isAdmin"
              type="text"
              @click="handleChangeStatus(props.row)"
            >
              更改状态
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="form.id ? '编辑反馈' : '添加反馈'"
      :visible.sync="showAdd"
      width="400px"
    >
      <div v-show="isChangeStatus">
        <p>选择状态</p>
        <el-select v-model="form.status">
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="mt10">
          <p>处理意见</p>
          <el-input type="textarea" v-model="form.reason" placeholder="请输入" />
        </div>
      </div>
      <el-form
        v-show="!isChangeStatus"
        ref="form"
        :model="form"
        :rules="{
          content: [
            { required: true, message: '请输入反馈内容', trigger: 'blur' },
            { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
          ]
        }">
        <el-form-item prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button @click="handleAddSubmit" type="primary">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import HeaderOpt from '@/components/header-opts'
import { http } from '@/api'
import Avatar from '@/components/avatar/index.vue'

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
    HeaderOpt,
    Avatar
  },
  data () {
    return {
      status,
      isAdmin: this.$native.name === '杨明',
      form: {
        id: undefined,
        content: '',
        status: 0,
        reason: ''
      },
      tableData: [],
      showAdd: false,
      isChangeStatus: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      http.get('suggest/get').then(res => {
        this.tableData = res.data.sort((a, b) => b.time - a.time).map(x => ({
          ...x,
          status: status.find(y => y.value === x.status)
        }))
      })
    },
    handleAdd () {
      this.showAdd = true
      this.isChangeStatus = false
      this.form = { content: '', status: 0, reason: '' }
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    handleEdit (item) {
      this.showAdd = true
      this.isChangeStatus = false
      this.form = {
        content: item.detail,
        id: item.id,
        status: item.status,
        reason: item.reason
      }
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    handleChangeStatus (item) {
      this.showAdd = true
      this.isChangeStatus = true
      this.form = {
        content: item.detail,
        id: item.id,
        status: item.status.value,
        reason: item.reason
      }
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    handleAddSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            user: {
              name: this.$native.name,
              id: this.$native.uid
            },
            detail: this.form.content,
            status: this.form.status,
            id: this.form.id,
            reason: this.form.reason
          }
          http.post('suggest/save', data, { successMessage: this.form.id ? '编辑成功' : '添加成功' }).then(() => {
            this.showAdd = false
            this.getList()
          })
        }
      })
    },
    isEditAble (item) {
      return Number(item.user.id) === Number(this.$native.uid) && item.status.value === 0
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
