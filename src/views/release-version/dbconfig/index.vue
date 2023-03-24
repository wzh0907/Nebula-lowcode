<template>
  <div class="app-container">
    <div class="db-div">
      <div class="nodata" v-if="dbconfigList.length==0">
        <i class="iconfont iconzanwushuju nodataicon" />
        <div>暂无数据</div>

      </div>
      <div
        v-for="(dbItem, key) in dbconfigList"
        :key="key"
        class="db-div-item"
        @click="editItem(dbItem)"
      >
        <img
          src="@/assets/images/mysql.png"
          class="db-img"
          v-if="dbItem.dbType == 'MYSQL'"
        />
        <img
          src="@/assets/images/oracle.png"
          class="db-img"
          v-if="dbItem.dbType == 'ORACLE'"
        />
        <img
          src="@/assets/images/sqlServer.png"
          class="db-img"
          v-if="dbItem.dbType == 'SQLSERVER'"
        />
        <div>
          <span class="db-datasource">{{ dbItem.dataSourceName }}</span>
          <div style="word-break: break-all">{{ dbItem.dbHost }}</div>
        </div>
      </div>
    </div>

    <!-- <el-table
        v-loading="listLoading"
        :data="dbconfigList"
        element-loading-text="Loading"
        height="500"
        highlight-current-row
        stripe
        style="width: 100%;"
        :row-key="getRowKey"
      >
        <el-table-column align="center" label="name" prop="roleName">
          <template slot-scope="scope">
            <div>{{ scope.row.dataSourceName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="地址" align="address" prop="roleExplain">
          <template slot-scope="scope">
            <div>{{ scope.row.dbHost }}</div>
          </template>
        </el-table-column>
          <el-table-column label="端口" align="port" prop="roleExplain">
          <template slot-scope="scope">
            <div>{{ scope.row.dbPort }}</div>
          </template>
        </el-table-column>
         <el-table-column label="userName" align="userName" prop="roleExplain">
          <template slot-scope="scope">
            <div>{{ scope.row.userName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" fixed="right" width="200">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="text" @click.stop="editItem(scope.row)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table> 
 <el-pagination
                    :page-size="pageSize"
                    :current-page="currentPage"
                    layout="prev, pager, next"
                    :total="pageTotal"
                    @current-change="handleCurrentChange"
                  >
                  </el-pagination>-->
    <!-- add pop -->
    <edit-dialog
      :id="chooseEditId"
      :executorUrl="executorUrl"
      :detail-data="chooseDataRow"
      :dialog-visible.sync="dialogVisible"
      title="编辑数据源"
      @reload="queryList"
    />
    <!--
    <permission-dialog
      :dialog-visible.sync="permissionDialogVisible"
      title="权限详情"
    /> -->
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "dbConfig",
  components: {
    "edit-dialog": () => import("./module/edit.vue"),
  },
  computed: {
    ...mapGetters(["projectId"]),
  },
  props: {
    executorUrl: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      chooseDataRow: {},
      chooseEditId: "",
      searchFormData: "",
      listTotal: 0,
      searchType: 0,
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      dbconfigList: [],
      searchName: "",
      searchTypes: [
        {
          label: "名称",
          value: 0,
        },
        {
          label: "创建者",
          value: 1,
        },
      ],
      navList: [
        {
          title: "根目录",
          id: 0,
        },
      ],
      pagination: {
        totalNumber: 1,
      },
      currentPage: 1,
      pageSize: 10,
      queryType: "all",
      currentDirId: 0,
      systemParamsList: [],
      listLoading: true,
      dialogVisible: false,
      resetDialogVisible: false,
      permissionDialogVisible: false,
    };
  },
  created() {},
  mounted() {
    this.queryList();
  },
  methods: {
    onPermissionManage() {
      this.permissionDialogVisible = true;
    },
    addItem() {
      this.dialogVisible = true;
      this.chooseEditId = "";
    },
    getRowKey(row) {
      return row.roleId;
    },

    queryList() {
      let that = this;
      this.listLoading = true;
      const params = {
        page: this.currentPage,
        size: this.pageSize,
      };
      if (this.executorUrl) {
        axios
          .get(this.executorUrl + "/dbconfig/v1/list", params)
          .then(function (res) {
            // window.open("http://"+res.data.file,"_blank")
            that.dbconfigList = res.data.dataList;
            that.listLoading = false;
          });
      }
    },
    editItem(row) {
      console.log("edit", row);
      this.chooseEditId = row.id;
      this.chooseDataRow = row;
      this.dialogVisible = true;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.queryList();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.app-container {
  padding: 0 20px;
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
.db-div {
  display: flex;
  flex-wrap: wrap;
  .db-div-item {
    display: flex;
    width: 100%;
    padding: 10px;
    margin: 10px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    .db-datasource {
      font-size: 16px;
      line-height: 40px;
      font-weight: 700;
    }
  }
}
.db-img {
  width: 100px;
  margin-right: 10px;
}
.nodata{
  font-size: 30px;
  color:#dcdfe6;
  text-align: center;
  height: 500px;
  margin: auto;
  display: flex;
  flex-direction:column;
  align-items:center;
  align-content:center;
  justify-content:center;
}
.nodataicon{
  font-size: 100px;
  color:#dcdfe6;
}
</style>
