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
          <div slot="trigger" class="p10 cp c-main f14">导入项目</div>
        </el-upload>
        <div class="p10 cp c-main mr10 f14" @click="handleAddFolder()">新建文件夹</div>
        <div class="bf-btn" @click="handleAddForm()">
          <div class="bf-btn__container">
            创建项目
          </div>
        </div>
      </header-opt>
    </div>
    <div class="project-list__title flex justify-between">
      <div class="f18">
        <span
          class="b cp hover-line"
          @click="handleBackIndex()"
        >
          项目列表
        </span>
        <template v-if="currentFolder">
          <span class="f16 c-999 mlr5">/</span>
          <span class="f16">{{ currentFolder.name }}</span>
        </template>
      </div>
      <el-form inline>
        <el-form-item label="搜索项目">
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
      <div class="project-list__new flex flex-wrap">
        <div class="tc width-100 ptb50" v-if="(searchModel.searchList || tableData).length === 0">
          <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g transform="translate(24 31.67)"><ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>
          <p class="f16 c-666">没有项目呢～</p>
        </div>
        <template v-for="item in (searchModel.searchList || tableData)">
          <folder-item
            v-if="item.dir"
            :key="item.dir"
            :item="item"
            :is-dev="isDev"
            @open="handlePreview"
            @copy="handleCopy"
            @down="handleDown"
            @export="handleExport"
            @del="handleDel"
            @click="handleEditForm"
            @record="handleGetRecords"
            @version="handleGetVersion"
          />
          <folder
            v-else
            :key="item.id"
            :item="item"
            @delete="handleFolderDelete"
            @edit="handleFolderEdit"
            @click="handleFolderOpen"
          />
        </template>
      </div>
    </div>
    <div class="ptb50 tc">
      <p class="f12 mt10 c-999">Designed by 讯盟FE</p>
    </div>

    <el-dialog
      :title="editProjectForm ? '编辑项目' : '创建项目'"
      :visible.sync="showAddModal"
      width="650px"
    >
      <p v-if="editProjectForm && editProjectForm.versionId" class="f12 c-main flex-center-align mb15">
        <span style="width: 80px">当前版本</span>
        <span>{{ editProjectForm.versionName }}</span>
      </p>
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

    <el-dialog
      title="版本管理"
      width="550px"
      :visible.sync="showVersion"
    >
      <el-table
        border
        stripe
        class="width-100"
        :data="versions"
      >
        <el-table-column label="版本名称" prop="name" />
        <el-table-column label="创建时间" prop="time" />
        <el-table-column label="当前版本">
          <template slot-scope="scope">
            <span>{{ scope.row.id === editProjectForm.versionId ? '是' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDeleteVersion(scope.row)">删除</el-button>
            <el-button v-if="scope.row.id !== editProjectForm.versionId" type="text" @click="handleSwitchVersion(scope.row)">切换</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddNewVersion">新建版本</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import HeaderOpt from '@/components/header-opts/index.vue'
import { http } from '@/api'
import { MessageBox, Message, Notification } from 'element-ui'
import dayjs from 'dayjs'
import Folder from './components/folder.vue'
import FolderItem from './components/item.vue'
import SchemaForm from '@/components/schema/index.vue'
import { projectCreate } from '@/components/v2/project-set/config.ts'
import { getParentRef, deepClone } from '@/assets/util'
import { defaultProject } from '@/assets/project'
import Vue from 'vue'

export default {
  components: {
    HeaderOpt,
    SchemaForm,
    Folder,
    FolderItem
  },

  data () {
    return {
      isDev: localStorage.getItem('butterfly-mode') === 'normal',
      schema: projectCreate,
      showAddModal: false,
      showRecord: false,
      showVersion: false,
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
      records: [],
      versions: [],
      currentFolder: null,
      searchTimer: 0
    }
  },

  computed: {
    uploadAction () {
      return process.env.VUE_APP_FILE_SERVER + '/butterfly/project/upload'
    }
  },

  async created () {
    const folderList = await this.getFolderList()
    if (!this.currentFolder && this.$route.query.folderId) {
      this.currentFolder = folderList.find(x => x.id === this.$route.query.folderId)
    }
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

    async handleGetVersion (item, noModal) {
      if (!noModal) {
        this.editProjectForm = item
      }
      const res = await http.get('version/list', { dir: item.dir })
      this.versions = res.data.map(x => ({
        ...x,
        time: dayjs(x.time || Date.now()).format('MM/DD HH:mm')
      }))
      if (!noModal) {
        this.showVersion = true
      }
    },

    async handleDeleteVersion (item) {
      await this.$confirm('确定要删除该版本吗？')
      await http.get('version/delete', { id: item.id, dir: this.editProjectForm.dir }, { successMessage: '删除版本成功' })
      this.handleGetVersion(this.editProjectForm)
    },

    async handleSwitchVersion (item) {
      await this.$confirm('确定要切换到该版本吗？')
      await http.get('version/switch', { id: item.id, dir: this.editProjectForm.dir }, { successMessage: '切换版本成功' })
      Vue.set(this.editProjectForm, 'versionId', item.id)
      await this.getList()
      this.showVersion = false
    },

    async handleAddNewVersion () {
      const { value } = await this.$prompt('请输入新建的版本名称，例如：v1.3 、 ioc_1.6 、ioc_demo，请不要用中文', '新建版本')
      await http.get('version/add', { name: value, dir: this.editProjectForm.dir }, { successMessage: '添加版本成功' })
      this.handleGetVersion(this.editProjectForm)
    },

    async getFolderList () {
      const { data } = await http.get('folder/list')
      // 赋值可选的文件夹
      data.unshift({ label: '无', value: '' })
      projectCreate[1].options = data.map(x => ({ label: x.name, value: x.id }))
      return data
    },

    async getList () {
      let reqData
      if (this.currentFolder) {
        reqData = {
          dirs: this.currentFolder.projects.join(','),
          folderId: this.currentFolder.id
        }
      }
      const { data } = await http.get('list', reqData)
      this.tableData = data.map(x => {
        if (x.dir) {
          return {
            ...x,
            info: {
              ...(x.info || {}),
              time: x.info.time ? dayjs(x.info.time).format('MM/DD HH:mm') : '-'
            }
          }
        }
        return x
      })
    },

    handleSearch (val) {
      val = val.trim()
      this.searchModel.keywords = val
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
        this.searchTimer = 0
      }
      if (!val) {
        this.searchModel.searchList = null
      } else {
        this.searchTimer = setTimeout(async () => {
          const { data } = await http.get('search', { keyword: val, field: this.searchModel.field })
          this.searchModel.searchList = data.map(x => {
            x.info.time = x.info.time ? dayjs(x.info.time).format('MM/DD HH:mm') : '-'
            return x
          })
        }, 1000)
      }
    },

    // hasPriv (item) {
    //   const createUser = item.createUser.replace('<span class="c-main">', '').replace('</span>', '')
    //   return item.lockedBy === this.$native.name || (!item.lockedBy && (
    //     createUser === this.$native.name ||
    //     (item.info.whitelist || '').indexOf(this.$native.name) > -1 ||
    //     this.$native.name === '杨明'
    //   ))
    // },

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
      // const dir = this.searchModel.field === 'dir' ? (item.origin || item.dir) : item.dir
      const res = await http.get('project/get', { dir: item.dir, preview: 1 })
      const data = res.data.project
      this.editProjectForm = data
      this.addProjectForm = {
        dir: data.dir,
        interactiveType: data.interactiveType,
        desc: data.desc,
        info: { whitelist: data.info.whitelist },
        config: { openConsole: data.config.openConsole, sdklist: data.config.sdklist },
        folder: data.folder
      }
      this.showAddModal = true
      // 项目名称不可修改
      projectCreate[0].elAttrs.disabled = true
      if (data.versionId) {
        await this.handleGetVersion(item, true)
        const cur = this.versions.find(x => x.id === data.versionId)
        if (cur) {
          Vue.set(this.editProjectForm, 'versionName', cur.name)
        }
      }
    },

    handleAddForm () {
      projectCreate[0].elAttrs.disabled = false
      this.editProjectForm = null
      this.addProjectForm = {
        folder: this.$route.query.folderId || '',
        dir: '',
        desc: '',
        interactiveType: 'long-page',
        config: { openConsole: false },
        info: { whitelist: '', userName: this.$native.name, time: Date.now() }
      }
      this.showAddModal = true
    },

    handleFormChange (fieldString, val) {
      const { pref, field } = getParentRef(fieldString, this.addProjectForm)
      if (pref[field] === undefined) {
        Vue.set(pref, field, val)
      } else {
        pref[field] = val
      }
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
            if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
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
        if (this.$route.query.folderId) {
          const detail = await http.get('folder/get', { id: this.$route.query.folderId })
          this.currentFolder = detail.data
        }
        this.getList()
      }
    },

    async handleAddFolder (isEdit) {
      const { value } = await this.$prompt(
        '文件夹为业务线，例如：彩云活动、广西活动、IOC',
        isEdit ? '编辑文件夹' : '新建文件夹',
        { inputPlaceholder: '请输入', inputValue: isEdit ? this.editProjectForm.name : '' }
      )
      if (value) {
        await http.post('folder/save', {
          id: isEdit ? this.editProjectForm.id : undefined,
          name: value,
          user: {
            name: Vue.prototype.$native.name,
            uid: Vue.prototype.$native.uid
          }
        })
        Notification({
          title: '成功',
          type: 'success',
          message: isEdit ? '编辑文件夹成功' : '新建文件夹成功',
          position: 'top-left',
          duration: 2000
        })
        await this.getList()
      } else {
        Notification({
          title: '错误',
          type: 'error',
          message: '请输入文件夹名',
          position: 'top-left',
          duration: 2000
        })
      }
    },

    async handleFolderDelete (item) {
      await this.$confirm('确定要删除吗？')
      await http.post('folder/del', { id: item.id })
      Notification({
        title: '成功',
        type: 'success',
        message: '删除成功',
        position: 'top-left',
        duration: 2000
      })
      await this.getList()
    },

    handleFolderEdit (item) {
      this.editProjectForm = item
      this.handleAddFolder(true)
    },

    handleFolderOpen (item) {
      this.$router.replace({
        path: this.$route.path,
        query: {
          folderId: item.id
        }
      })
      this.currentFolder = item
      this.getList()
    },

    handleBackIndex () {
      this.$router.replace({
        path: this.$route.path,
        query: {}
      })
      this.searchModel.searchList = null
      this.currentFolder = null
      this.getList()
    }
  }
}
</script>

<style lang="less">
.project-list {
  width: 1180px;
  margin: 0 auto;
  // height: e('calc(100% - 172px)');
  // overflow: auto;
  &__title {
    width: 1180px;
    margin: 20px auto 20px auto;
  }
  &__wrap {
    min-height: 100vh;
    background: #f2f2f2;
    .hover-line {
      &:hover {
        text-decoration: underline;
      }
    }
  }
  &__new {
    & > div {
      margin-right: -40px;
      margin-bottom: -40px;
      &:nth-child(6n) {
        margin-right: -60px;
      }
    }
  }
}
</style>
