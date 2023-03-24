<template>
  <div v-loading="viewLoading" class="workflow-setting-container">
    <el-row class="setting-title" v-if="!showFlow">
      <el-col :span="6">
        <el-row
          ><el-button @click="addScopeVisible = true"
            >添加分类</el-button
          ></el-row
        >
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item
            :index="scopeIndex.toString()"
            :key="scopeIndex"
            v-for="(scopeItem, scopeIndex) in scopeList"
            @click="clickScope(scopeItem)"
          >
            <span slot="title">
              {{ scopeItem.scopeName }}
              <i
                class="el-icon-delete setting-delete"
                style="cursor: pointer"
                @click.stop="delScope(scopeItem)"
              ></i>

              <i
                class="iconfont iconbianji setting-edit"
                style="cursor: pointer"
                @click.stop="editScope(scopeItem)"
              ></i>
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <el-row><el-button @click="openWorkflowDialog">添加工作流</el-button></el-row>
        <el-table :data="flowList" style="width: 100%">
          <el-table-column prop="id" label="id" width="180"> </el-table-column>
          <el-table-column prop="workflowName" label="名称" width="180">
          </el-table-column>
          <el-table-column prop="address" label="备注"> </el-table-column>
          <el-table-column prop="updateBy" label="修改人" width="180">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改日期" width="180">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small"
                >设计</el-button
              >
              <el-button
                @click="handleUpdate(scope.row)"
                type="text"
                size="small"
                >修改</el-button
              >
              <el-button
                @click="handleDelete(scope.row)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <workFlowEdit v-if="showFlow" :id="flowId" @goBack="goBack" />
    <addScopeDialog
      :dialog-visible.sync="addScopeVisible"
      :id="selectScopeId"
      :scopeName="selectScopeName"
      title="添加分类"
      @initData="initScope"
    />
    <addWorkflowDialog
      :dialog-visible.sync="addWorkflowVisible"
      :id="selectFlowId"
      :scopeId="selectScopeId"
      :workflowName="selectFlowName"
      title="添加工作流"
      @initData="initFlowData"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getWorkFlowScopeList,
  getWorkFlowList,
  deleteWorkFlowScope,
} from "@/api/workflow/index";
import workFlowEdit from "@/views/workflow/edit/index.vue";
import addScopeDialog from "./dialog-module/add-scope.vue";
import addWorkflowDialog from "./dialog-module/add-workflow.vue";
export default {
  components: { workFlowEdit, addScopeDialog, addWorkflowDialog },
  data() {
    return {
      viewLoading: false,
      scopeList: [],
      flowList: [],
      flowId: null,
      showFlow: false,
      addScopeVisible: false,
      addWorkflowVisible: false,
      selectScopeId: null,
      selectScopeName:null,
      selectFlowId:null,
      selectFlowName:null,
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.initScope();
  },
  methods: {
    initScope() {
      getWorkFlowScopeList().then((res) => {
        this.scopeList = res.dataList;
      });
    },
    delScope(scopeItem) {
      this.$confirm("请确认是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteScopeService(scopeItem.businessId);
        })
        .catch(() => {});
    },
    deleteScopeService(scopeId) {
      let param = {
        businessScopeId: scopeId,
      };
      deleteWorkFlowScope(param).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.initScope();
      });
    },
    editScope(scopeItem) {
        this.addScopeVisible = true
        this.selectScopeId=scopeItem.businessId
        this.selectScopeName = scopeItem.scopeName
    },
    clickScope(scopeItem) {
      this.selectScopeId=scopeItem.businessId
      this.initFlowList(scopeItem.businessId)
    },
    initFlowData(){
      this.initFlowList(this.selectScopeId)
    },
    initFlowList(businessScopeId){
       let param = {
        businessScopeId: businessScopeId,
      };
      getWorkFlowList(param).then((res) => {
        this.flowList = res.dataList;
      });
    },
    openWorkflowDialog(){
         this.selectFlowId = null
      this.selectFlowName = null
      this.addWorkflowVisible = true
    },
    handleEdit(row) {
      console.log("----------", row);
      this.flowId = row.id;
      this.showFlow = true;
    },
    handleUpdate(row){
      this.selectFlowId = row.id
      this.selectFlowName = row.workflowName
      this.addWorkflowVisible = true
    },
    handleDelete(row) {
      let param = {
        businessId: row.id,
      };

      deleteWorkFlow(param).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.initFlowList(this.selectScopeId);
      });
    },
    goBack() {
      this.showFlow = false;
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
}
.setting-edit {
  float: right;
}
.setting-delete {
  float: right;
  margin-right: 10px;
  margin-top: 20px;
}
</style>
