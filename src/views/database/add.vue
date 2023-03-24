<template>
  <el-dialog :title="title" width="600px" :visible.sync="isShowDialog" @open="dialogOpen">
    <el-form ref="dbForm" v-loading="listLoading" :rules="rules" :model="dataForm">
      <!--      <div class="device-type-select">
        <p class="device-wrap" :class="{active: isActiveType === 'database'}" style="margin-right: 30px" @click="isActiveType = 'database'">
          <i class="iconfont iconshujuji" />
          <br>
          数据库连接
        </p>
        <p class="device-wrap" :class="{active: isActiveType === 'connect'}" style="margin-right: 30px" @click="isActiveType = 'connect'">
          <i class="iconfont iconcaozuoxitong" />
          <br>
          系统连接
        </p>
      </div> -->
      <el-form-item v-if="isActiveType=='database'" label="数据源名称：" :label-width="formLabelWidth" prop="dataSourceName">
        <el-input v-model="dataForm.dataSourceName" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='connect'" label="系统名称：" :label-width="formLabelWidth" prop="dataSourceName">
        <el-input v-model="dataForm.dataSourceName" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='database'" label="产品名称：" :label-width="formLabelWidth">
        <el-select v-model="dataForm.productInfoId" clearable placeholder="请选择产品" @change="changeProduct">
          <el-option
            v-for="item in productList"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isActiveType=='database'" v-show="productVersionList.length && dataForm.productInfoId" label="产品版本：" :label-width="formLabelWidth">
        <el-select v-model="dataForm.productVersionId" clearable placeholder="请选择产品版本">
          <el-option
            v-for="item in productVersionList"
            :key="item.versionId"
            :label="item.versionName"
            :value="item.versionId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isActiveType=='database'" label="数据库类型：" :label-width="formLabelWidth" prop="dbType">
        <el-select v-model="dataForm.dbType" placeholder="请选择数据库类型">
          <el-option label="MYSQL" value="MYSQL" />
          <el-option label="ORACLE" value="ORACLE" />
          <el-option label="SQLSERVER" value="SQLSERVER" />
        </el-select>
      </el-form-item>
      <el-form-item label="主机地址：" :label-width="formLabelWidth" prop="dbHost">
        <el-input v-model="dataForm.dbHost" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='database'" label="端口：" :label-width="formLabelWidth" prop="dbPort">
        <el-input v-model="dataForm.dbPort" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='database'" label="数据库名称：" :label-width="formLabelWidth" prop="dbName">
        <el-input v-model="dataForm.dbName" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='connect'" label="秘钥：" :label-width="formLabelWidth" prop="secret">
        <el-input v-model="dataForm.secret" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='database'" label="用户名：" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="dataForm.userName" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='database'" label="密码：" :label-width="formLabelWidth" prop="password">
        <el-input v-model="dataForm.password" type="password" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='connect'" label="用户名：" :label-width="formLabelWidth">
        <el-input v-model="dataForm.userName" />
      </el-form-item>
      <el-form-item v-if="isActiveType=='connect'" label="密码：" :label-width="formLabelWidth">
        <el-input v-model="dataForm.password" type="password" />
      </el-form-item>
      <el-form-item label="备注：" :label-width="formLabelWidth">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" placeholder="请输入内容" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="listLoading" @click="isShowDialog = false">取 消</el-button>
      <el-button :disabled="listLoading" @click="testConnect">连接测试</el-button>
      <el-button :disabled="listLoading" type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getdeitalService,
  addService,
  editService,
  testService
} from '@/api/database'
import {
  saveDatabaseV4
} from '@/api/v4'
import { getProductListService, getProductVersionService } from '@/api/product'
export default {
  name: 'Add',
  props: {
    parentId: {
      type: String | Number,
      default: ''
    },
    id: {
      type: String | Number,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isActiveType: 'database',
      listLoading: false,
      formLabelWidth: '120px',
      dataForm: {},
      productList: [],
      productVersionList: [],
      rules: {
        dataSourceName: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
        dbName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
        dbType: [{ required: true, message: '请输入数据库类型', trigger: 'blur' }],
        dbHost: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
        dbPort: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
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
          params.type = this.isActiveType
          this.listLoading = true
          saveDatabaseV4(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            this.$emit('saveDatabase', res)
            this.$refs.dbForm.resetFields()
          })
          // this.listLoading = true
          // addService(params).then(res => {
          //   this.listLoading = false
          //   this.isShowDialog = false
          //   this.$refs.dbForm.resetFields()
          //   this.$emit('reload')
          // })
        }
      })
    },
    edit() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          const params = this.dataForm
          params.id = this.id
          this.listLoading = true
          editService(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            this.$refs.dbForm.resetFields()
            this.$emit('reload')
          })
        }
      })
    },
    testConnect() {
      this.$refs.dbForm.validate(async valid => {
        if (valid) {
          const params = this.dataForm
          const loadingId = this.$loading({
            lock: true,
            text: '测试中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          testService(params).then(res => {
            loadingId.close()
            this.$message.success(res.message)
          }).catch(() => {
            loadingId.close()
          })
        }
      })
    },
    dialogOpen() {
      this.dataForm = {}
      this.$refs.dbForm && this.$refs.dbForm.resetFields()
      this.getDetail()
      this.queryProductList()
    },
    getDetail() {
      if (!this.id) return
      this.listLoading = true
      getdeitalService({
        configId: this.id
      }).then(res => {
        this.listLoading = false
        this.dataForm = res.data
        if (this.dataForm.productInfoId) this.queryProductVersion(this.dataForm.productInfoId)
      })
    },
    changeProduct(id) {
      this.queryProductVersion(id)
    },
    queryProductList() {
      // this.listLoading = true
      getProductListService().then(res => {
        this.productList = res.dataList || []
        // this.listLoading = false
      }).catch(err => {
        // this.listLoading = false
      })
    },
    queryProductVersion(productId) {
      // this.listLoading = true
      getProductVersionService({ productId }).then(res => {
        this.productVersionList = res.dataList || []
        // this.listLoading = false
      }).catch(err => {
        // this.listLoading = false
      })
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
