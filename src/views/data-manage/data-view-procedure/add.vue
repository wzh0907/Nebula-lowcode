<template>
  <el-dialog
    title="数据"
    width="450px"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form
      ref="processForm"
      :rules="rules"
      label-width="80px"
      :model="dataForm"
    >
      <el-form-item></el-form-item>
      <el-form-item label="名称：" prop="fileName" size="small">
        <el-input v-model="dataForm.fileName" maxlength="50" />
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
export default {
  name: "addProject",
  props: {
    addDataType: {
      type: String,
      default: ''
    },
    // id: {
    //   type: String | Number,
    //   default: "",
    // },
    // entryDirId: {
    //   type: String | Number,
    //   default: '0',
    // },
    dialogVisible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // addDataType: 'Dataset',
      btnLoading: false,
      dataForm: {
        fileName: '',
        // databaseId: ''
      },
      rules: {
        fileName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        // databaseId: [
        //   { required: true, message: "请选择数据源", trigger: "change" },
        // ],
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
        fileName: '',
        // databaseId: ''
      };
    },
    save() {
      this.$refs.processForm.validate(async (valid) => {
        if (valid) {
          this.$emit('addFile', this.addDataType, this.dataForm.fileName)
          // if (this.addDataType === 'Dataset') {
          //   this.$emit('addFile', 'dataset', this.dataForm.fileName)
          // } else if (this.addDataType === 'Script') {
          //   this.$emit('addFile', 'datasetScript', this.dataForm.fileName)
          // } else if (this.addDataType === 'View') {
          //   this.$emit('addFile', 'view', this.dataForm.fileName)
          // } else if (this.addDataType === 'StoredProcedure') {
          //   this.$emit('addFile', 'procedure', this.dataForm.fileName)
          // }
          this.isShowDialog = false;
        }
      })
    },
    dialogOpen() {
      this.$refs.processForm && this.$refs.processForm.resetFields()
      // this.addDataType = 'Dataset';
      this.dataForm = {
        fileName: '',
        // databaseId: ''
      };
    },
  },
};
</script>

<style lang="scss" scoped>
// .device-type-select {
//   overflow: hidden;
//   text-align: center;
//   margin-bottom: 20px;
//   .device-wrap {
//     display: inline-block;
//     &.active {
//       color: #f56c6c;
//     }
//     cursor: pointer;
//     .iconfont {
//       font-size: 42px;
//     }
//   }
// }
</style>
