<template>
  <el-dialog
    :title="title"
    width="650px"
    v-loading="listLoading"
    :visible.sync="isShowDialog"
    @open="dialogOpen"
  >
    <el-form ref="userInfo" :rules="rules" label-width="150px" :model="userInfo">
      <el-form-item label="姓名：" prop="name">
        <el-input maxlength="100" v-model="userInfo.name" />
      </el-form-item>
     <el-form-item label="用户名：" prop="userName" >
        <el-input maxlength="100" v-model="userInfo.userName" />
      </el-form-item>
      <el-form-item label="手机号：" prop="phoneNumber" >
        <el-input maxlength="100" v-model="userInfo.phoneNumber" />
      </el-form-item>
   <!--   <el-form-item label="外部ID：" prop="thirdUserId">
        <el-input maxlength="100" v-model="userInfo.thirdUserId" />
      </el-form-item>-->
      <el-form-item label="初始密码：" prop="password" >
       <!-- <el-input maxlength="100" v-model="userInfo.password" />-->
        <input type="text" autocomplete="off" style="position: absolute; bottom: 999999px;"><!-- 阻止chrome自动填充 -->
        <el-input size="medium" type="password" autocomplete="new-password" v-model="userInfo.password" :placeholder="id?'******':'请输入初始密码'"></el-input>
      </el-form-item>

      <el-form-item  label="企业管理权限">
        <el-switch v-model="userInfo.companyManager"> </el-switch> 拥有本企业的最大权限，如开发者创建、项目发布等权限
      </el-form-item>

      <el-form-item  label="项目角色权限">
        <el-radio  v-model="userInfo.projectRole" label="project_manager">
          管理者
        </el-radio>
        <el-radio  v-model="userInfo.projectRole" label="project_developer">
          开发者
        </el-radio>
      </el-form-item>
      <el-form-item label="项目：">
       <el-form-item>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="fla">全选</el-checkbox>
       </el-form-item>
        <el-checkbox-group
          v-model="checkedProject"
          @change="selectProject"
        >
          <el-checkbox
            v-for="item in projectAllList"
            :label="item.id"
            :key="item.id"
          >
            {{item.projectName}}
          </el-checkbox>
        </el-checkbox-group>

      </el-form-item>
<!--      <div>
        用户角色
      </div>
      <el-table ref="multipleTable" :data="roleList" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column prop="name" label="角色说明">
          <template slot-scope="scope">{{ scope.row.roleExplain }}</template>
        </el-table-column>
      </el-table>-->

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getAllProjectList } from "@/api/role";
import {
  addUserService,
  updateUserService,
  userDetailService
} from "@/api/user";
export default {
  name: "addUser",
  props: {
    id: {
      type: String | Number,
      default: ""
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      listLoading: false,
      userInfo: {
        name: "",
        userName: "",
        phoneNumber: "",
        password:"",
        projectRole:"",
        companyManager:false
      },
      roleList: [],
      projectAllList:[], // 项目管理列表
      checkedProject:[],
      isIndeterminate: false,
      checkAll: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" }
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
  created() {},
  mounted() {},
  methods: {
   init() {
  /*    getRoleListService().then(res => {
        this.roleList = res.dataList;
        this.roleList.forEach(role => {
          this.$refs.multipleTable.toggleRowSelection(role, false);
        });
      });*/
    },
    getProjectAllList() {
      getAllProjectList().then(res => {
        this.projectAllList = res.dataList;
      });
    },
    selectProject(value){
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.projectAllList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.projectAllList.length;
    },
   handleCheckAllChange(val) {
        let checked = this.projectAllList.map(item => {
          return item.id;
        });
        this.checkedProject = val ? checked : [];
        this.isIndeterminate = false;
   },
    save() {
      if (this.id) {
        this.edit();
      } else {
        this.add();
      }
    },
    add() {
      this.$refs.userInfo.validate(async valid => {
        if (valid) {
          //const selectArray = this.$refs.multipleTable.selection;
          //const roleNameList = [];
  /*        selectArray.forEach(element => {
            roleNameList.push(element.roleName);
          });*/

          const params = {
            name: this.userInfo.name,
            userName: this.userInfo.userName,
            phoneNumber: this.userInfo.phoneNumber,
            //thirdUserId: this.userInfo.thirdUserId,
            //roleNameList: roleNameList,
            companyManager:this.userInfo.companyManager,
            password:this.userInfo.password,
            projectIdList:this.checkedProject,
            projectRole:this.userInfo.projectRole
          };
          this.listLoading = true;
          addUserService(params).then(res => {
            this.listLoading = false;
            this.isShowDialog = false;
            this.$refs.userInfo.resetFields();
            this.$emit("reload");
          });
        }
      });
    },
    edit() {
      this.$refs.userInfo.validate(async valid => {
        if (valid) {
    /*      const selectArray = this.$refs.multipleTable.selection;
          const roleNameList = [];
          selectArray.forEach(element => {
            roleNameList.push(element.roleName);
          });*/

          const params = {
            id: this.id,
            name: this.userInfo.name,
            userName: this.userInfo.userName,
            phoneNumber: this.userInfo.phoneNumber,
            companyManager:this.userInfo.companyManager,
            password:this.userInfo.password,
            projectIdList:this.checkedProject,
            projectRole:this.userInfo.projectRole
          };
          this.listLoading = true;
          updateUserService(params).then(res => {
            this.listLoading = false;
            this.isShowDialog = false;
            this.$refs.userInfo.resetFields();
            this.$emit("reload");
          });
        }
      });
    },
    dialogOpen() {
      this.init();
      this.getProjectAllList()
      this.userInfo = {
        name: "",
        userName: "",
        phoneNumber: "",
        thirdUserId: ""
      };
      this.checkedProject = []
      this.checkAll = false
      this.isIndeterminate = false;
      this.$refs.userInfo && this.$refs.userInfo.resetFields();

      if (this.id) {
        const param = {
          id: this.id
        };
        userDetailService(param).then(res => {
          this.userInfo = res.data;

          let checkedCount = res.data.projectIdList?.length;
          this.checkAll = checkedCount === this.projectAllList?.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.projectAllList?.length;
          this.checkedProject =  res.data.projectIdList || []

          const roleNameList = res.data.roleNameList;
          if (roleNameList) {
            console.log(roleNameList)
            console.log(this.roleList)
            this.roleList.forEach(role => {
              roleNameList.forEach(roleName => {
                if (roleName === role.roleName) {
                  this.$refs.multipleTable.toggleRowSelection(role);
                }
              });
            });
          }
        });
        // TODO
        // this.userInfo.name = this.detailData.paramName || "";
        // this.userInfo.userName = this.detailData.paramValue || "";
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 20px;
}
.new-role{
  float: right;
}
</style>
