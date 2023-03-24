<template>
  <el-dialog :title="title" width="600px" :before-close="handleClose" :visible.sync="isShowDialog">
    <el-form
      ref="configDialogForm"
      :rules="rules"
      :inline="true"
      label-position="left"
      label-width="120px"
      :model="configDialogForm"
    >
      <el-col>
        <el-form-item label="名称" prop="name">
          <el-input v-model="configDialogForm.name" clearable size="small" placeholder="请输入名称">
            <!-- <el-button slot="prepend" @click="changeInputVar">{{ isInputVar ? '变量值' : '静态值' }}</el-button> -->
          </el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col v-if="isInputVar">
        <el-form-item label="默认值" prop="defaultValue" style="margin-bottom: 1.22222rem !important;">
          <el-input
            v-model="configDialogForm.defaultValue"
            clearable
            size="small"
            placeholder="请输入默认值"
          />
        </el-form-item>
      </el-col> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="makeConfigData">确定</el-button>
      <el-button @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "sql-params-dialog",
  // props: ['dialogVisible'],
  props: {
    configInfos: {
      default: () => {}
    },
    title: {
      default: () => ""
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isInputVar: false,
      configDialogForm: {
        index: "",
        name: "",
        defaultValue: ""
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        defaultValue: [
          { required: false, message: "请输入默认值", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  watch: {
    configInfos: {
      handler(val) {
        this.configDialogForm = val;
        this.isInputVar = this.configDialogForm.sqlType === 'V'
        // this.configDialogForm.sqlType = this.isInputVar ? 'V' : 'C';
      }
    }
  },
  methods: {
    changeInputVar(){
      this.isInputVar = !this.isInputVar
      this.configDialogForm.sqlType = this.isInputVar ? 'V' : 'C';
    },
    makeConfigData() {
      this.configDialogForm.sqlType = this.isInputVar ? 'V' : 'C';
      if (!this.isInputVar) this.configDialogForm.defaultValue = ''
      this.$refs["configDialogForm"].validate(valid => {
        if (valid) {
          let params = {};
          if (!this.configInfos.index) {
            params = {
              ...this.configDialogForm
            };
            this.$emit("submitAddConfig", {
              ...this.configDialogForm,
              ...params
            });
          } else {
            params = {
              ...this.configDialogForm
            };
            this.$emit("submitEditConfig", {
              ...this.configDialogForm,
              ...params
            });
          }
          this.isShowDialog = false;
          //   this.$refs['configDialogForm'].resetFields()
        } else {
          return false;
        }
      });
    },
    close() {
      // this.$refs['configDialogForm'].resetFields()
      this.isShowDialog = false;
    },

    handleClose() {
      // this.$refs['configDialogForm'].resetFields()
      this.isShowDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.upload_opert {
  color: #02a7f0;
  width: 100px;
  display: inline-block;
  text-align: left;
}
.deleFile {
  margin-left: 30px;
  color: #02a7f0;
  cursor: pointer;
}
</style>
