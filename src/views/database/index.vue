<template>
  <div>
    <custom-header />
    <br>
    <div class="app-container" style="width: 50%; margin: 0 auto;">
      <div class="right-search-form" style="margin-bottom: 20px">
        <div style="display: inline-block;" :style="{visibility: tabActiveName === 'table' ? 'visible' : 'hidden'}">
          <span>数据源ID：{{ databaseId }}</span>
        </div>
        <!--        <div style="float: right;">
          <span style="margin-right: 50px;" :style="{color: syncStatus === 'completed' ? '#409EFF' : '#f56c6c'}">同步状态：{{ syncStatus === 'completed' ? '同步完成' : '同步中...' }}</span>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-info"
            @click="databaseDetail"
          >数据源详情</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-refresh"
            @click="dataSync"
          >结构同步</el-button>
        </div> -->

      </div>
      <el-form ref="dbForm" v-loading="listLoading" :rules="rules" :model="dataForm">
        <el-form-item label="数据源名称：" :label-width="formLabelWidth" prop="dataSourceName">
          <el-input v-model="dataForm.dataSourceName" />
        </el-form-item>
        <el-form-item label="产品名称：" :label-width="formLabelWidth">
          <el-select v-model="dataForm.productInfoId" clearable placeholder="请选择产品" @change="changeProduct">
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="productVersionList.length && dataForm.productInfoId" label="产品版本：" :label-width="formLabelWidth">
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
    </div>
    <!-- add pop -->
    <!--    <add-dialog
      :id="databaseId"
      :dialog-visible.sync="dialogVisible"
      :title="dialogTitle"
      @reload="fetchData"
    /> -->
    <!-- <detail-dialog
      :id="chooseId"
      :table-name="tableName"
      :dialog-visible.sync="detailDialogVisible"
    /> -->
  <!--  <data-sync-dialog
      :id="databaseId"
      :dialog-visible.sync="dataSyncDialogVisible"
      @reload="reloadSyncData"
    /> -->
  </div>
</template>

