<template>
  <el-dialog
    :title="title"
    width="450px"
    :visible.sync="isShowDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >
    <el-form
      ref="processForm"
      :rules="rules"
      label-width="100px"
      :model="dataForm"
    >
      <el-form-item label="页面名称：" prop="name" size="small">
        <el-input v-model="dataForm.name" maxlength="50" />
      </el-form-item>
      <el-form-item />
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <el-button type="primary" :disabled="btnLoading" @click="saveSubPage"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
import { updateMenuService, saveMenuService } from "@/api/report";
import { renameReportService, saveReportV4 } from "@/api/v4";
import { mktApplyCpntDown } from "@/api/componentApply";
import { saveSubItemService } from "@/api/v5";
export default {
  name: "menuDialog",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    parentId: {
      type: Number,
      default: 0,
    },
    pageItem: {
      type: Object,
      default: {},
    },
    entryDirId: {
      type: String | Number,
      default: "0",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    projectType: {
      type: String,
      default: "",
    },

    detailData: {},
  },
  components: {
    imgUpload,
  },
  data() {
    return {
      isActiveType: "Script",
      btnLoading: false,
      loaderObj: {},
      subPageName: "",
      dataForm: {
        name: "",
      },
      imgUrla: "",
      imgUrlb: "",
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    // ...mapGetters(["projectList"]),
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    cancal() {
      this.isShowDialog = false;
    },
    save() {
      let that = this;
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          if (this.dataForm.id) {
            this.pageItem.name = this.dataForm.name;
            this.pageItem.imgFileId = this.dataForm.imgFileId;
            this.pageItem.imgFileUrl = this.imgUrla;
            this.pageItem.chosenFileId = this.dataForm.chosenFileId;
            this.pageItem.chosenFileUrl = this.imgUrlb;
            this.pageItem.auth = this.dataForm.auth;
            updateMenuService(this.pageItem).then((res) => {
              that.isShowDialog = false;
            });
          } else {
            //新增
            this.addMenu(this.parentId);
          }
        }
      });
    },
    addMenu(parentId) {
      let fileName = this.dataForm.name;
      const params = {
        queryType: this.projectType,
        name: fileName,
        reportName: fileName,
        dataType: "report",
        subType: "report",
        visible: true,
        auth: this.dataForm.auth,
      };
      parentId = typeof parentId == "number" ? parentId : 0;
      params.parentId = parentId;

      let saveFileService = saveReportV4;

      this.triggerLoading();
      saveFileService(params).then((res) => {
        if (res.code == 0) {
          params.queryId = res.data.reportId;
          saveMenuService(params).then((mres) => {
            if (mres.code == 0) {
              if (
                this.loaderObj.close &&
                typeof this.loaderObj.close === "function"
              )
                this.loaderObj.close();
              this.isShowDialog = false;
              this.$emit("initData");
            }
          });
        }
      });
    },
    triggerLoading() {
      this.loaderObj = this.$loading({
        lock: true,
        text: "处理中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    changeConfigValue(configOptions, configKey, value, fileId) {
      this.imgUrla = value;
      this.dataForm.imgFileId = fileId;
    },
    changeChosenConfigValue(configOptions, configKey, value, fileId) {
      this.imgUrlb = value;
      this.dataForm.chosenFileId = fileId;
    },
    dialogOpen() {
      this.$refs.processForm && this.$refs.processForm.resetFields();
      this.dataForm = {
        id: this.pageItem.id,
        name: this.pageItem.name,
        auth: this.pageItem.auth,
      };
      this.imgUrla = this.pageItem.imgFileUrl;
      this.imgUrlb = this.pageItem.chosenFileUrl;
    },
    updatePage() {
      let params = {
        reportId: this.pageItem.queryId,
        reportName: this.dataForm.name,
      };
      renameReportService(params).then((res) => {
        // this.$emit("updatePageComplete", params);
        this.$emit("initData", res.data.treeId);
      });
    },
    // TODO 这边还没考虑修改
    saveSubPage() {
      let fileName = this.dataForm.name;
      if (this.pageItem.queryId) {
        this.updatePage();
      } else {
        const params = {
          queryType: this.projectType,
          name: fileName,
          reportName: fileName,
          type: "report",
          subType: "report",
          visible: true,
          parentId: this.parentId,
        };

        saveReportV4(params).then((res) => {
          // this.initData(res.data.treeId);

          if (!this.id) {
            this.$emit("initData", res.data.treeId);
          } else if (res.code == 0) {
            this.$emit("initData");
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.device-type-select {
  overflow: hidden;
  text-align: center;
  margin-bottom: 20px;
  .device-wrap {
    display: inline-block;
    &.active {
      color: #f56c6c;
    }
    cursor: pointer;
    .iconfont {
      font-size: 42px;
    }
  }
}
</style>
