<template>
  <div class="project-list__wrap height-100">
    <div class="app-header">
      <header-opt
        :opts="opts"
      />
    </div>
    <div class="project-list__title flex justify-between">
      <span class="f16">项目列表</span>
      <el-form inline>
        <el-form-item label="搜索类型">
          <el-select placeholder="请选择" v-model="searchModel.field">
            <el-option
              v-for="item in searchField"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input
            type="input"
            placeholder="请输入关键词"
            :value="searchModel.keywords"
            @input="handleSearch"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="project-list">
      <el-table
        :data="searchModel.searchList || tableData"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="dir"
          label="项目"
          fixed>
          <template slot-scope="scope">
            <div v-html="scope.row.dir" />
          </template>
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述">
          <template slot-scope="scope">
            <div v-html="scope.row.desc" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createUser"
          label="创建人"
          width="60">
          <template slot-scope="scope">
            <div v-html="scope.row.createUser" />
          </template>
        </el-table-column>
        <el-table-column
          prop="info.userName"
          label="修改人"
          width="60">
        </el-table-column>
        <el-table-column
          prop="info.time"
          label="修改时间"
          width="130">
        </el-table-column>
        <el-table-column
          prop="info.remark"
          label="发布备注">
        </el-table-column>
        <el-table-column
          prop="info.userName"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.lockedBy" style="color:green">正常</span>
            <span style="color: red" v-else>{{ scope.row.lockedBy }}编辑中</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="230">
          <template slot-scope="scope">
            <el-button @click="handlePreview(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleCopy(scope.row)" type="text" size="small">复制</el-button>
            <el-button @click="handleDown(scope.row)" type="text" size="small">下载</el-button>
            <el-button @click="handleExport(scope.row)" type="text" size="small">导出</el-button>
            <template v-if="hasPriv(scope.row)">
              <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="$router.push(`/editor/${scope.row.dir}`)" type="text" size="small">编辑</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import HeaderOpt from '@/components/header-opts/index.vue'
import { http } from '@/api'
import { MessageBox, Message } from 'element-ui'
import dayjs from 'dayjs'
// import { resetProject } from '@/assets/project'
// import { project } from '../../assets/project'
// import { initProject, project } from '../../assets/project'

export default {
  components: {
    HeaderOpt
  },
  data () {
    return {
      searchField: [
        { label: '项目名称', value: 'dir' },
        { label: '项目描述', value: 'desc' },
        { label: '创建人', value: 'createUser' }
      ],
      searchModel: {
        field: 'dir',
        keywords: '',
        searchList: null
      },
      opts: [
        {
          label: '关于',
          icon: 'el-icon-s-flag f16',
          action: () => {
            // this.$router.push('/')
            window.open('./render.html#/project/butterfly-about')
          }
        },
        {
          label: '教程',
          icon: 'el-icon-question f16',
          action: () => {
            // this.$router.push('/tourism')
            window.open('./render.html#/project/tourism')
          }
        },
        {
          label: '反馈建议',
          icon: 'el-icon-chat-line-round f16',
          action: () => {
            this.$router.push('/suggest')
          }
        },
        {
          label: '导入项目',
          icon: 'el-icon-upload f16',
          isUpload: true,
          action: process.env.VUE_APP_FILE_SERVER + '/butterfly/project/upload',
          handleBeforeUpload (file) {
            const ok = file.type !== 'application/zip'
            if (!ok) {
              Message.error('请上传项目 data.json')
            }
            return ok
          },
          successCallback: () => {
            this.getList()
          }
        },
        {
          label: '创建项目',
          icon: 'el-icon-plus f16',
          action: () => {
            // project 置空
            // resetProject()
            this.$router.push('/editor')
          }
        }
      ],
      tableData: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      http.get('component/list', { type: 'project' }).then(res => {
        this.tableData = res.data.sort((a, b) => b.info.time - a.info.time).map(x => ({
          ...x,
          info: {
            ...(x.info || {}),
            time: x.info.time ? dayjs(x.info.time).format('YYYY/MM/DD HH:mm') : '-'
          }
        }))
      })
    },
    handleSearch (val) {
      this.searchModel.keywords = val
      if (!val) {
        this.searchModel.searchList = null
      } else {
        this.searchModel.searchList = this.tableData.map(x => {
          if (new RegExp(val).test(x[this.searchModel.field])) {
            return {
              ...x,
              [this.searchModel.field]: x[this.searchModel.field].replace(val, `<span class="c-main">${val}</span>`)
            }
          }
        }).filter(Boolean)
      }
    },
    hasPriv (item) {
      return item.lockedBy === this.$native.name || (!item.lockedBy && (
        item.createUser === this.$native.name ||
        (item.info.whitelist || '').indexOf(this.$native.name) > -1 ||
        this.$native.name === '杨明'
      ))
    },
    handlePreview (item) {
      if (item.url) {
        window.open(item.url)
      } else {
        // Message.info('项目还未提供正式访问的地址，请点击编辑进入预览项目')
        MessageBox.alert('项目未发布正式地址，即将查看预览').then(() => {
          window.open(process.env.VUE_APP_MOBILE + `#/project/${item.dir}`)
        })
      }
    },
    handleCopy (item) {
      http.post('project/copy', {
        dir: item.dir,
        name: this.$native.name
      }, { successMessage: '复制成功' }).then(() => {
        this.getList()
      })
    },
    handleExport (item) {
      location.href = process.env.VUE_APP_FILE_SERVER + `/butterfly/project/export/${item.dir}`
    },
    async handleDel (item) {
      await MessageBox.confirm('确认删除吗？')
      const i = this.tableData.findIndex(x => x.dir === item.dir)
      http.post('delete', { type: 'project', dir: item.dir }, { successMessage: '删除成功' }).then(() => {
        this.tableData.splice(i, 1)
      })
    },
    handleDown (item) {
      location.href = process.env.VUE_APP_FILE_SERVER + `/butterfly/project/download/${item.dir}`
    }
  }
}
</script>

<style lang="less">
.project-list {
  width: 1100px;
  margin: 0 auto 20px auto;
  height: e('calc(100% - 140px)');
  overflow: auto;
  &__title {
    width: 1100px;
    margin: 20px auto 0 auto;
  }
  &__wrap {
    height: 100vh;
  }
}
</style>
