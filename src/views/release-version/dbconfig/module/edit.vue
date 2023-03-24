<template>
  <el-dialog
    :title="title"
    width="450px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form
      ref="sourceInfo"
      :rules="rules"
      label-width="120px"
      :model="sourceInfo"
    >
      <el-form-item label="数据源名称：" prop="dataSourceName">
        <el-input v-model="sourceInfo.dataSourceName" />
      </el-form-item>
      <el-form-item label="数据库类型：" prop="dbType">
        <el-select
          v-model="sourceInfo.dbType"
          disabled
          placeholder="请选择数据库类型"
        >
          <el-option label="MYSQL" value="MYSQL" />
          <el-option label="ORACLE" value="ORACLE" />
          <el-option label="SQLSERVER" value="SQLSERVER" />
        </el-select>
      </el-form-item>
      <el-form-item label="主机地址：" prop="dbHost">
        <el-input v-model="sourceInfo.dbHost" />
      </el-form-item>
      <el-form-item label="端口：" prop="dbPort">
        <el-input v-model="sourceInfo.dbPort" />
      </el-form-item>
      <el-form-item label="数据库名称：" prop="dbName">
        <el-input v-model="sourceInfo.dbName" disabled />
      </el-form-item>
      <el-form-item label="用户名：" prop="userName">
        <el-input v-model="sourceInfo.userName" />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input type="password" v-model="sourceInfo.password" />
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
import {getStorage,setStorage} from "@/util/storageUtil.js";
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
      sourceInfo: {
        roleName: "",
        roleExplain: "",
        authIdList: [],
      },
      roleList: [],
      rules: {
        dataSourceName: [
          { required: true, message: "请输入数据源名称", trigger: "blur" },
        ],
        dbType: [
          { required: false, message: "请选择数据库类型", trigger: "blur" },
        ],
        dbHost: [
          { required: false, message: "请输入主机地址", trigger: "blur" },
        ],
        dbPort: [{ required: false, message: "请输入端口", trigger: "blur" }],
        dbName: [
          { required: false, message: "请输入数据库名称", trigger: "blur" },
        ],
        userName: [
          { required: false, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: false, message: "请输入密码", trigger: "blur" }],
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
    add() {
      this.$refs.sourceInfo.validate(async (valid) => {
        if (valid) {
          const params = {
            roleName: this.sourceInfo.roleName,
            roleExplain: this.sourceInfo.roleExplain,
            projectId: this.projectId,
            merchantId: getStorage("merchantId"),
            authIdList: this.sourceInfo.authIdList,
          };
          this.listLoading = true;
          addProjectRoleService(params).then((res) => {
            this.listLoading = false;
            this.isShowDialog = false;
            this.$refs.sourceInfo.resetFields();
            this.$emit("reload");
          });
        }
      });
    },
    edit() {
      let that = this;
      this.$refs.sourceInfo.validate(async (valid) => {
        if (valid) {
          //   const params = {
          //     id: this.id,
          //     dataSourceName: this.sourceInfo.roleName,
          //     roleExplain: this.sourceInfo.roleExplain,
          //   };
          this.listLoading = true;
          axios
            .put(this.executorUrl + "/dbconfig/v1/item", this.sourceInfo)
            .then(function (res) {
              that.$message.success("编辑成功");

              // window.open("http://"+res.data.file,"_blank")
              that.listLoading = false;
              that.isShowDialog = false;
              that.$refs.sourceInfo.resetFields();
              that.$emit("reload");
            });
        }
      });
    },
    dialogOpen() {
      this.sourceInfo = {
        dataSourceName: "",
        dbHost: "",
        dbPort: "",
      };
      this.$refs.sourceInfo && this.$refs.sourceInfo.resetFields();

      this.getDetail();
      // this.sourceInfo.id=this.id;
      // this.sourceInfo.dataSourceName = this.detailData.dataSourceName || "";
      // this.sourceInfo.dbHost = this.detailData.dbHost || "";
      // this.sourceInfo.dbPort = this.detailData.dbPort || "";
      // this.sourceInfo.dbType = this.detailData.dbType || "";
      // this.sourceInfo.userName = this.detailData.userName || "";
      // this.sourceInfo.password = this.detailData.password || "";
      // this.sourceInfo.dbName = this.detailData.dbName || "";
    },
    getDetail() {
      let that = this;
      console.log(this.detailData);
      axios
        .get(
          this.executorUrl +
            "/dbconfig/v1/item?dbPrimaryId=" +
            that.detailData.dbPrimaryId
        )
        .then(function (res) {
          console.log(res);
          that.sourceInfo = res.data.data;
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
