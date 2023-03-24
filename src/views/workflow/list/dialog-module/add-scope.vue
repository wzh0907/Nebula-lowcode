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
      <el-form-item label="名称：" prop="scopeName" size="small">
        <el-input v-model="dataForm.scopeName" maxlength="50" />
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
import { addWorkFlowScope } from "@/api/workflow/index";
export default {
  name: "AddProject",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    scopeName: {
      type: String,
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
    detailData: {},
  },
  data() {
    return {
      isActiveType: "ProcessFlow",
      btnLoading: false,
      dataForm: {
        scopeName: "",
      },
      rules: {
        scopeName: [
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
        scopeName: "",
      };
    },

    saveNew() {
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          //update
          var params = {
            scopeName: this.dataForm.scopeName,
            id: this.id,
          };
          addWorkFlowScope(params).then((res) => {
            if (res.code === 0) {
              this.$emit("initData");
              this.isShowDialog = false;
            }
          });
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
        scopeName: this.scopeName,
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