<script>
import customHeader from '@/components/customHeader/index'
import {
  getListService,
  getTableListService,
  refreshDatabaseService,
  enableBatchService,
  databaseSyncStatusService,
  testService,
  editService,
  getdeitalService
} from '@/api/database'
import {
  saveDatabaseV4
} from '@/api/v4'
import { getProductListService, getProductVersionService } from '@/api/product'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }

      return statusMap[status]
    }
  },
  components: {
    'add-dialog': () => import('./add.vue'),
    'data-sync-dialog': () => import('./data-sync.vue'),
    customHeader
  },
  props: {
    databaseId: {
      type: String | Number,
      default: ''
    },
    parentId: {
      type: String | Number,
      default: ''
    },
    // id: {
    //   type: String | Number,
    //   default: ''
    // },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataForm: {},
      isActiveType: 'database',
      listLoading: false,
      formLabelWidth: '120px',
      productList: [],
      productVersionList: [],
      searchForm: {},
      chooseId: '',
      tableName: '',
      dialogTitle: '数据库配置',
      dialogVisible: false,
      detailDialogVisible: false,
      dataSyncDialogVisible: false,
      pagination: {
        // totalNumber: 1
      },
      currentPage: 1,
      pageSize: 10,
      databaseList: [],
      databaseTotal: 0,
      tableTotal: 0,
      dataTableList: [],
      contentLeftViewHeight: '0px',
      contentViewHeight: '0px',
      tabActiveName: 'table',
      syncStatus: 'processing',
      timeId: null,
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
  created() {
    // this.fetchData()
    // let databaseId = this.$route.query.databaseId;
    let databaseId = this.databaseId
    if (databaseId && (databaseId = Number(databaseId))) {
      // this.queryDataTableList(databaseId)
      // this.querySyncStatus()
      this.getDetail()
      this.queryProductList()
    }
  },
  mounted() {
    const height =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - 180
    this.contentLeftViewHeight = height + 38 + 'px'
    this.contentViewHeight = height + 'px'
  },
  beforeDestroy() {
    clearTimeout(this.timeId)
  },
  methods: {
    getDetail() {
      if (!this.databaseId) return
      this.listLoading = true
      getdeitalService({
        configId: this.databaseId
      }).then(res => {
        this.listLoading = false
        this.dataForm = res.data
        if (this.dataForm.productInfoId) this.queryProductVersion(this.dataForm.productInfoId)
      })
    },
    queryProductList() {
      // this.listLoading = true
      getProductListService().then(res => {
        this.productList = res.dataList || []
        // this.listLoading = false
      }).catch(err => {
        console.log(err)
        // this.listLoading = false
      })
    },
    queryProductVersion(productId) {
      // this.listLoading = true
      getProductVersionService({ productId }).then(res => {
        this.productVersionList = res.dataList || []
        // this.listLoading = false
      }).catch(err => {
        console.log(err)
        // this.listLoading = false
      })
    },
    save() {
      if (this.databaseId) {
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
          params.id = this.databaseId
          this.listLoading = true
          editService(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            this.$refs.dbForm.resetFields()
            this.getDetail()
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
    changeProduct(id) {
      this.queryProductVersion(id)
    },
    reloadSyncData() {
      this.queryDataTableList()
      this.querySyncStatus()
    },
    handleTabClick() {
      this.queryDataTableList()
    },
    databaseDetail() {
      this.dialogVisible = true
    },
    // dataSync() {
    //   this.dataSyncDialogVisible = true
    // },
    // delDatabase(id) {
    //   const h = this.$createElement
    //   this.$msgbox({
    //     title: '删除',
    //     message: '删除后将会影响已有数据，请认真确认',
    //     showCancelButton: true,
    //     confirmButtonText: '确定删除',
    //     cancelButtonText: '取消'
    //   })
    //     .then(() => {
    //       deleteService({
    //         configId: id
    //       }).then((res) => {
    //         this.fetchData()
    //       })
    //     })
    //     .catch(() => {})
    // },
    // add() {
    //   this.chooseId = "";
    //   this.dialogVisible = true;
    // },
    // edit(id) {
    //   this.chooseId = id;
    //   this.dialogVisible = true;
    // },
    detail(tableData) {
      const databaseId = this.chooseId
      const tableName = tableData.tableName
      const tableId = tableData.tableId

      // this.$router.push({
      //   path: "/databaseInfo",
      //   query: {
      //     databaseId,
      //     tableId,
      //     tableName,
      //   },
      // });
      this.$emit('changeDataType', 'databaseInfo', null, {
        databaseId,
        tableId,
        tableName,
        infoDataType: this.tabActiveName
      })
      // this.tableName = name
      // this.detailDialogVisible = true
      // this.queryTableFieldInfo(chooseId);
    },
    refreshDatabase(dbConfigId) {
      const loading = this.$loading({
        lock: true,
        text: '刷新中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      refreshDatabaseService({
        dbConfigId
      })
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    // querySyncStatus() {
    //   databaseSyncStatusService({
    //     configId: this.chooseId
    //   }).then(res => {
    //     if (res.data.status !== 'completed') {
    //       this.syncStatus = 'processing'
    //       this.timeId = setTimeout(() => {
    //         this.querySyncStatus()
    //       }, 2000)
    //     } else {
    //       this.syncStatus = 'completed'
    //       this.queryDataTableList()
    //     }
    //   })
    // },
    // queryDataTableList(dbConfigId) {
    //   if (dbConfigId) this.chooseId = dbConfigId
    //   this.listLoading = true
    //   const params = {
    //     dbConfigId: this.chooseId,
    //     tableName: this.searchForm.tableName,
    //     page: this.currentPage,
    //     size: this.pageSize,
    //     queryType: this.tabActiveName
    //   }
    //   getTableListService(params)
    //     .then((res) => {
    //       this.dataTableList = res.dataList || []
    //       this.tableTotal = res.totalNumber || 0
    //       this.pagination = {
    //         totalPage: res.totalPage,
    //         totalNumber: res.totalNumber,
    //         pageIndex: res.pageIndex,
    //         pageSize: res.pageSize
    //       }
    //       this.listLoading = false
    //     })
    //     .catch(() => {
    //       this.listLoading = false
    //       // 置空
    //       this.dataTableList = []
    //       this.tableTotal = 0
    //       this.pagination = {}
    //     })
    // },
    fetchData() {
      this.listLoading = true
      const params = {
        dataSourceName: this.searchForm.dataSourceName
      }
      getListService(params)
        .then((res) => {
          this.databaseList = res.dataList || []
          this.databaseTotal = this.databaseList.length
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryDataTableList()
    },
    changeTableEnable(row) {
      var param = {
        tableId: row.tableId,
        enable: row.enable
      }
      var params = []
      params.push(param)
      enableBatchService(params).then((res) => {
        if (res.code == 0) {
          this.queryDataTableList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fl {
  float: left;
}
.fr {
  float: right;
}
ul,
li,
p {
  margin: 0;
  padding: 0;
}
.app-container{
  height:calc(100vh - 51px);
  overflow-y: auto;
}
.input-wrap {
  display: inline-block;
  margin-left: 20px;
  margin-right: 10px;
}
.header-control {
  width: 100%;
  height: 50px;
  .header-title {
    font-size: 18px;
    line-height: 32px;
  }
  .control-btn {
    float: right;
  }
}
.body-left {
  overflow: auto;
  position: absolute;
  width: 350px;
  height: 100%;
  margin: -20px;
  margin-bottom: -40px;
  background-color: #f5f5f5;
  .search-item {
    height: 72px;
    margin-right: 20px;
    margin-bottom: 10px;
    padding-left: 20px;
    background-color: #fff;
    font-size: 14px;
    line-height: 72px;
    cursor: auto;
    .input-wrap {
      width: 175px;
    }
  }
  .source-item-wrap {
    // overflow: auto;
  }
  li {
    position: relative;
    height: 72px;
    margin-right: 20px;
    margin-bottom: 10px;
    padding: 10px 20px;
    font-size: 12px;
    background-color: #fff;
    cursor: pointer;
    &.database-item {
      padding-left: 50px;
    }
    &.database-item.active {
      background-color: #409eff;
      color: #fff;
    }
    &.database-item:hover {
      background-color: #409eff;
      color: #fff;
    }
    .database-item-product {
      font-size: 10px;
    }
    .database-item-icon {
      position: absolute;
      left: 10px;
      top: 12px;
      img {
        width: 30px;
      }
    }
    .database-item-operation {
      position: absolute;
      right: 10px;
      top: 15px;
    }
  }
}
.body-right {
  margin-left: 350px;
  min-height: 500px;
  .right-search-form {
    margin-bottom: 20px;
  }
}
</style>
