<template>
  <div v-loading="viewLoading" class="workflow-setting-container">
    <el-row class="setting-title">系统数据</el-row>
    <el-form
      ref="dataForm"
      label-width="100px"
      label-position="top"
      :model="dataForm"
    >
      <el-form-item label="数据库">
        <el-select v-model="dataForm.dbConfigId" @change="dbconfigChange" clearable>
          <el-option
            v-for="dbItem in dbList"
            :key="dbItem.businessId"
            :label="dbItem.dataSourceName"
            :value="dbItem.businessId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门表">
        <el-select v-model="dataForm.deptTable">
          <el-option
            v-for="tableItem in tableList"
            :key="tableItem.name"
            :label="tableItem.name"
            :value="tableItem.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户表">
        <el-select v-model="dataForm.userTable">
          <el-option
            v-for="tableItem in tableList"
            :key="tableItem.name"
            :label="tableItem.name"
            :value="tableItem.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前用户">
        <el-cascader
          v-model="dataForm.currentUserProcessId"
          :show-all-levels="false"
          :options="interfaceApiAll"
          :props="{ value: 'queryId', label: 'name', emitPath: false }"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="工作流日志">
        <el-select v-model="dataForm.workflowLogTable">
          <el-option
            v-for="tableItem in tableList"
            :key="tableItem.name"
            :label="tableItem.name"
            :value="tableItem.name"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="saveSetting">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getDbSrclist,
  getDbTableList,
  getDbSqlList,
  getDbViewList,
} from "@/api/database-command/index.js";
import { getProjectFileTreeListV5Service } from "@/api/v5";
import { saveWorkFlowSetting, getWorkFlowSetting } from "@/api/workflow/index";
export default {
  components: {},
  data() {
    return {
      viewLoading: false,
      dataForm: {
        dbConfigId: null,
        deptTable: "",
        userTable: "",
        currentUserProcessId: null,
        workflowLogTable: "",
      },
      dbList: [],
      selectDbId: null,
      tableList: [],
      interfaceApiAll: [],
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.initDb();
    this.queryInterfaceDataList();
    this.getSettingInfo();
  },
  methods: {
    initDb() {
      getDbSrclist().then((res) => {
        const dataList = res.dataList || [];
         this.dbList =[]
        dataList.forEach(element => {
          if(element.type=="database"){
            this.dbList.push(element)
          }
        });
      });
    },
    dbconfigChange() {
      this.tableList = [];
      this.initTable();
    },
    initTable() {
      this.queryDbTableList(this.tableList, this.dataForm.dbConfigId);
      this.queryDbViewList(this.tableList, this.dataForm.dbConfigId);
      this.queryDbSqlList(this.tableList, this.dataForm.dbConfigId);
    },
    queryDbTableList(children, dbConfigId) {
      getDbTableList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            dbConfigId,
            dataType: "table",
            name: item.name,
            tableName: item.name,
            // execSqlText: "select * from demo_data",
          });
        });
        // this.handleNodeClick(children[0]);
      });
    },
    queryDbViewList(children, dbConfigId) {
      getDbViewList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            name: item.name,
            dbConfigId,
            dataType: "view",
            execSqlText: item.remarks,
          });
        });
      });
    },
    queryDbSqlList(children, dbConfigId) {
      getDbSqlList({
        dbConfigId,
      }).then((res) => {
        const dataList = res.dataList || [];
        dataList.forEach((item) => {
          children.push({
            dbConfigId,
            dataType: "sql",
            name: item.dataSetName,
            execSqlText: item.execSqlText,
          });
        });
      });
    },
    queryInterfaceDataList() {
      getProjectFileTreeListV5Service().then((res) => {
        this.interfaceApiAll = res.dataList;
      });
    },
    getSettingInfo(){
      getWorkFlowSetting().then(res=>{
           this.dataForm.dbConfigId =res.data.dbConfigId
         this.dataForm.deptTable=res.data.deptTable
         this.dataForm.userTable=res.data.userTable
         this.dataForm.currentUserProcessId=res.data.currentUserProcessId
         this.dataForm.workflowLogTable=res.data.workflowLogTable
      })
    },
    saveSetting() {
      let params = {
        dbConfigId: this.dataForm.dbConfigId,
        deptTable: this.dataForm.deptTable,
        userTable: this.dataForm.userTable,
        currentUserProcessId: this.dataForm.currentUserProcessId,
        workflowLogTable: this.dataForm.workflowLogTable,
      };
      saveWorkFlowSetting(params).then((res) => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.workflow-setting-container {
  .setting-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
