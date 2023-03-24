<template>
  <div  class="version-container" v-loading="viewLoading">
    <h2 style="margin: 20px 0px;float:left;">项目发布</h2>
    <el-button @click="dialogVisible=true" type="primary" size="large" style="margin: 20px 0px;float: right;">发布新版本</el-button>
     <el-table
     
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="version"
        label="版本"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发布时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="agentVersion"
        label="引擎版本">
      </el-table-column>
       <el-table-column
        prop="platform"
        label="平台">
      </el-table-column>
       <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="address"
        label="下载">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">下载地址</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-dialog  :dialog-visible.sync="dialogVisible" title="发布新版本" @reload="init" />
      <download-dialog  :dialog-visible.sync="downdialogVisible" title="下载地址" @reload="init" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getVersionList,putawayVersionItem } from "@/api/v4";
export default {
  name: "version",
  components: {
    'add-dialog': () => import('./module/add.vue'),
    'download-dialog': () => import('./module/download.vue')
  },
  data() {
    return {
      viewLoading: false,
      projectDetail: {},
      dialogVisible: false,
      downdialogVisible:false,
      currentVersion:{
        version:"",
        createTime:"",
        remark:""
      },
      executorUrl:"",
      historyVersionList:[],
      tableData: [{
            version: 'V1',
            createTime: '2021-04-29',
            agentVersion:"V1.1",
            platform:"Android",
            status:"发布中",
          }, {
             version: 'V1',
            createTime: '2021-04-29',
            agentVersion:"V1.1",
            platform:"Android",
            status:"发布中",
          }, {
            version: 'V1',
            createTime: '2021-04-29',
            agentVersion:"V1.1",
            platform:"Android",
            status:"发布中",
          }, {
            version: 'V1',
            createTime: '2021-04-29',
            agentVersion:"V1.1",
            platform:"Android",
            status:"发布中",
          }]
    };
  },
  computed: {
    ...mapGetters(["projectId", "projectList"]),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getVersionList().then((res) => {
        console.log(res);
        if(res.code==0){
          if(res.data.currentVersion){
            this.currentVersion = res.data.currentVersion;
          }
          this.executorUrl = res.data.executorUrl;
          this.historyVersionList = res.data.historyVersionList;
        }
      });
    },
    addVersionItem(){
      this.dialogVisible = true;
    },
    confirmDel() {
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
            ),
          ]
        ),
        showCancelButton: true,
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.del();
        })
        .catch(() => {});
    },
    putawayVersion(versionId){
      var param={
        versionId:versionId
      }
      putawayVersionItem(param).then(res=>{
        if(res.code==0){
          this.$message.success("上架成功");
          this.init();
        }
      });
    },
    downloadVersion(fileId){
      // window.href.location=process.env.VUE_APP_BASE_API+"/version/download?fileId="+fileId;
      window.location.href="http://111.231.101.78:9010/version/download?fileId="+fileId;
    },
    toAgentWork(){
      window.open(this.executorUrl+"/index.html");
    },
    handleClick(){
      this.downdialogVisible=true;
    },
  },
};
</script>

<style lang="scss" scoped>
.version-container{
  padding: 10px;
}
.project-detail-wrap{
  background-color: #fff;
}
.version_item {
  display: flex;
  justify-content: space-between;
}
</style>
