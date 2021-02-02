<template>
  <div class="mock">
    <header-opt>
      <div class="bf-btn" @click="handleAddCategory(true)">
        <div class="bf-btn__container">
          新建分类
        </div>
      </div>
    </header-opt>

    <div class="mock__content pt20">
      <div class="flex-center-between">
        <div class="flex">
          <div class="mock__back c-666" @click="$router.back()">
            <i class="mr5 el-icon-back" />
            <span>返回</span>
          </div>
          <span class="f20 ml20">Mock 服务</span>
        </div>
        <div v-if="currentCategory" class="flex">
          <div class="cp c-999 mr10 f14" @click="handleDeleteCategory">删除分类</div>
          <div class="cp c-999 mr10 f14" @click="handleAddCategory(false)">修改分类</div>
          <div class="cp c-main mr10 f14" @click="handleAddCategory(true)">添加子分类</div>
          <div class="cp c-main mr10 f14" @click="handleAddApi">添加接口</div>
        </div>
      </div>

      <!--树形结构布局-->
      <div class="mock__content-data flex mt20">
        <div style="width: 250px" class="bg-f7 pt10 pb20 bd br bd-eee flex-shrink-0">
          <p class="plr10 f16 ptb10">服务分类</p>
          <el-tree
            class="bg-f7"
            :data="category"
            :current-node-key="currentCategory ? currentCategory.id : undefined"
            auto-expand-parent
            :default-expanded-keys="currentCategory ? [currentCategory.id] : []"
            highlight-current
            node-key="id"
            :props="{ label: 'name', children: 'children' }"
            @node-click="handleSelectCategory"
          />
        </div>
        <div style="width: 250px" class="bg-f7 pt10 pb20 flex-shrink-0">
          <p class="plr10 f16 ptb10">接口列表</p>
          <el-tree
            class="bg-f7"
            :data="apiList"
            :current-node-key="currentApi ? currentApi.id : undefined"
            :props="{ label: 'name', children: 'children' }"
            highlight-current
            node-key="id"
            :filter-node-method="(value, data) => data.type === 'api'"
            @node-click="handleSelectApi"
          />
        </div>

        <!--详情-->
        <div v-if="isAdd || currentApi" class="flex-grow-1 p20 oa">
          <p class="f16 mb20">接口详情</p>
          <el-form label-width="80px" :model="apiForm">
            <el-form-item label="名称" prop="name">
              <el-input v-model="apiForm.name" type="input" placeholder="请输入" />
            </el-form-item>
            <el-form-item v-if="currentApi" label="请求地址">
              <el-button type="text" @click="handleOpen()">/butterfly/mock/api/detail?id={{ currentApi.id }}</el-button>
            </el-form-item>
            <el-form-item label="数据" prop="data">
              <monaco-editor
                v-model="apiForm.data"
                :style="{ height: '500px' }"
                :amdRequire="amdRequire"
                :language="'json'"
                :options="{
                  fontSize: 14,
                  showUnused: true,
                  smoothScrolling: true,
                  tabCompletion: 'on',
                  tabSize: 2,
                  formatOnPaste: true,
                  detectIndentation: false
                }"
                theme="vs-dark"
              />
              <el-input v-if="false" v-model="apiForm.data" type="textarea" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="">
              <el-button v-if="currentApi" type="danger" @click="handleDeleteApi">删 除</el-button>
              <el-button type="warning" @click="handleSave">保 存</el-button>
            </el-form-item>
          </el-form>
          <p class="f16 mb20">调用方式</p>
          <pre class="f14 c-666 bg-f7 p15 br4" style="white-space: pre-wrap; margin-left: 80px">Request

Domain: https://notify.uban360.com
Method: GET
Uri: /butterfly/mock/api/detail?id={{ currentApi && currentApi.id }}

Response
{
success: true,
data: {{ apiForm.data }}
}</pre>
        </div>
        <div v-else class="flex-grow-1 flex-center">
          <div class="tc c-999">
            <i class="el-icon-s-promotion f40"></i>
            <p class="f16 mt20">请选择或添加接口</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderOpt from '@/components/header-opts/index.vue'
import { http } from '@/api'

