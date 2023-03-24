<template>
  <el-dialog title="系统连接" width="600px" :visible.sync="isShowDialog" @open="dialogOpen">
    <el-form ref="dbForm" v-loading="listLoading" :rules="rules" :model="dataForm">
      <el-form-item label="系统名称：" :label-width="formLabelWidth" prop="dataSourceName">
        <el-input v-model.trim="dataForm.dataSourceName" />
      </el-form-item>
      <el-form-item label="测试环境：" :label-width="formLabelWidth" prop="dbHost">
        <div style="display: flex">
          <el-input v-model.trim="dataForm.dbHost" />
        </div>
      </el-form-item>
      <el-form-item label="生产环境：" :label-width="formLabelWidth" prop="dbHost">
        <div style="display: flex">
          <el-input v-model.trim="dataForm.dbHostProd" />
        </div>
      </el-form-item>
      <el-form-item label="备注：" :label-width="formLabelWidth">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="listLoading" @click="isShowDialog = false">取 消</el-button>
      <!-- <el-button :disabled="listLoading" @click="testConnect">连接测试</el-button> -->
      <el-button :disabled="listLoading" type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getdeitalService,
  // addService,
  // editService
  // testService
} from '@/api/database'
import {
  saveDatabaseV4,
  updateDatabaseV4
} from '@/api/v4'
export default {
  name: 'Add',
  props: {
    // parentId: {
    //   type: String | Number,
    //   default: ''
    // },
    id: {
      type: String | Number,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // title: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
      // isActiveType: 'database',
      listLoading: false,
      formLabelWidth: '120px',
      dataForm: {},
      // productList: [],
      // productVersionList: [],
      urlOptions: [{
        value: '测试环境',
        label: '测试环境'
      }, {
        value: '生产环境',
        label: '生产环境'
      }],
      urlValue: '测试环境',
      rules: {
        dataSourceName: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
        dbHost: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
        // secret: [{ required: true, message: '请输入秘钥', trigger: 'blur' }],
        // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    save() {
      if (this.id) {
        this.edit()
      } else {
        this.add()
      }
    },
    add() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          const params = this.dataForm
          params.parentId = this.parentId
          params.type = 'connect'
          this.listLoading = true
          saveDatabaseV4(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            // this.$emit('saveDatabase', res)
            this.$refs.dbForm.resetFields()
            this.$emit('reload')
          })
        }
      })
    },
    edit() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          const params = this.dataForm
          params.id = this.id
          params.type = 'connect'
          this.listLoading = true
          updateDatabaseV4(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            this.$refs.dbForm.resetFields()
            this.$emit('reload')
          })
        }
      })
    },
    dialogOpen() {
      this.dataForm = {}
      this.$refs.dbForm && this.$refs.dbForm.resetFields()
      this.getDetail()
      // this.queryProductList()
    },
    getDetail() {
      if (!this.id) return
      this.listLoading = true
      getdeitalService({
        configId: this.id
      }).then(res => {
        this.listLoading = false
        this.dataForm = res.data
      })
    },
    changeProduct(id) {
      this.queryProductVersion(id)
    },
    handleClose() {},
    confirm() {},
    close() {}
  }
}
</script>

<style lang="scss" scoped>
.merchantsConfig {
  width: 360px;
}
.tip {
  margin-left: 125px;
  font-size: 12px;
  color: #ff9966;
}
.device-type-select {
  overflow: hidden;
  text-align: center;
  margin-bottom: 20px;
  .device-wrap {
    display: inline-block;
    &.active {
      color: #f56c6c;
    }
    cursor: pointer;
    .iconfont {
      font-size: 42px;
    }
  }
}
</style>
