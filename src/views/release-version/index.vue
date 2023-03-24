<template>
  <div v-loading="viewLoading" class="release-container">
    <el-row  style="margin-top:50px;margin-bottom: 5px">
      <el-col :span="8" :offset="8" class="release-title">
        请输入执行引擎地址
        <el-link
          target="_blank"
          class="guide"
          type="primary"
          href="https://qiekcaj4o3.feishu.cn/docs/doccnlegg7baW8B682IwPW83XSh"
          >执行引擎安装指南</el-link
        >
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 80px">
      <el-col :span="8" :offset="8">
        <el-input v-model="executorUrl" placeholder="http://localhost:8442">
          <template slot="append">
            <div class="bushu" @click="syncData">
              <i class="iconfont iconfabu bushuicon"></i>部署项目
            </div>
          </template>
        </el-input>
      </el-col>
      <el-col :span="8"> </el-col>
    </el-row>

    <el-row class="first" :gutter="12" v-show="executorUrl && executorUrl.length > 0">
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="release-title">
            <span>数据库管理</span>
          </div>
          <dbConfig
            ref="dbconfig"
            :executorUrl="executorUrl"
            v-if="executorUrl"
          />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="release-title">
            <span>系统管理</span>
          </div>
          <connect
            ref="connect"
            :executorUrl="executorUrl"
            v-if="executorUrl"
          />
        </el-card>
      </el-col>

      <el-col :span="8" style="margin-bottom: 20px">
        <el-card shadow="hover">
          <div slot="header" class="release-title">
            <span>生产环境</span>
          </div>
          <div style="text-align: center">
            <i
              class="iconfont icondrgs26"
              style="font-size: 150px; cursor: pointer"
              @click="toPcDoor"
            />
            <div class="preview-in">
              <el-link type="primary" @click="toPcDoor">点击进入</el-link>
            </div>

            <div
              style="
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-top: 10px;
              "
              width="150px"
            >
              PC端
            </div>
          </div>
          <previewContent
            env="prod_paas"
            width="150px"
            :projectId="projectId"
          ></previewContent>
        </el-card>
      </el-col>
    </el-row>
<!--    <el-row :gutter="12">-->
<!--      <el-col :span="16">-->
<!--        <el-card shadow="hover">-->
<!--          <projectUser />-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="8">-->
<!--        <el-card shadow="hover">-->
<!--          <projectRole />-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import dbConfig from "./dbconfig";
import connect from "./connect";
import previewContent from "@/views/report/modules/preview/preview-content.vue";
import { getProjectKeyService, updateExecutorUrlService } from "@/api/project";

import projectUser from "@/views/project-user/index.vue";
import projectRole from "@/views/project-role/index.vue";
export default {
  components: { dbConfig, connect, previewContent, projectUser, projectRole },
  data() {
    return {
      steps: 0,
      menuActive: 1,
      projectKey: "",
      executorUrl: "",
      viewLoading: false,
    };
  },
  computed: {
    ...mapGetters(["projectId"]),
  },
  created() {
    this.projectType = this.$route.query.type;
    this.getProjectInfo();
  },
  methods: {
    handleSelect(index, indexPath) {
      this.menuActive = index;
      console.log("handle", index, indexPath, this.menuActive);
    },
    getProjectInfo() {
      getProjectKeyService({ projectId: this.projectId }).then((res) => {
        this.projectKey = res.data.projectKey;
        this.$nextTick(() => {
          this.executorUrl = res.data.executorUrl;
          console.log("getProjectInfo", res, this.executorUrl);
        });
      });
    },
    last() {
      this.steps--;
    },
    next() {
      this.steps++;
    },
    toPcDoor() {
      window.open(this.executorUrl + "/portal/pc/index.html#/", "_blank");
    },
    syncData() {
      let that = this;
      if (this.executorUrl) {
        this.viewLoading = true;
        axios
          .get(this.executorUrl + "/sync/v1/config?appKey=" + this.projectKey)
          .then(function (res) {
            if (res.data.code == 0) {
              let param = {
                id: that.projectId,
                executorUrl: that.executorUrl,
              };
              updateExecutorUrlService(param).then((subRes) => {
                console.log(subRes);
                if (subRes.code == 0) {
                  that.$message.success("部署成功");
                  that.$refs["dbconfig"].queryList();
                  that.$refs["connect"].queryList();
                }
              });
            }
          })
          .catch(function (exception) {
            console.log(exception);
            that.$message.error("部署失败");
          })
          .finally(() => {
            that.viewLoading = false;
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 300px;
  margin: auto;
}
.content2 {
  width: 400px;
  margin: auto;
}
.release-container {
  height: calc(100vh - 50px);
  padding: 20px;
  background: #fff;
  margin-left: 16px;
  overflow-y: auto;
  /deep/.el-step__head.is-finish {
    color: #037afe;
    border-color: #037afe;
  }
  /deep/.el-step__title.is-finish {
    color: #037afe;
  }
  /deep/.el-step__description.is-finish {
    color: #037afe;
  }
  /deep/.el-step__head.is-wait {
    color: #999999;
    border-color: #999999;
  }
  /deep/.el-step__title.is-wait {
    color: #999999;
  }
  /deep/.el-step__description.is-wait {
    color: #999999;
  }
}
.step {
  margin: 20px 0;
}
.distance_top {
  margin-top: 10px;
}
.release_step {
  font-weight: bold;
}
.guide {
  float: right;
}
.bushu {
  color: #409eff;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.bushuicon {
  font-size: 32px;
}
.release-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
}
.first {
  /deep/.el-card__body {
    height: 528px;
  }
}
</style>


