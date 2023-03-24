<template>
  <div class="app-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/project/all/index' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>控制台</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content-body">
      <h2>{{ projectInfo.projectName }}</h2>
      <div class="content-body-time">发布于：{{ projectInfo.updateTime }}</div>

      <div class="content-body-right">
        <div @click="toUser">
          {{ projectInfo.totalProjectUser }}<br />
          用户数
        </div>
        <div @click="toRole">
          {{ projectInfo.totalProjectRole }} <br />角色数
        </div>
      </div>
      <el-row>
        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>项目入口</span>
            </div>
            <previewContent
              env="prod_paas"
              :projectId="projectId"
            ></previewContent>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProjectInfoService } from "@/api/project";
import previewContent from "@/views/report/modules/preview/preview-content.vue";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "controlBorder",
  components: { previewContent },
  data() {
    return {
      projectId: 0,
      projectInfo: {
        projectName: "项目名称",
        updateTime: "2021/3/8 12:45",
        totalProjectUser: 0,
        totalProjectRole: 0,
      },
    };
  },
  computed: {},
  created() {
    // this.projectInfo= this.$route.params.projectItem

    this.projectId = getStorage("projectId");
    let params = {
      projectId: this.projectId,
    };
    getProjectInfoService(params).then((res) => {
      if (res.code == 0) {
        this.projectInfo.projectName = res.data.projectName;
        this.projectInfo.updateTime = res.data.updateTime;
        this.projectInfo.totalProjectUser = res.data.totalProjectUser;
        this.projectInfo.totalProjectRole = res.data.totalProjectRole;
      }
    });
  },
  mounted() {
    console.log("mounted", this.$route);
  },
  methods: {
    toUser() {
      this.$router.push({ path: "/project/user" });
    },
    toRole() {
      this.$router.push({ path: "/project/role" });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px 20px 0px 20px;
  background-color: #fff;
  height: calc(100vh - 50px);
  position: absolute;
  width: calc(100vw - 70px);
  right: 0;
}
.content-body-right {
  position: absolute;
  right: 20px;
  top: 10px;
  display: flex;
  color: rgb(64, 158, 255);
  font-size: 18px;
  text-align: center;
  cursor: pointer;

  div {
    margin: 0 5px;
  }
}
.content-body-time {
  margin-bottom: 10px;
}
</style>
