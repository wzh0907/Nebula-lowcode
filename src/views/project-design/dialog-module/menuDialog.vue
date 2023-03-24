<template>
  <el-dialog
    title="菜单配置"
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
      <el-form-item label="菜单名称：" prop="name" size="small">
        <el-input v-model="dataForm.name" maxlength="50" />
      </el-form-item>
      <el-form-item />
      <el-form-item label="连接页面：">
<!--        <el-select-->
<!--          v-model="dataForm.queryId"-->
<!--          placeholder="请选择"-->
<!--          style="width: 200px"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="item in reportOptions"-->
<!--            :key="item.queryId"-->
<!--            :label="item.name"-->
<!--            :value="item.queryId"-->
<!--          ></el-option>-->
<!--        </el-select>-->
        <el-cascader
          v-model="dataForm.queryId"
          clearable
          :show-all-levels="false"
          :options="reportOptions"
          :props="{value: 'queryId', label: 'name', emitPath: false}"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="菜单图标：" prop="databaseId" size="small">
        <div style="display: flex">
          <div>
            <imgUpload
              :imgSrc="imgUrla"
              @changeConfigValue="changeConfigValue"
            />
            <div>未选中</div>
          </div>
          <div style="margin-left: 20px; text-align: center">
            <imgUpload
              :imgSrc="imgUrlb"
              @changeConfigValue="changeChosenConfigValue"
            />
            <div>选中</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item />
      <el-form-item label="菜单权限：" prop="auth" size="small">
        <el-switch
          v-model="dataForm.auth"
          active-text="打开"
          inactive-text="关闭"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <el-button type="primary" :disabled="btnLoading" @click="save"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import imgUpload from "@/views/report/layout/report-config-basics/basics-config/img-upload.vue";
import { getListAllV4, updateMenuService, saveMenuService } from "@/api/report";
import { saveReportV4 } from "@/api/v4";
import {getReportTreeListV5Service} from "@/api/v5";
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
    menuItem: {
      type: Object,
      default: {},
    },
    dialogVisible: {
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
      reportOptions: [],
      dataForm: {
        name: "",
        databaseId: "",
        auth: false,
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
    initReportList() {
      console.log('*****initReportList*****');
      // const params = {
      //   parentId: 0,
      //   queryType: this.projectType,
      // };
      // Object.assign(params, this.searchForm)
      // getListAllV4(params).then((res) => {
      //   this.reportOptions = res.dataList || {};
      // });

      const data = {
        queryType: this.projectType,
      };
      getReportTreeListV5Service(data).then((res) => {
        this.reportOptions = res.dataList || [];
      });
    },
    save() {
      let that = this;
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          if (this.dataForm.id) {
            this.menuItem.name = this.dataForm.name;
            this.menuItem.imgFileId = this.dataForm.imgFileId;
            this.menuItem.imgFileUrl = this.imgUrla;
            this.menuItem.chosenFileId = this.dataForm.chosenFileId;
            this.menuItem.chosenFileUrl = this.imgUrlb;
            this.menuItem.auth = this.dataForm.auth;
            this.menuItem.queryId = this.dataForm.queryId;
            updateMenuService(this.menuItem).then((res) => {
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
      params.queryId = this.dataForm.queryId;
      // let saveFileService = saveReportV4;

      this.triggerLoading();
      // saveFileService(params).then((res) => {
      //   if (res.code == 0) {
      //     params.queryId = res.data.reportId;

      //   }
      // });

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
        id: this.menuItem.id,
        name: this.menuItem.name,
        auth: this.menuItem.auth,
        queryId: this.menuItem.queryId,
      };
      this.imgUrla = this.menuItem.imgFileUrl;
      this.imgUrlb = this.menuItem.chosenFileUrl;
      this.initReportList();
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
