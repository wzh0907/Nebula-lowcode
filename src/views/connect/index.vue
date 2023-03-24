<template>
  <div>
    <custom-header></custom-header>
    <br />
    <div class="app-container">
      <el-form ref="dbForm" :rules="rules" :model="dataForm">
        <el-form-item
          label="系统名称："
          :label-width="formLabelWidth"
          prop="dataSourceName"
        >
          <el-input v-model="dataForm.dataSourceName" />
        </el-form-item>
        <el-form-item
          label="主机地址："
          :label-width="formLabelWidth"
          prop="dbHost"
        >
          <el-input v-model="dataForm.dbHost" />
        </el-form-item>
        <el-form-item
          label="秘钥："
          :label-width="formLabelWidth"
          prop="secret"
        >
          <el-input v-model="dataForm.secret" />
        </el-form-item>

        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="dataForm.userName" />
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth">
          <el-input v-model="dataForm.password" type="password" />
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input
            v-model="dataForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getdeitalService } from "@/api/database";
import { updateDatabaseV4 } from "@/api/v4";
import customHeader from "@/components/customHeader/index";
export default {
  name: "connect",
  components: {
    customHeader,
  },
  props: ["databaseId"],
  data() {
    return {
      formLabelWidth: "120px",
      dataForm: {},
      rules: {
        dataSourceName: [
          { required: true, message: "请输入系统名称", trigger: "blur" },
        ],
        dbName: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
        ],
        dbHost: [
          { required: true, message: "请输入主机地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getDetail();
  },
  methods: {
    save() {
      this.$refs.dbForm.validate(async (valid) => {
        if (valid) {
          const params = this.dataForm;
          params.id = this.databaseId;
          params.type = "connect";
          updateDatabaseV4(params).then((res) => {
            if (res.code == 0) {
              this.$message.success("修改成功");
            }
          });
        }
      });
    },
    getDetail() {
      if (!this.databaseId) return;
      this.listLoading = true;
      getdeitalService({
        configId: this.databaseId,
      }).then((res) => {
        this.listLoading = false;
        this.dataForm = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}
.dialog-footer {
  text-align: center;
}
</style>
