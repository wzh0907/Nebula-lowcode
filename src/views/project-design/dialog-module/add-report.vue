<template>
  <el-dialog
    :title="title"
    width="1000px"
    :visible.sync="isShowDialog"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >
    <el-form
      ref="processForm"
      :rules="rules"
      label-width="120px"
      :model="dataForm"
    >
      <div class="creat_project_main">
        <div class="created_left">
          <div>
            创建新页面
          </div>
          <ul>
            <li v-for="(item,index) in businessTypeList" :key="index" :class="{active:selectTypeStatus == index}" @click="selectType(index,1,item)">
              <span>{{ item.dictName }}</span>
            </li>
          </ul>
        </div>
        <div class="created_right">
          <div class="created_right_top">
            <el-form-item label="页面名称：" prop="fileName" size="small" style="width:400px">
              <el-input v-model="dataForm.fileName" maxlength="50" />
            </el-form-item>
            <div class="device-type-select">
              <!-- <p class="device-wrap" :class="{active: isActiveType === 'FROM'}" @click="isActiveType = 'FROM';delete dataForm.fromProjectId">
              <i class="iconfont iconcoloudSlice"></i>
            </p> -->
            </div>
          </div>
          <div class="created_right_bottom">
            <div style="font-size: 16px;">
              组件模板
            </div>
            <div class="device-type-project-list">
              <ul v-if="markAppList.length>0">
                <li v-for="(item,index) in markAppList" :key="index" @click="selectType(index,2,item)">
                  <img v-if="item.cpntLogo" :class="{active:selectProjectStatus == index}" :src="item.cpntLogo" alt="">
                  <img v-else :class="{active:selectProjectStatus == index}" src="../../../assets/noImg.png" alt="">
                  <span :class="{active:selectProjectStatus == index}">{{ item.cpntName }}</span>
                </li>
              </ul>
              <div v-else>
                暂无数据
              </div>
            </div>
          </div>

        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <el-button
        type="primary"
        :disabled="btnLoading"
        @click="save"
      >保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addProjectService,
  getMarketProjectListService,
  getProjectBusinessType,
} from "@/api/project";
import { checkMktCommentList, mktApplyCpntDown } from "@/api/componentApply";

export default {
  name: "AddProject",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    entryDirId: {
      type: String | Number,
      default: "0",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    detailData: {},
  },
  data() {
    return {
      selectProjectStatus: -1,
      selectTypeStatus: 0,
      businessTypeList: [],
      isActiveType: "Report",
      dictCode: "",
      btnLoading: false,
      markAppList: [], // 项目列表
      dataForm: {
        fileName: "",
        businessType: "",
      },
      rules: {
        fileName: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      marketProjectList: [],
    };
  },
  computed: {
    // ...mapGetters(["markAppList"]),
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  created() {
    this.getBusinessType();
  },
  mounted() {
    // getMarketProjectListService().then((res) => {
    //   if (res.code == 0) {
    //     this.marketProjectList = res.dataList;
    //   }
    // });
  },
  methods: {
    // 获取应用项目业务类型
    getBusinessType() {
      // getProjectBusinessType().then((res) => {
      //   if (res.code == 0) {
      //     this.businessTypeList = res.dataList;
      //     this.dictCode = res.dataList[0].dictCode;
      //   }
      // });
    },
    selectType(index, type, item) {
      if (type == 1) {
        this.selectTypeStatus = index;
        this.dataForm.businessType = item.cpntType;
        this.dictCode = item.dictCode;
        this.getMktAppList(item.dictCode);
      } else {
        item.checked = !item.checked;
        this.selectProjectStatus = index;
        this.getSelectProject(item);
      }
    },
    // 获取选中的模板
    getSelectProject() {
      this.markAppList.forEach((item) => {
        if (item.checked) {
          // this.dataForm.fileName = item.cpntName
          // this.dataForm.subType = item.subType
          // this.dataForm.fromProjectId = item.fromProjectId
          this.dataForm.businessId = item.id;
        }
      });
    },
    cancal() {
      this.isShowDialog = false;
      this.dataForm = {
        fileName: "",
      };
    },
    createGroupComment() {
      this.$emit("addFile", "groupComponent", this.entryDirId, "未命名");
    },
    save() {
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          if (this.isActiveType === "Report") {
            // 选了模板就是走down 接口
            if (this.dataForm.businessId) {
              let obj = {
                id: this.dataForm.businessId,
                dirParentId: this.entryDirId,
                name: this.dataForm.fileName,
              };
              console.log("save", obj);
              const loading = this.$loading({
                lock: true,
                text: "下载中",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
              });
              mktApplyCpntDown(obj)
                .then((res) => {
                  if (res.code === 0) {
                    loading.close();
                    this.$message({
                      message: "下载成功",
                      type: "success",
                    });
                    this.$emit("uploadDirTree", res.data.treeId);
                  } else {
                    loading.close();
                  }
                })
                .catch((err) => {
                  loading.close();
                });
            }else{
  //  没选就是 正常添加
            this.$emit(
              "addFile",
              "report",
              this.entryDirId,
              this.dataForm.fileName,
              this.dataForm.businessId
            );
            }

          
          } else if (this.isActiveType === "GroupComponent") {
            this.$emit(
              "addFile",
              "groupComponent",
              this.entryDirId,
              this.dataForm.fileName
            );
          }
          this.isShowDialog = false;
        }
      });
    },
    // 获取我的全部组件市场列表
    getMktAppList(code) {
      const obj = {
        projectBusinessType: code,
        projectType: this.$route.query.type,
        subType: "report",
      };
      checkMktCommentList(obj).then((res) => {
        this.markAppList = res.dataList;
      });
    },
    dialogOpen() {
      this.getMktAppList(this.dictCode);
      this.dataForm = {
        fileName: "",
      };
      // this.isActiveType = 'MOBILE'
      this.selectProjectStatus = -1;
    },
  },
  beforeDestory() {
    window.removeEventListener(
      `on-preload-creat-group`,
      this.createGroupComment
    );
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  border-radius: 12px !important;
}
.el-button--primary {
  background-color: #eb5757;
  border-color: #eb5757;
}
.el-button--primary:hover {
  background: #ec7b7b;
  border-color: #ec7b7b;
}
.creat_project_main {
  display: flex;
  .created_left {
    width: 100px;
    border-right: 1px #f2f2f2 solid;
    ul {
      li {
        padding: 10px 0;
        cursor: pointer;
        &.active {
          color: #eb5757;
        }
      }
    }
  }
  .created_right {
    flex: 1;
    .device-type-select {
      overflow: hidden;
      text-align: center;
      margin-top: 16px;
      display: flex;
      align-items: center;
      .device-wrap {
        display: inline-block;
        border: 1px solid #ccc;
        padding: 20px 30px;
        border-radius: 10px;
        &.active {
          color: #eb5757;
          border: 1px solid #eb5757;
        }
        cursor: pointer;
        .iconfont {
          font-size: 42px;
        }
        span {
          display: block;
        }
      }
    }
    .created_right_bottom {
      margin-top: 16px;
      margin-left: 16px;
      .device-type-project-list {
        width: 100%;
        height: 300px;
        overflow: auto;
        ul {
          li {
            float: left;
            margin: 20px 40px 0 0;
            cursor: pointer;
            span {
              display: block;
              margin: 10px 0;
              &.active {
                color: #eb5757;
              }
            }
            img {
              width: 162px;
              height: 132px;
              border-radius: 10px;
              &.active {
                color: #eb5757;
                border: 1px solid #eb5757;
              }
            }
          }
        }
      }
    }
  }
}
</style>