export default {
  components: {
    HeaderOpt
  },

  data () {
    const mockPriv = ['杨明', '诸炜']

    return {
      category: [],
      apiList: [],
      currentApi: null,
      currentCategory: null,
      isAdd: false,
      isAddCategory: false,
      apiForm: {
        name: '',
        data: ''
      },
      amdRequire: window.require,
      hasPriv: mockPriv.includes(this.$native.name)
    }
  },

  created () {
    this.getCategory()
  },

  methods: {
    handleOpen () {
      window.open(`${process.env.VUE_APP_MOCK_PREVIEW}/butterfly/mock/api/detail?id=${this.currentApi.id}`)
    },

    async getCategory () {
      const res = await http.get('mock/index')
      this.category = res.data
    },

    async getApiList () {
      const res = await http.get('mock/api/list', { categoryId: this.currentCategory.id })
      this.apiList = res.data
    },

    async handleAddCategory (isAdd) {
      if (!this.hasPriv) {
        return this.$message.error('无权限')
      }

      const isEdit = !isAdd
      const { value } = await this.$prompt(
        isAdd ? this.currentCategory ? `父级分类: ${this.currentCategory.name}` : '' : '',
        isEdit ? '编辑分类' : this.currentCategory ? '新建子分类' : '新建分类',
        { inputPlaceholder: '请输入', inputValue: isEdit ? this.currentCategory.name : '' }
      )
      if (!value.trim()) {
        return this.$message.error('名称不能为空')
      }
      const data = {
        name: value,
        creator: {
          id: this.$native.uid,
          name: this.$native.name
        }
      }
      if (isEdit) {
        data.id = this.currentCategory.id
        data.parentId = this.currentCategory.parentId
      } else {
        data.parentId = this.currentCategory ? this.currentCategory.id : undefined
      }
      // console.log(data)
      await http.post('mock/category/add', data, { successMessage: '操作成功' })
      await this.getCategory()
      this.currentApi = null
    },

    handleAddApi () {
      if (!this.hasPriv) {
        return this.$message.error('无权限')
      }

      this.currentApi = null
      this.isAdd = true
      this.apiForm = {
        name: '',
        data: ''
      }
    },

    handleSelectApi (data) {
      if (!this.currentApi || data.id !== this.currentApi.id) {
        this.isAdd = false
        this.currentApi = data
        this.apiForm = {
          ...data,
          data: ''
        }
        http.get('mock/api/detail', { id: data.id }).then(res => {
          this.apiForm.data = JSON.stringify(res.data, null, 2)
        })
      }
    },

    handleSelectCategory (data) {
      if (!this.currentCategory || data.id !== this.currentCategory.id) {
        this.currentCategory = data
        this.currentApi = null
        this.getApiList()
      }
    },

    async handleSave () {
      if (!this.apiForm.name.trim()) {
        return this.$message.error('请输入名称')
      }
      if (this.apiForm.id) {
        await this.$msgbox.confirm('确定保存吗？')
      }
      const data = {
        categoryId: this.currentCategory ? this.currentCategory.id : undefined,
        ...this.apiForm
      }
      // 校验 json
      try {
        JSON.parse(data.data)
      } catch (e) {
        return this.$message.error('数据格式有误，请输入 json 格式数据')
      }
      await http.post('mock/api/add', data, { successMessage: '操作成功' })
      this.getApiList()
      if (this.currentApi) {
        this.currentApi = this.apiList.find(x => x.id === this.currentApi.id)
      }
    },

    async handleDeleteCategory () {
      if (!this.hasPriv) {
        return this.$message.error('无权限')
      }

      await this.$msgbox.confirm('确定删除吗？')
      if (this.currentCategory.children && this.currentCategory.children.length) {
        return this.$message.error('请先删除分类下的子分类')
      } else if (this.apiList && this.apiList.length) {
        return this.$message.error('请先删除分类下的接口')
      }
      await http.post('mock/category/del', this.currentCategory, { successMessage: '操作成功' })
      this.getCategory()
    },

    async handleDeleteApi () {
      if (!this.hasPriv) {
        return this.$message.error('无权限')
      }

      await this.$msgbox.confirm('确定删除吗？')
      await http.post('mock/api/del', {
        id: this.currentApi.id
        // categoryId: this.currentCategory.id
      }, { successMessage: '操作成功' })
      this.currentApi = null
      this.getApiList()
    }
  }
}
</script>

<style lang="less">
.mock {
  &__content {
    width: 1180px;
    margin: 0 auto;
    &-data {
      height: e('calc(100vh - 140px)');
    }
    //.is-current .el-tree-node__content {
    //  background: linear-gradient(90deg, #ff7d00 20%, #ffb400);
    //  .el-tree-node__label {
    //    color: #fff;
    //  }
    //}
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background: linear-gradient(90deg, #ff7d00 20%, #ffb400);
      .el-tree-node__label {
        color: #fff;
      }
    }
  }
  &__back {
    padding: 5px 12px;
    border: 1px #cdcdcd solid;
    //border-right: none;
    cursor: pointer;
    transition: all .2s;
    &:not(:last-of-type) {
      // border-right: none;
    }
    &:hover {
      background: linear-gradient(90deg, #ff7d00 20%, #ffb400);
      color: #fff;
      border-color: #ff7d00;
    }
  }
}
</style>
