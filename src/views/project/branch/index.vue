<template>
  <div v-loading="viewLoading" class="setting-container">
    <a-row class="setting-title">分支管理</a-row>
    <a-row type="flex">
      <a-col :span="12" style="minwidth: 300px; maxwidth: 500px">
        <a-tree
          :tree-data="treeData"
          :replace-fields="replaceFields"
          @select="onSelect"
        />
      </a-col>
      <a-col :span="12">
        <a-button
          class="branch-botton"
          type="primary"
          v-if="queryId"
          @click="branchSave"
          >新建分支</a-button
        >
        <a-button
          class="branch-botton"
          type="primary"
          v-if="queryId"
          @click="switchBranch"
          >切换分支</a-button
        >
        <a-button class="branch-botton" type="primary" @click="toMerge"
          >合并</a-button
        >
        <a-popconfirm title="确定要删除这个分支吗？" @confirm="deleteBranch">
          <a-button class="branch-botton" type="primary" v-if="branchId > 0"
            >删除</a-button
          >
        </a-popconfirm>
      </a-col>
    </a-row>
    <BranchSaveDialog
      :dialog-visible.sync="branchSaveVisible"
      :queryId="queryId"
      :branchName="branchName"
      title="新建分支"
      @loadData="initBranch"
    />
    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { branchTreeListService, deleteBranchTreeService } from "@/api/branch";
import BranchSaveDialog from "./modal/index";
export default {
  components: { BranchSaveDialog },
  data() {
    return {
      viewLoading: false,
      treeData: [],
      branchId: null,
      queryId:"",
      branchName: "",
      branchSaveVisible: false,
      replaceFields: {
        title: "name",
        key: "branchId",
      },
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.initBranch();
  },
  methods: {
    branchSave() {
      this.branchSaveVisible = true;
    },
    onSelect(selectedKeys, info) {
      console.log("selected", selectedKeys, info);
      if (info.selectedNodes && info.selectedNodes.length > 0) {
        this.queryId = info.selectedNodes[0].data.props.queryId;
        this.branchName = info.selectedNodes[0].data.props.name;
        this.branchId =  info.selectedNodes[0].data.props.branchId;
      }
    },
    initBranch() {
      branchTreeListService().then((res) => {
        if (res.code == 0) {
          this.treeData = res.dataList;
          this.queryId = null;
        this.branchName = null;
        this.branchId =  null;
        }
      });
    },
    switchBranch() {
      this.$store.dispatch("project/setProjectId", Number(this.branchId));
      const merchantId = this.$store.getters.merchantId;
      const routeUrl = this.$router.resolve({
        path: "/design/zh-CN/",
        query: {
          name: this.branchName,
          type: "ALL",
          projectId: this.queryId,
          merchantId: merchantId,
        },
      });
      window.location.href = routeUrl.href;

      location.reload();
    },
    toMerge() {
      this.$emit("toMerge");
    },
    deleteBranch() {
      console.log('----------',this.branchId)
      let params={
        branchId:this.branchId
      }
      deleteBranchTreeService(params).then(res=>{
        if(res.code==0){
          this.$antdMessage.success("删除成功");
          this.initBranch();
        }

      })
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-container {
  width: 100%;
  padding: 24px 0;

  .setting-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  .ant-row {
    margin-bottom: 20px;
  }

  .upload-btn {
    margin: 15px 0 0 15px;
  }
}
.branch-botton {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
