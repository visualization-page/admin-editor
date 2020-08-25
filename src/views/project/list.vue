<template>
  <div class="project-list__wrap">
    <div class="app-header">
      <header-opt>
        <span class="c-999 mr10">你好，{{ $native.name }}</span>
        <el-upload
          :action="uploadAction"
          :multiple="false"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleResponse"
          :on-error="handleResponse"
        >
          <div slot="trigger" class="p10 cp c-main mr10 f14">导入项目</div>
        </el-upload>
        <div class="bf-btn" @click="handleAddForm()">
          <div class="bf-btn__container">
            创建项目
          </div>
        </div>
      </header-opt>
    </div>
    <div class="project-list__title flex justify-between">
      <div class="">
        <span class="f18 b">项目列表</span>
      </div>
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
        :data="searchModel.searchList || currentPageData"
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
          <template slot-scope="props">
            <el-button
              v-if="props.row.info.remark"
              class="mr5"
              type="text"
              icon="el-icon-tickets"
              @click="handleGetRecords(props.row)"
            />
            <span>{{ props.row.info.remark || '-' }}</span>
          </template>
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
          label="操作"
          width="230">
          <template slot-scope="scope">
            <el-button @click="handlePreview(scope.row)" type="text" size="small">查看</el-button>
            <template v-if="isDev">
              <el-button @click="handleCopy(scope.row)" type="text" size="small">复制</el-button>
              <el-button @click="handleDown(scope.row)" type="text" size="small">下载</el-button>
              <el-button @click="handleExport(scope.row)" type="text" size="small">导出</el-button>
            </template>
            <template v-if="hasPriv(scope.row)">
              <el-button v-if="isDev" @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleEditForm(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!searchModel.keywords" class="tc ptb20">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="tableData.length"
          :page-size="pageSize"
          @current-change="handlePage"
          @prev-click="handlePage"
          @next-click="handlePage"
        />
      </div>
    </div>
    <div class="fixed width-100 tc b10">
      <p class="f12 mt10 c-999">Designed by 讯盟FE</p>
    </div>

    <el-dialog
      :title="editProjectForm ? '编辑项目' : '创建项目'"
      :visible.sync="showAddModal"
      width="650px"
    >
      <schema-form
        :schema="schema"
        :schema-data="addProjectForm"
        @updateByField="handleFormChange"
      />
      <template slot="footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button v-if="editProjectForm" type="warning" @click="handleToEditor()">开发项目</el-button>
        <el-button type="primary" @click="handleSaveForm()">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="发布记录"
      width="550px"
      :visible.sync="showRecord"
    >
      <el-table
        border
        stripe
        class="width-100"
        :data="records"
      >
        <el-table-column label="发布信息" prop="remark" />
        <el-table-column label="发布人" prop="userName" />
        <el-table-column label="操作时间" prop="time" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import HeaderOpt from '@/components/header-opts/index.vue'
import { http } from '@/api'
import { MessageBox, Message, Notification } from 'element-ui'
import dayjs from 'dayjs'
// import Avatar from '@/components/avatar/index.vue'
import SchemaForm from '@/components/schema/index.vue'
import { projectCreate } from '@/components/v2/project-set/config.ts'
import { getParentRef, deepClone } from '@/assets/util'
import { defaultProject } from '@/assets/project'

export default {
  components: {
    HeaderOpt,
    SchemaForm
  },
  computed: {
    currentPageData () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    uploadAction () {
      return process.env.VUE_APP_FILE_SERVER + '/butterfly/project/upload'
    }
  },
  data () {
    return {
      isDev: localStorage.getItem('butterfly-mode') === 'normal',
      schema: projectCreate,
      showAddModal: false,
      showRecord: false,
      addProjectForm: {
        dir: '',
        desc: '',
        interactiveType: '',
        config: { openConsole: false },
        info: { whitelist: '' }
      },
      editProjectForm: null,
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
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      records: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleBeforeUpload (file) {
      const ok = file.type !== 'application/zip'
      if (!ok) {
        Notification({
          title: '错误',
          type: 'error',
          message: '请上传项目 data.json',
          position: 'top-left',
          duration: 2000
        })
      }
      return ok
    },
    handleResponse (res) {
      if (res.success) {
        Notification({
          title: '成功',
          type: 'success',
          message: '上传成功',
          position: 'top-left',
          duration: 2000
        })
        // item.successCallback && item.successCallback()
        this.getList()
      } else {
        Notification({
          title: '错误',
          type: 'error',
          message: res.msg,
          position: 'top-left',
          duration: 2000
        })
      }
    },
    async handleGetRecords (item) {
      const res = await http.get('project/record', { dir: item.dir })
      this.records = res.data.map(x => ({
        ...x,
        time: dayjs(x.time).format('MM/DD HH:mm')
      }))
      this.showRecord = true
    },
    handlePage (val) {
      this.currentPage = val
    },
    getList () {
      http.get('component/list', { type: 'project' }).then(res => {
        this.tableData = res.data.sort((a, b) => b.info.time - a.info.time).map(x => ({
          ...x,
          info: {
            ...(x.info || {}),
            time: x.info.time ? dayjs(x.info.time).format('MM/DD HH:mm') : '-'
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
              [this.searchModel.field]: x[this.searchModel.field].replace(val, `<span class="c-main">${val}</span>`),
              origin: x[this.searchModel.field]
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
        // MessageBox.alert('项目未发布正式地址，即将查看预览').then(() => {
        window.open(process.env.VUE_APP_MOBILE + `#/project/${item.dir}`)
        // })
      }
    },
    async handleCopy (item) {
      const { value } = await MessageBox.prompt('请输入复制后的项目名(文件夹名)', {
        inputValue: `${item.dir}_copy`
      })
      if (!value) {
        return Notification({
          title: '错误',
          type: 'error',
          message: '请输入项目名',
          position: 'top-left',
          duration: 2000
        })
      }
      http.post('project/copy', {
        dir: item.dir,
        name: this.$native.name,
        newDir: value
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
    async handleDown (item) {
      await http.get('project/download-check', { dir: item.dir })
      location.href = process.env.VUE_APP_FILE_SERVER + `/butterfly/project/download/${item.dir}`
    },
    async handleEditForm (item) {
      const res = await http.get('project/get', { dir: item.origin || item.dir, preview: 1 })
      const data = res.data.project
      this.editProjectForm = data
      this.addProjectForm = {
        dir: data.dir,
        interactiveType: data.interactiveType,
        desc: data.desc,
        info: { whitelist: data.info.whitelist },
        config: { openConsole: data.config.openConsole }
      }
      this.showAddModal = true
      // 项目名称不可修改
      projectCreate[0].elAttrs.disabled = true
    },
    handleAddForm () {
      projectCreate[0].elAttrs.disabled = false
      this.editProjectForm = null
      this.addProjectForm = {
        dir: '',
        desc: '',
        interactiveType: 'long-page',
        config: { openConsole: false },
        info: { whitelist: '', userName: this.$native.name, time: Date.now() }
      }
      this.showAddModal = true
    },
    handleFormChange (field, val) {
      const res = getParentRef(field, this.addProjectForm)
      res.pref[res.field] = val
    },
    async handleToEditor () {
      this.$router.push(`${this.isDev ? '/v2' : ''}/editor${this.isDev ? '' : '-sample'}/${this.addProjectForm.dir}`)
    },
    async handleSaveForm () {
      if (!this.addProjectForm.dir) {
        Message.error('请输入项目名称')
      } else if (!/^[a-z][a-z-_0-9]+$/.test(this.addProjectForm.dir)) {
        Message.error('项目名称不合法，请重新输入')
      } else if (!this.addProjectForm.interactiveType) {
        Message.error('请选择项目类型')
      } else {
        const _merge = (obj, data) => {
          Object.keys(obj).forEach(k => {
            if (typeof obj[k] === 'object') {
              _merge(obj[k], data[k])
            } else {
              data[k] = obj[k]
            }
          })
        }
        const project = this.editProjectForm || deepClone(defaultProject)
        _merge(this.addProjectForm, project)
        await http.post('project/save', {
          doLock: false,
          force: true,
          dir: project.dir,
          project
        })
        Notification({
          title: '成功',
          type: 'success',
          message: '保存成功',
          position: 'top-left',
          duration: 2000
        })
        this.showAddModal = false
        this.getList()
      }
    }
  }
}
</script>

<style lang="less">
.project-list {
  width: 1200px;
  margin: 0 auto 20px auto;
  height: e('calc(100% - 152px)');
  overflow: auto;
  &__title {
    width: 1200px;
    margin: 20px auto 0 auto;
  }
  &__wrap {
    height: 100vh;
  }
}
</style>
