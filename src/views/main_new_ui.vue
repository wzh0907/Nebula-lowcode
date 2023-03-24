<template>
  <div class="app-container" v-loading="viewLoading">
    <div class="project-item-wrap">
      <!-- <el-card body-style="padding: 0px" @click.native="dialogVisible = true" v-has="'project:add'">
        <div class="new-project-card">
          <i class="iconfont iconadd-select" />
          新建项目</div>
      </el-card> -->
      <el-card
        v-for="(item, key) in projectList"
        v-show="
          !filterParams.projectType || filterParams.projectType === item.type
        "
        :key="key"
        :body-style="{ padding: '0px' }"
        shadow="never"
      >
        <div class="device-wrap-card cardPC" @click="entryProject(item)">
          <i class="iconfont iconshoujidiannao"></i>
        </div>
        <!-- <div
          class="device-wrap-card"
          :class="item.type === 'PC' ? 'cardPC' :item.type === 'MOBILE' ? 'cardshouji':'cardyun-xiazai'"
           @click="entryProject(item)"
        >
          <i
            class="iconfont"
            :class="item.type === 'PC' ? 'iconpc' :item.type === 'MOBILE' ? 'iconmobile':'iconcloud'"
          />
        </div> -->
        <div class="card-text">
          <el-input
            v-model="item.projectName"
            size="small"
            v-if="item.editable"
            style="width: 80%"
          />
          <span class="device-text-wrap" :title="item.projectName" v-else>
            {{ item.projectName }}
          </span>
          <i
            title="编辑"
            class="el-icon-check project-confirm"
            v-if="item.editable"
            @click.stop="renameProject(item)"
          ></i>
          <i
            title="编辑"
            class="iconfont iconbianji project-edit"
            v-else
            @click.stop="editProject(item)"
          ></i>
          <div class="bottom clearfix">
            <time class="time" v-if="item.expireTime">{{
              "到期时间：" + item.expireTime
            }}</time>
            <time class="time" v-else>{{
              "更新时间：" + item.updateTime
            }}</time>

            <el-popover
              :visible-arrow="false"
              placement="right"
              width="150"
              trigger="click"
            >
              <ul class="file-popover-menu">
                <!-- <li @click="openControl(item)" v-has="'project:upload'">控制台</li> -->
                <!-- <li @click="uploadMarket(item)" v-has="'project:upload'">上传市场</li> -->
                <li @click="copyProject(item)" v-has="'project:delete'">
                  复制
                </li>
                <li @click="confirmDel(item)" v-has="'project:delete'">删除</li>
              </ul>
              <i slot="reference" class="iconfont iconmenu1 card-menu-btn" />
            </el-popover>
          </div>
        </div>
      </el-card>
    </div>
    <!-- // 上传市场 -->
    <uploadMarketDialog
      :dialog-visible.sync="uploadMarketVisible"
      :project-obj="projectObj"
      :title="uploadMarketTitle"
    />
    <projectAddDialog :dialog-visible.sync="dialogVisible" title="创建新项目" />
    <projectAuthDialog
      :dialog-visible.sync="authDialogVisible"
      :miniqrcode="miniqrcode"
      :authKey="authKey"
      :projectName="projectName"
    />
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import {
  addProjectService,
  deleteProjectService,
  copyProjectService,
} from "@/api/project";
import { enterProjectService } from "@/api/channel";
import { mapGetters } from "vuex";
import uploadMarketDialog from "./report/modules/uploadMarket/index.vue";
import projectAddDialog from "./project/module/add.vue";
import projectAuthDialog from "./project/module/auth.vue";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "Main",
  props: {
    command: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      viewLoading: false,
      filterParams: {
        projectType: "",
      },
      queryType: "MOBILE",
      uploadMarketVisible: false,
      projectObj: {},
      dialogVisible: false,
      authDialogVisible: false,
      miniqrcode: "",
      uploadMarketTitle: "组件上传",
      authKey: "",
      projectName: "",
    };
  },
  computed: {
    ...mapGetters(["projectList"]),
  },

  components: {
    uploadMarketDialog,
    projectAddDialog,
    projectAuthDialog,
  },
  created() {
    this.$store.dispatch("project/getProjectList");
  },
  mounted() {},

  methods: {
    enter(item) {
      this.$set(item, "show", true);
      // item.show = true
    },
    leave(item) {
      item.show = false;
    },
    // 上传市场
    uploadMarket(item) {
      this.uploadMarketVisible = true;
      this.uploadMarketTitle = "应用上传";
      this.projectObj = item;
    },
    openControl(projectItem) {
      // 打开控制台
      this.$store.dispatch("project/setProjectId", projectItem.id);
      setStorage("projectId", projectItem.id);
      this.$router.push({ path: "/controlBorder" });
    },
    // 预览

    entryProject(projectItem) {
      let param = {
        projectId: projectItem.id,
      };
      enterProjectService(param).then((res) => {
        if (res.code == 0) {
          //暂时放开项目授权
          // if(res.data){
          //   this.authDialogVisible=true;
          //   this.authKey = res.data.authKey;
          //   this.projectName = res.data.projectName;
          //   this.miniqrcode = res.data.qrCode;
          // }else{
          this.$store.dispatch("project/setProjectId", Number(projectItem.id));
          const merchantId = this.$store.getters.merchantId;
          const routeUrl = this.$router.resolve({
            path: "/design/zh-CN/",
            query: {
              name: projectItem.projectName,
              type: projectItem.type,
              projectId: projectItem.id,
              merchantId: merchantId,
            },
          });
          window.open(routeUrl.href, "_blank");
          // }
        }
      });
    },
    editProject(item) {
      console.log("edit", item);
      item.editable = true;
      this.$set(this.projectList, item);
      this.$forceUpdate();
    },
    renameProject(item) {
      addProjectService({
        id: item.id,
        projectName: item.projectName,
      })
        .then(() => {
          this.viewLoading = false;
          this.$message.success("修改成功");
          item.editable = false;

          this.$set(this.projectList, item);
          this.$forceUpdate();
        })
        .catch(() => {
          this.viewLoading = false;
        });
    },
    handleCommand(command) {
      this.filterParams.projectType = command;
    },
    changeQueryType(value) {
      this.queryType = value;
    },
    copyProject(item) {
      this.viewLoading = true;
      copyProjectService({
        merchantId: this.$store.getters.merchantId,
        projectId: item.id,
      })
        .then(() => {
          this.viewLoading = false;
          this.$message.success("复制成功");
          this.$store.dispatch("project/getProjectList").then(() => {});
          // this.$set(this.projectList, item);
          // this.$forceUpdate();
        })
        .catch(() => {
          this.viewLoading = false;
        });
    },
    confirmDel(item) {
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
          this.delProject(item);
        })
        .catch(() => {});
    },
    delProject(item) {
      this.viewLoading = true;
      deleteProjectService({
        projectId: item.id,
      })
        .then(() => {
          this.viewLoading = false;
          this.$message.success("删除成功");
          this.$store.dispatch("project/removeProjectId");
          this.$store.dispatch("project/getProjectList").then(() => {
            // location.reload();
            // window.close();
            this.$router.replace("/");
          });
        })
        .catch(() => {
          this.viewLoading = false;
        });
    },
    openMenu(item) {},
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.header-control {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 40px;

  .control-btn {
    float: right;
  }

  .new-project {
    color: #0962ea;
    cursor: pointer;
    font-size: 18px;
  }
}

