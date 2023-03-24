<template>
  <div class="app-container">
    <div class="header-control">
      <div class="fl header-title">
        <span>开发者管理</span>
      </div>
      <div class="control-btn">
        <div class="input-wrap">
          <el-input
            v-model="searchName"
            size="small"
            placeholder="请输入姓名"
            class="input-with-select"
            clearable
            @keyup.enter.native="queryList"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
            <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
          </el-input>
        </div>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addItem">新增用户</el-button>
<!--        <el-button size="small" type="primary" @click="toRole">用户角色</el-button>-->
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
        @row-click="handleRow"
        :row-key="getRowKey"
      >
        <el-table-column align="center" label="姓名" prop="name">
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center" prop="userName">
          <template slot-scope="scope">
            <div>{{ scope.row.userName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="phoneNumber">
          <template slot-scope="scope">
            <div>{{ scope.row.phoneNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column label="账号状态" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.enable" class="user-state state-active">启用</p>
              <p v-else class="user-state">未启用</p>
              <el-switch
                v-model="scope.row.enable"
                @click.stop.native
                @change="enableUser(scope.row.userId)"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" fixed="right" width="200">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="text" @click.stop="editItem(scope.row.userId)">重置密码</el-button>
              <el-button size="mini" type="text" @click.stop="delItem(scope.row.userId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="pagination.totalNumber && pagination.totalNumber !== 0"
        :current-page="pagination.pageIndex"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.totalNumber"
        @current-change="handleCurrentChange"
      />
    </main-container>
    <!-- add pop -->
    <add-dialog
      :id="chooseEditId"
      :detailData="chooseDataRow"
      :dialog-visible.sync="dialogVisible"
      title="编辑用户"
      @reload="queryList"
    />
    <reset-dialog
      :id="chooseEditId"
      :dialog-visible.sync="resetDialogVisible"
      title="重置密码"
      @reload="queryList"
    />
  </div>
</template>

<script>
import { getUserListService, deleteService, enableService,enableDevelopService } from "@/api/user";

export default {
  name: "user",
  components: {
    "add-dialog": () => import("./module/add.vue"),
    "reset-dialog": () => import("./module/reset.vue")
  },
  data() {
    return {
      chooseDataRow: {},
      chooseEditId: "",
      searchFormData: "",
      listTotal: 0,
      searchType: 0,
      searchName: "",
      searchTypes: [
        {
          label: "名称",
          value: 0
        },
        {
          label: "创建者",
          value: 1
        }
      ],
      navList: [
        {
          title: "根目录",
          id: 0
        }
      ],
      pagination: {
        totalNumber: 1
      },
      currentPage: 1,
      pageSize: 10,
      queryType: "all",
      currentDirId: 0,
      systemParamsList: [],
      listLoading: true,
      dialogVisible: false,
      resetDialogVisible: false
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    toRole() {
      this.$router.push("/role/list");
    },
    addItem() {
      this.dialogVisible = true;
      this.chooseEditId = "";
    },
    editItem(id) {
      this.resetDialogVisible = true;
      this.chooseEditId = id;
    },
    getRowKey(row) {
      return row.userId;
    },
    enableUser(id) {
      enableService({ userId: id }).then(res => {
        this.queryList();
      });
    },
    enableDevelop(row) {
      enableDevelopService({ userId: row.userId }).then(res => {
        this.queryList();
      }).catch(e =>{
        row.develop = !row.develop
      });
    },
    handleRow(row, event, column) {
      this.dialogVisible = true;
      this.chooseEditId = row.userId;
    },
    queryList() {
      this.listLoading = true;
      const params = {
        page: this.currentPage,
        size: this.pageSize
      };
      if (this.searchName) {
        params.name = this.searchName;
      }
      // if (this.searchType === 0 && this.searchFormData) {
      //   params.paramName = this.searchFormData
      // } else if (this.searchType === 1 && this.searchFormData) {
      //   params.createdBy = this.searchFormData
      // }
      getUserListService(params).then(res => {
        const listData = res.dataList || [];
        this.systemParamsList = listData;
        this.listTotal = res.totalNumber;
        this.pagination = {
          totalPage: res.totalPage,
          totalNumber: res.totalNumber,
          pageIndex: res.pageIndex,
          pageSize: res.pageSize
        };
        this.listLoading = false;
      });
    },
    del(id) {
      deleteService({
        userId: id
      }).then(res => {
        this.queryList();
      });
    },
    delItem(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h(
          "p",
          { style: "font-size: 16px; padding: 60px 0px; text-align: center;" },
          [
            h("span", null, "请确认是否删除？"),
            h("br", null, ""),
            h(
              "span",
              { style: "font-size: 12px; color: red" },
              "删除后将会影响已有数据，请认真确认；"
            )
          ]
        ),
        showCancelButton: true,
        confirmButtonText: "确定删除",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.del(id);
        })
        .catch(() => {});
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryList();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container{
  padding:0 20px;
  margin-left: 28px;
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
  margin-left: 10px;
  flex: 1;
}
.header-control {
  width: 100%;
  height: 50px;
  line-height: 50px;

  .header-title {
    font-size: 18px;
    line-height: 50px;
    padding-left:32px;
  }
  .control-btn {
    display: flex;
    align-items: center;
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
