<template>
  <div v-loading="viewLoading">
    <div class="project-detail-wrap">
      <div class="content">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>现行版本</span>
            <el-button style="float: right; padding: 3px 0" type="text"  @click="addVersionItem"
              >发布新版本</el-button
            >
          </div>
          <div class="text item version_item" v-if="currentVersion.version">
            <div>版本:{{currentVersion.version}}</div>
            <div>{{currentVersion.createTime}}</div>
            <el-button type="text" @click="downloadVersion(currentVersion.fileId)">下载</el-button>
            <!-- <a :href='"http://localhost:40518/version/download?fileId=239"' >下载模板</a> -->
          </div>
          <div class="text item"  v-if="currentVersion.version">注释:{{currentVersion.remark}}</div>
          <div v-else>暂无版本</div>
          <div class="text item version_item">
            <div>执行器地址：</div>
            <el-button type="text" @click="toAgentWork">控制台</el-button>
          </div>
          <div class="text item">{{executorUrl}}</div>
        </el-card>
        <div style="margin-top:10px;margin-bottom:10px">历史版本</div>
        <el-card class="box-card" shadow="hover" v-for="hItem in historyVersionList">
          <div class="text item version_item">
            <div>版本:{{hItem.version}}</div>
            <div>{{hItem.createTime}}</div>
            <div>
              <el-button type="text" @click="putawayVersion(hItem.id)">上架</el-button>
              <el-button type="text" @click="downloadVersion(hItem.fileId)">下载</el-button>
            </div>
          </div>
          <div class="text item">注释:{{hItem.remark}}</div>
        </el-card>
      </div>
    </div>
    <add-dialog  :dialog-visible.sync="dialogVisible" title="发布新版本" @reload="init" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getVersionList,putawayVersionItem } from "@/api/v4";
export default {
  name: "version",
  components: {
    'add-dialog': () => import('./module/add.vue')
  },
  data() {
    return {
      viewLoading: false,
      projectDetail: {},
      dialogVisible: false,
      currentVersion:{
        version:"",
        createTime:"",
        remark:""
      },
      executorUrl:"",
      historyVersionList:[],
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
    }
  },
};
</script>

<style lang="scss" scoped>
.project-detail-wrap{
  background-color: #fff;
}
.version_item {
  display: flex;
  justify-content: space-between;
}
</style>