.range-tab {
  display: flex;
  float: left;
  width: 220px;
  height: 32px;
  padding-left: 24px;
  line-height: 32px;
  font-size: 13px;

  p {
    flex: 1;

    span {
      padding-bottom: 8px;
      cursor: pointer;
      border-bottom: 2px solid transparent;

      &.active {
        color: #eb5757;
        // font-size: 16px;
        font-weight: bold;
        position: relative;
        // border-bottom: 2px solid #f85757;
        // transition: border 0.8s;
      }

      &.active::after {
        content: "";
        border-bottom: 2px solid #f85757;
        transition: border 0.8s;
        width: 24px;
        height: 2px;
        background: #eb5757;
        display: block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
      }
    }
  }
}

.new-project-card {
  width: 280px;
  height: 201px;
  background-color: rgba(47, 40, 48, 1);
  text-align: center;
  color: white;
  font-size: 14px;

  i {
    display: block;
    font-size: 100px;
    line-height: 100px;
    padding-top: 30px;
  }
}

.device-wrap-card {
  width: 280px;
  height: 130px;
  background-color: #1b5fb5;
  color: #fff;
  text-align: center;

  i {
    line-height: 130px;
    font-size: 50px;
  }
}

.cardPC {
  background-color: #1b5fb5;
}

.cardshouji {
  background-color: #db2e1d;
}

.cardyun-xiazai {
  background-color: #ffab05;
}

.project-item-wrap {
  margin-left: 28px;
  display: flex;
  flex-wrap: wrap;

  ul {
    overflow: hidden;
  }

  li {
    position: relative;
    float: left;
    width: 100px;
    overflow: hidden;
    padding-right: 3px;
    margin-right: 24px;
    margin-bottom: 30px;
    text-align: center;
    // 文字超出省略号
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

    .device-wrap {
      margin-bottom: 5px;
      height: 80px;
      line-height: 80px;
      background-color: #fff;
      border-radius: 10px;

      // box-shadow: 3px 3px 2px #ccc;
      i {
        color: #666666;
      }

      .iconfont.iconmolSlice {
        font-size: 40px;
      }

      .iconfont.iconpcSlice {
        font-size: 32px;
      }

      .iconfont.iconcoloudSlice {
        font-size: 36px;
      }
    }

    .device-wrap-opert {
      position: absolute;
      top: 0;
      background: rgba(0, 0, 0, 0.7);
      width: 100%;
      height: 80px;
      line-height: 80px;
      box-shadow: 3px 3px 2px #ccc;
      font-size: 12px;
      display: flex;

      span {
        height: 100%;
        display: inline-block;
        flex: 1;

        &:not(:last-child) {
          border-right: 1px solid #e9e9e9;
        }

        i {
          color: #fff;
          font-size: 22px;
        }
      }
    }
  }
}

.device-text-wrap {
  font-size: 18px;
  line-height: 32px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-card {
  margin: 30px 15px;
  border-radius: 10px;
  box-shadow: 2 2 10 5 rgba(9, 98, 234, 0.1);

  .card-text {
    position: relative;
    padding: 5px;
    width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .project-edit {
      position: absolute;
      cursor: pointer;
      right:5px;
      font-size: 22px;
      color: #999999;
      visibility: hidden;
    }
    .project-confirm {
      float: right;
      cursor: pointer;
      margin-top: 5px;
      font-size: 22px;
    }
    .card-menu-btn {
      position: absolute;
      right: 5px;
      color: #999999;
      cursor: pointer;
      visibility: hidden;
    }
    &:hover .project-edit,
    &:hover .card-menu-btn {
      visibility: initial;
    }
  }
}
.file-popover-menu {
  margin: 0;
  padding: 0;
  font-size: 13px;
  li {
    padding: 5px;
    padding-left: 10px;
    // height: 20px;
    // line-height: 20px;
    cursor: pointer;
  }
  li:hover {
    color: #409eff;
    background-color: #f5f5f5;
  }
}
</style>
