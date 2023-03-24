<template>
  <el-dialog
    :title="title"
    width="450px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form
      ref="roleInfo"
      :rules="rules"
      label-width="120px"
      :model="roleInfo"
    >
      <el-form-item label="角色名称：" prop="roleName">
        <el-input
          maxlength="20"
          v-model="roleInfo.roleName"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="关联权限：">
        <!-- <el-select v-model="roleInfo.authIdList" placeholder="请选择" multiple>
          <el-option
            v-for="item in authorityAllList"
            :key="item.authId"
            :label="item.authorityName"
            :value="item.authId"
          >
          </el-option>
        </el-select> -->
        <el-tree
          ref="tree"
          :data="authorityAllListTree"
          show-checkbox
          default-expand-all
          :default-checked-keys="roleInfo.authIdList"
          node-key="authId"
        ></el-tree>
      </el-form-item>
      <el-form-item label="角色说明：" prop="roleExplain">
        <el-input
          type="textarea"
          :rows="5"
          maxlength="200"
          v-model="roleInfo.roleExplain"
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
import { addProjectRoleService, updateRoleService } from "@/api/role";
import { getAuthorityAllListTree } from "@/api/authority/index";
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
  },
  data() {
    return {
      listLoading: false,
      authorityAllListTree: [],
      roleInfo: {
        roleName: "",
        roleExplain: "",
        authIdList: [],
      },
      roleList: [],
      checkKeys: [],
      isEdit: true,
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleExplain: [
          { required: false, message: "请输入角色说明", trigger: "blur" },
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
    ...mapGetters(["projectId"]),
  },
  created() {},
  mounted() {},
  methods: {
    save() {
      this.roleInfo.authIdList = this.$refs.tree.getCheckedKeys();
      if (this.id) {
        this.edit();
      } else {
        this.add();
      }
    },
    add() {
      this.$refs.roleInfo.validate(async (valid) => {
        if (valid) {
          const params = {
            roleName: this.roleInfo.roleName,
            roleExplain: this.roleInfo.roleExplain,
            projectId: this.projectId,
            merchantId: getStorage("merchantId"),
            authIdList: this.roleInfo.authIdList,
          };
          this.listLoading = true;
          addProjectRoleService(params).then((res) => {
            this.listLoading = false;
            this.isShowDialog = false;
            this.$refs.roleInfo.resetFields();
            this.$emit("reload");
          });
        }
      });
    },
    edit() {
      this.$refs.roleInfo.validate(async (valid) => {
        if (valid) {
          let authIdList = [];
          for (let i = 0; i < this.roleInfo.authIdList.length; i++) {
            if (this.roleInfo.authIdList[i]) {
              authIdList.push(this.roleInfo.authIdList[i]);
            }
          }
          const params = {
            roleId: this.id,
            roleName: this.roleInfo.roleName,
            roleExplain: this.roleInfo.roleExplain,
            authIdList: authIdList,
            projectId: getStorage("projectId"),
            merchantId: getStorage("merchantId"),
          };
          this.listLoading = true;
          updateRoleService(params).then((res) => {
            this.listLoading = false;
            this.isShowDialog = false;
            this.$refs.roleInfo.resetFields();
            this.$emit("reload");
          });
        }
      });
    },
    queryAuthorityAllList() {
      getAuthorityAllListTree().then((res) => {
        this.authorityAllListTree = res.dataList || [];
      });
    },
    dialogOpen() {
      this.queryAuthorityAllList();
      this.roleInfo = {
        roleName: "",
        roleExplain: "",
        authIdList: [],
      };
      this.$refs.roleInfo && this.$refs.roleInfo.resetFields();
      this.isEdit = false;
      if (this.id) {
        // TODO
        this.isEdit = true;
        this.roleInfo.roleName = this.detailData.roleName || "";
        this.roleInfo.roleExplain = this.detailData.roleExplain || "";
        this.roleInfo.authIdList = this.detailData.authIdList || [];
      }
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
