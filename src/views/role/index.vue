<template>
  <div class="app-container">
    <div class="header-control">
      <!-- <div class="fl header-title">
        <span>角色管理</span>
      </div> -->
      <div class="control-btn">
        <el-button size="small" type="primary" @click="onPermissionManage">权限管理</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addItem">新增角色</el-button>
      </div>
    </div>

    <main-container>
      <el-table
        v-loading="listLoading"
        :data="systemParamsList"
        element-loading-text="Loading"
        highlight-current-row
        stripe
        style="width: 100%;"
        :row-key="getRowKey"
      >
        <el-table-column align="center" label="角色名称" prop="roleName">
          <template slot-scope="scope">
            <div>{{ scope.row.roleName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="角色说明" align="center" prop="roleExplain">
          <template slot-scope="scope">
            <div>{{ scope.row.roleExplain }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" fixed="right" width="200">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="text" @click.stop="delItem(scope.row.roleId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </main-container>
    <!-- add pop -->
    <add-dialog
      :id="chooseEditId"
      :detail-data="chooseDataRow"
      :dialog-visible.sync="dialogVisible"
      title="编辑角色"
      @reload="queryList"
    />
    <permission-dialog
      :dialog-visible.sync="permissionDialogVisible"
      title="权限详情"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProjectRoleListService, deleteProjectRoleService } from '@/api/role'

export default {
  name: 'User',
  components: {
    'add-dialog': () => import('./module/add.vue'),
    'permission-dialog': () => import('./module/permission-detail.vue')
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  data() {
    return {
      chooseDataRow: {},
      chooseEditId: '',
      searchFormData: '',
      listTotal: 0,
      searchType: 0,
      searchName: '',
      searchTypes: [
        {
          label: '名称',
          value: 0
        },
        {
          label: '创建者',
          value: 1
        }
      ],
      navList: [
        {
          title: '根目录',
          id: 0
        }
      ],
      pagination: {
        totalNumber: 1
      },
      currentPage: 1,
      pageSize: 10,
      queryType: 'all',
      currentDirId: 0,
      systemParamsList: [],
      listLoading: true,
      dialogVisible: false,
      resetDialogVisible: false,
      permissionDialogVisible: false
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    onPermissionManage() {
      this.permissionDialogVisible = true
    },
    addItem() {
      this.dialogVisible = true
      this.chooseEditId = ''
    },
    getRowKey(row) {
      return row.roleId
    },
    handleRow(row, event, column) {
      this.dialogVisible = true
      this.chooseDataRow = {
        roleName: row.roleName,
        roleExplain: row.roleExplain
      }
      this.chooseEditId = row.id
    },
    queryList() {
      this.listLoading = true

      // if (this.searchType === 0 && this.searchFormData) {
      //   params.paramName = this.searchFormData
      // } else if (this.searchType === 1 && this.searchFormData) {
      //   params.createdBy = this.searchFormData
      // }
      getProjectRoleListService({
        projectId: this.projectId
      }).then(res => {
        const listData = res.dataList || []
        this.systemParamsList = listData
        this.listLoading = false
      })
    },
    del(roleId) {
      deleteProjectRoleService({
        roleId: roleId
      }).then(res => {
        this.queryList()
      })
    },
    delItem(roleId) {
      const h = this.$createElement
      this.$msgbox({
        title: '删除',
        message: h(
          'p',
          { style: 'font-size: 16px; padding: 60px 0px; text-align: center;' },
          [
            h('span', null, '请确认是否删除？'),
            h('br', null, ''),
            h(
              'span',
              { style: 'font-size: 12px; color: red' },
              '删除后将会影响已有数据，请认真确认；'
            )
          ]
        ),
        showCancelButton: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.del(roleId)
        })
        .catch(() => {})
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryList()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.app-container{
  padding:0 20px;
}
.fl {
  float: left;
}
p {
  margin: 0;
  padding: 0;
}
.input-wrap {
  display: inline-block;
  margin-right: 10px;
}
.header-control {
  width: 100%;
  height: 50px;
  background-color: white;
  .header-title {
    font-size: 18px;
    line-height: 32px;
  }
  .control-btn {
    margin-top: 8px;
    margin-right: 8px;
    float: right;
  }
}
// 重写el input样式
/deep/ .input-wrap .el-select .el-input {
  width: 110px;
}
/deep/ .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.user-state {
  display: inline-block;
  margin-right: 5px;
}
.state-active {
  color: #409eff;
}
</style>
