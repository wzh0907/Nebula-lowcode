<template>
  <el-dialog
    :title="title"
    width="600px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form ref="versionForm" :rules="rules" label-width="120px" :model="dataForm">
      <el-form-item label="版本号：" prop="version" size="small">
        <el-input maxlength="100" v-model="dataForm.version"  />
      </el-form-item>
      <el-form-item></el-form-item>
      <!-- <el-form-item label="注释：" prop="remark" size="small">
        <el-input maxlength="200" v-model="dataForm.remark" />
      </el-form-item> -->
      <!-- <el-form-item></el-form-item> -->
      <el-form-item label="发布平台：" prop="serverType" size="small">
        <el-checkbox-group v-model="dataForm.serverType">
          <el-checkbox label="windows server">PC端</el-checkbox>
          <el-checkbox label="linux">Android应用</el-checkbox>
          <el-checkbox label="Docker">iOS应用</el-checkbox>
          <el-checkbox label="wx">微信小程序</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveVersionItem } from '@/api/v4'
export default {
  name: "addVersion",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      listLoading: false,
      dataForm: {
        version: "",
        remark: "",
        serverType: "",
      },     
      rules: {
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
      },
    };
  },
  computed: {
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
    save() {
      // this.add();
       this.listLoading = false
            this.isShowDialog = false
            this.$refs.versionForm.resetFields()
            this.$emit('reload')
    },
    add() {
      this.$refs.versionForm.validate(async (valid) => {
        if (valid) {
          console.log(this.dataForm);
          const params = {
            version: this.dataForm.version,
            remark: this.dataForm.remark,
            serverType: this.dataForm.serverType
          }
          this.listLoading = true
          saveVersionItem(params).then(res => {
            this.listLoading = false
            this.isShowDialog = false
            this.$refs.versionForm.resetFields()
            this.$emit('reload')
          })
        }
      });
    },
    dialogOpen() {
       this.$refs.versionForm && this.$refs.versionForm.resetFields()
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
