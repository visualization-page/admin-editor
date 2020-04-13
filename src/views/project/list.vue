<template>
  <div class="project-list__wrap height-100">
    <div class="app-header">
      <header-opt
        :opts="opts"
      />
    </div>
    <div class="project-list">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="dir"
          label="项目"
          fixed
          width="120">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createUser"
          label="创建人"
          width="60">
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
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="handlePreview(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleCopy(scope.row)" type="text" size="small">复制</el-button>
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
import { resetProject } from '@/assets/project'
// import { initProject, project } from '../../assets/project'

export default {
  components: {
    HeaderOpt
  },
  data () {
    return {
      opts: [
        {
          label: '关于',
          icon: 'el-icon-s-flag f16',
          action: () => {
            // this.$router.push('/')
            window.open('http://api.jituancaiyun.net/butterfly-fe/dist-system/render.html#/project/butterfly-about')
          }
        },
        {
          label: '教程',
          icon: 'el-icon-question f16',
          action: () => {
            this.$router.push('/tourism')
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
            resetProject()
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
        this.tableData = res.data.map(x => ({
          ...x,
          info: {
            ...(x.info || {}),
            time: x.info.time ? dayjs(x.info.time).format('YYYY/MM/DD HH:mm') : '-'
          }
        }))
      })
    },
    hasPriv (item) {
      return item.createUser === this.$native.name ||
        (item.info.whitelist || '').indexOf(this.$native.name) > -1 ||
        this.$native.name === '杨明'
    },
    handlePreview (item) {
      window.open(process.env.VUE_APP_MOBILE + `#/project/${item.dir}`)
    },
    handleCopy (item) {
      http.post('project/copy', {
        dir: item.dir,
        name: this.$native.name
      }, { successMessage: '复制成功' }).then(() => {
        this.getList()
      })
    },
    async handleDel (item) {
      await MessageBox.confirm('确认删除吗？')
      const i = this.tableData.findIndex(x => x.dir === item.dir)
      http.post('delete', { type: 'project', dir: item.dir }, { successMessage: '删除成功' }).then(() => {
        this.tableData.splice(i, 1)
      })
    }
  }
}
</script>

<style lang="less">
.project-list {
  width: 1000px;
  margin: 20px auto;
  height: e('calc(100% - 102px)');
  overflow: auto;
  &__wrap {
    height: 100vh;
  }
}
</style>
