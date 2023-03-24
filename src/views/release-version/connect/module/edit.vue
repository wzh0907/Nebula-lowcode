<template>
  <el-dialog
    :title="title"
    width="450px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form
      ref="dataForm"
      v-loading="listLoading"
      label-width="120px"
      :rules="rules"
      :model="dataForm"
    >
      <el-form-item label="系统名称：" prop="dataSourceName">
        <el-input v-model="dataForm.dataSourceName" />
      </el-form-item>
      <el-form-item label="主机地址：" prop="dbHost">
        <el-input v-model="dataForm.dbHost" />
      </el-form-item>
      <el-form-item label="秘钥：" prop="secret">
        <el-input v-model="dataForm.secret" />
      </el-form-item>
      <el-form-item label="用户名：" prop="userName">
        <el-input v-model="dataForm.userName" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="dataForm.password" type="password" />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "addRole",
  props: {
    id: {
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
    detailData: {},
    executorUrl: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      listLoading: false,
      authorityAllList: [],
      dataForm: {},
      roleList: [],
      rules: {
        dataSourceName: [
          { required: true, message: "请输入系统名称", trigger: "blur" },
        ],
        dbHost: [
          { required: true, message: "请输入主机地址", trigger: "blur" },
        ],
        // secret: [{ required: true, message: '请输入秘钥', trigger: 'blur' }],
        // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        // password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
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
    ...mapGetters(["projectId"]),
  },
  created() {},
  mounted() {},
  methods: {
    save() {
      if (this.id) {
        this.edit();
      }
    },

    edit() {
      let that = this;
      this.$refs.dataForm.validate(async (valid) => {
        if (valid) {
          this.listLoading = true;
          axios
            .put(this.executorUrl + "/dbconfig/v1/item", this.dataForm)
            .then(function (res) {
                that.$message.success('编辑成功')
              // window.open("http://"+res.data.file,"_blank")
              that.listLoading = false;
              that.isShowDialog = false;
              that.$refs.dataForm.resetFields();
              that.$emit("reload");
            });
        }
      });
    },
    dialogOpen() {
      this.dataForm = {
        dataSourceName: "",
        dbHost: "",
        dbPort: "",
      };
      this.$refs.dataForm && this.$refs.dataForm.resetFields();

      this.getDetail();
    },
    getDetail() {
      let that = this;
      console.log(this.detailData);
      axios
        .get(this.executorUrl + "/dbconfig/v1/item?dbPrimaryId=" + that.id)
        .then(function (res) {
          that.dataForm = res.data.data;
          console.log(that.dataForm);

          // window.open("http://"+res.data.file,"_blank")
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px;
}
.new-role {
  float: right;
}
</style>
