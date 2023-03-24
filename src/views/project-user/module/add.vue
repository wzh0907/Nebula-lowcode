<template>
  <el-dialog
    :title="title"
    width="450px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form
      ref="userInfo"
      :rules="rules"
      label-width="120px"
      :model="userInfo"
    >
      <el-form-item label="姓名：" prop="name">
        <el-input maxlength="100" v-model="userInfo.name" />
      </el-form-item>
      <el-form-item label="用户名：" prop="userName">
        <el-input maxlength="100" v-model="userInfo.userName" />
      </el-form-item>
      <el-form-item label="手机号：" prop="phoneNumber">
        <el-input maxlength="100" v-model="userInfo.phoneNumber" />
      </el-form-item>
      <div>用户角色</div>
      <el-table
        ref="multipleTable"
        :data="roleList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column prop="name" label="角色说明">
          <template slot-scope="scope">{{ scope.row.roleExplain }}</template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getProjectRoleListService } from "@/api/role";
import {
  addUserService,
  updateUserService,
  userDetailService,
} from "@/api/agent/user";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "addUser",
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
  },
  data() {
    return {
      listLoading: false,
      projectId: 0,
      merchantId: 0,
      userInfo: {
        name: "",
        userName: "",
        phoneNumber: "",
      },
      roleList: [],
      checkedProject: [],
      isIndeterminate: false,
      checkAll: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
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
  created() {
    this.projectId = getStorage("projectId");
    this.merchantId = getStorage("merchantId");
  },
  mounted() {},
  methods: {
    init() {
      let params = {
        projectId: this.projectId,
      };
      getProjectRoleListService(params).then((res) => {
        this.roleList = res.dataList;
        this.roleList.forEach((role) => {
          //
          this.$refs.multipleTable.toggleRowSelection(role, false);
        });
        if (this.id) {
          const param = {
            id: this.id,
          };
          userDetailService(param).then((res) => {
            this.userInfo = res.data;

            const roleNameList = res.data.roleNameList;
            if (roleNameList) {
              console.log(roleNameList);
              console.log(this.roleList);
              this.roleList.forEach((role) => {
                roleNameList.forEach((roleName) => {
                  if (roleName === role.roleName) {
                    this.$refs.multipleTable.toggleRowSelection(role);
                  }
                });
              });
            }
          });
        }
      });
    },

    save() {
      if (this.id) {
        this.edit();
      } else {
        this.add();
      }
    },
    add() {
      this.$refs.userInfo.validate(async (valid) => {
        if (valid) {
          const selectArray = this.$refs.multipleTable.selection;
          const roleNameList = [];
          selectArray.forEach((element) => {
            roleNameList.push(element.roleName);
          });

          const params = {
            name: this.userInfo.name,
            userName: this.userInfo.userName,
            phoneNumber: this.userInfo.phoneNumber,
            merchantId: this.merchantId,
            projectId: this.projectId,
            roleNameList: roleNameList,
          };
          this.listLoading = true;
          addUserService(params).then((res) => {
            this.listLoading = false;
            this.isShowDialog = false;
            this.$refs.userInfo.resetFields();
            this.$emit("reload");
          });
        }
      });
    },
    edit() {
      this.$refs.userInfo.validate(async (valid) => {
        if (valid) {
          const selectArray = this.$refs.multipleTable.selection;
          const roleNameList = [];
          selectArray.forEach((element) => {
            roleNameList.push(element.roleName);
          });

          const params = {
            id: this.id,
            name: this.userInfo.name,
            userName: this.userInfo.userName,
            phoneNumber: this.userInfo.phoneNumber,
            merchantId: this.merchantId,
            projectId: this.projectId,
            roleNameList: roleNameList,
          };
          this.listLoading = true;
          updateUserService(params).then((res) => {
            this.listLoading = false;
            this.isShowDialog = false;
            this.$refs.userInfo.resetFields();
            this.$emit("reload");
          });
        }
      });
    },
    dialogOpen() {
      this.userInfo = {
        name: "",
        userName: "",
        phoneNumber: "",
      };
      this.checkAll = false;
      this.isIndeterminate = false;
      this.$refs.userInfo && this.$refs.userInfo.resetFields();
      this.init();
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
