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
      label-width="80px"
      :model="dataForm"
    >
      <el-form-item label="名称：" prop="workflowName" size="small">
        <el-input v-model="dataForm.workflowName" maxlength="50" />
      </el-form-item>
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancal">取 消</el-button>
      <!-- <el-button
        type="primary"
        :disabled="btnLoading"
        @click="save"
      >保 存</el-button> -->
      <el-button type="primary" :disabled="btnLoading" @click="saveNew"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { addWorkFlow, renameWorkFlow } from "@/api/workflow/index";
export default {
  name: "AddProject",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
     scopeId: {
      type: String | Number,
      default: "",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    workflowName: {
      type: String,
      default: "",
    },
    detailData: {},
  },
  data() {
    return {
      isActiveType: "ProcessFlow",
      btnLoading: false,
      dataForm: {
        workflowName: "",
      },
      rules: {
        workflowName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
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
  created() {},
  mounted() {},
  methods: {
    cancal() {
      this.isShowDialog = false;
      this.dataForm = {
        workflowName: "",
      };
    },

    saveNew() {
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          //update
          if (this.id) {
            var params = {
              workflowName: this.dataForm.workflowName,
              scopeId:this.scopeId,
              id: this.id,
            };
            renameWorkFlow(params).then((res) => {
              if (res.code === 0) {
                this.$emit("initData");
                this.isShowDialog = false;
              }
            });
          } else {
            var params = {
              workflowName: this.dataForm.workflowName,
              scopeId:this.scopeId,
              scheme:
                '{"nodes":[{"version":1,"id":0,"x":100,"y":81,"title":"开始","type":"start","outputs":[{"id":2837,"x":243,"y":115,"title":null}],"properties":{}}]}',
            };
            addWorkFlow(params).then((res) => {
              if (res.code === 0) {
                this.$emit("initData");
                this.isShowDialog = false;
              }
            });
          }
        }
      });
    },
    // add() {
    //   this.$refs.processForm.validate(async (valid) => {
    //     if (valid) {
    //       let params = {
    //         type: this.isActiveType,
    //         fileName: this.dataForm.fileName,
    //       };
    //       this.btnLoading = true;
    //       addProjectService(params)
    //         .then((res) => {
    //           this.$message.success("添加成功");
    //           this.$store.dispatch("project/getProjectList", true).then(() => {
    //             // location.reload();
    //             this.cancal()
    //             this.btnLoading = false;
    //           });
    //         })
    //         .catch(() => {
    //           this.btnLoading = false;
    //         });
    //     }
    //   });
    // },
    dialogOpen() {
      this.dataForm = {
        workflowName: this.workflowName,
      };
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
