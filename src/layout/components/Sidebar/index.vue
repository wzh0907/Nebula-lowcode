<template>
  <div class="has-logo">
    <!-- <logo :collapse="true" /> -->
    <logo :collapse="true" />
    <el-menu
      @select="handleSelect"
      :default-active="activeMenu"
      :collapse="false"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="false"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
      <div
        class="project-new"
        @click="dialogVisible = true"
        v-has="'project:add'"
        v-if="workMode === 'MERCHANT'"
      >
        <i class="iconfont iconxinjian" style="font-size: 30px"></i>
        <div class="menu-text">新建</div>
      </div>

      <div
        class="project-new"
        @click="dialogVisible = true"
        v-if="workMode === 'PERSONAL'"
      >
        <i class="iconfont iconxinjian" style="font-size: 30px"></i>
        <div class="menu-text">新建</div>
      </div>

      <el-menu-item index="/project/all/index">
        <div class="main-menu-item">
          <i class="iconfont iconwenjianjia" style="font-size: 20px"></i>
          <div class="menu-text">项目</div>
        </div>
      </el-menu-item>
      <el-menu-item
        index="/user/list"
        v-has="'user:list'"
        v-if="workMode === 'MERCHANT'"
      >
        <div class="main-menu-item">
          <i class="iconfont iconyonghuguanli" style="font-size: 20px"></i>
          <div class="menu-text">管理</div>
        </div>
      </el-menu-item>
      <!-- <el-menu-item index="/application/market">
        <i class="iconfont iconsucaiku" style="font-size:20px;color:#6869E0"></i>
        <div class="menu-text" style="margin-left:-10px">素材市场</div>
      </el-menu-item> -->
    </el-menu>
    <!-- <header-user /> -->
    <div class="sidebar-bottom">
      <!-- 2021 暂时隐藏个人空间 -->
      <!-- <div class="personal-space workspace-item" :class="{'workspace-item-active':workMode=='PERSONAL'}" @click="chooseWorkspace">
          <img src="@/assets/images/pic-head.png" width="30px">
        </div> -->

      <el-popover placement="right" width="300" trigger="click">
        <div style="text-align: center">
          <ul class="merchant-ul">
            <li
              v-for="(item, index) in merchantList"
              :key="index"
              class="merchant-li"
              :class="{ 'merchant-active': chosenMerchantId == item.id }"
              @click="merchantChoose(item.id)"
            >
              <div class="chosen-merchant">{{ item.name.substring(0, 1) }}</div>
              {{ item.name }}
            </li>
          </ul>
          <el-button
            type="primary"
            plain
            v-has="'merchant:add'"
            @click="merchantDialogVisible = true"
            >创建企业/组织</el-button
          >
        </div>

        <div
          slot="reference"
          style="width: 80px; padding: 10px 0px"
          :class="{ 'workspace-item-active': workMode == 'MERCHANT' }"
        >
          <div class="chosen-merchant">
            {{ merchantName.substring(0, 1) }}
          </div>
        </div>
      </el-popover>
    </div>
    <projectAddDialog :dialog-visible.sync="dialogVisible" title="创建新项目" />
    <merchantAddDialog
      :dialog-visible.sync="merchantDialogVisible"
      title="创建企业/组织"
      v-has="'merchant-add'"
      @createMerchant="createMerchant"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import HeaderUser from "../header-user";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { getMerchantList, merchantChoose } from "@/api/merchant";
import projectAddDialog from "@/views/project/module/add.vue";
import merchantAddDialog from "../merchant-add/merchantAdd.vue";
import { setPermissionList } from "@/utils/auth";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  components: {
    SidebarItem,
    Logo,
    HeaderUser,
    projectAddDialog,
    merchantAddDialog,
  },
  data() {
    return {
      chooseProjectName: "",
      merchantList: [],
      merchantName: "",
      chosenMerchantId: 0,
      dialogVisible: false,
      workMode: getStorage("workMode"),
      merchantDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "menus",
      "projectId",
      "projectList",
      "merchantId",
    ]),
    routes() {
      // TODO: need test
      const routes = this.$router.options.routes;
      this.handleRoutes(routes);
      return routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return true;
    },
  },
  created() {
    this.init();
    this.$store.dispatch("project/getProjectList").then(() => {
      this.projectList.forEach((item) => {
        if (this.projectId === item.id) {
          this.chooseProjectName = item.projectName;
        }
      });
    });
  },
  methods: {
    init() {
      this.chosenMerchantId = parseInt(this.merchantId);
      console.log("init", this.merchantName);

      getMerchantList().then((res) => {
        if (res.code == 0) {
          this.merchantList = res.dataList;
          this.merchantList.forEach((item) => {
            if (this.chosenMerchantId === item.id) {
              this.merchantName = item.name;

              console.log("123", this.merchantName);
            }
          });
        }
      });
    },
    createMerchant(id) {
      this.merchantChoose(id);
    },
    /**
     * @description 切换商户
     */
    merchantChoose(command) {
      console.log(command, "command");
      setStorage("workMode", "MERCHANT");
      var params = {
        merchantId: command,
      };
      merchantChoose(params).then((res) => {
        console.log(res, "merchantChange");
        if (res.code == 0) {
          this.$store.dispatch("user/setMerchantId", Number(command));
          setPermissionList(res.data.permissionList);
          location.reload();
        }
      });
    },
    chooseWorkspace() {
      setStorage("workMode", "PERSONAL");
      var params = {
        merchantId: 0,
      };
      merchantChoose(params).then((res) => {
        console.log(res, "merchantChange");
        if (res.code == 0) {
          this.$store.dispatch("user/setMerchantId", 0);
          location.reload();
        }
      });
    },
    handleSelect(key, keyPath) {
      this.$router.push({
        path: key,
        params: { data: "query" },
      });
    },

    handleRoutes(routes) {
      // TODO: need test
      routes.forEach((route) => {
        if (route.hidden) return false;
        route.hidden = true;
        this.menus.forEach((menu) => {
          if (menu.permissionSetting === route.permissionSetting) {
            route.hidden = false;
          }
        });
        if (route.children) this.handleRoutes(route.children);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollbar-wrapper {
  // background-color: #E8EBED;
}
.create-project-btn {
  padding: 20px;
  text-align: center;
}
.project-new {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #f6635f;
  margin: 20px auto;
  cursor: pointer;
}
// .custom-menu-item {
//   height: 30px;
//   line-height: 15px;
//   padding-top: 15px;
//   margin-bottom: 15px;
//   text-align: center;
//   font-size: 14px;
//   cursor: pointer;
//   user-select: none;
//   .custom-menu-item-dropdown {
//     width: 100%;
//   }
//   .custom-menu-item-text {
//     .el-icon-caret-bottom {
//     }
//   }
// }
.sidebar-bottom {
  position: absolute;
  bottom: 10px;
  width: 80px;
}
.chosen-merchant {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  background-color: #1b5fb5;
  color: #fff;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  margin: 0px 24px;
}
.merchant-ul {
  width: 300px;
  height: 300px;
  overflow-y: auto;

  li {
    display: flex;
    padding: 10px 0px;
    justify-content: flex-start;
    line-height: 30px;
    font-size: 16px;
    width: 270px;
    cursor: pointer;
  }

  // .custom-menu-item {
  //   height: 30px;
  //   line-height: 15px;
  //   padding-top: 15px;
  //   margin-bottom: 15px;
  //   text-align: center;
  //   font-size: 14px;
  //   cursor: pointer;
  //   user-select: none;
  //   .custom-menu-item-dropdown {
  //     width: 100%;
  //   }
  //   .custom-menu-item-text {
  //     .el-icon-caret-bottom {
  //     }
  //   }
  // }
}
.merchant-ul::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.el-menu-item {
  height: 60px;
}
.personal-space {
  height: 50px;
  line-height: 50px;
  color: black;
  font-size: 24px;
  text-align: center;
  cursor: pointer;
}
.merchant-li:hover {
  background-color: rgba(9, 98, 234, 0.1);
}
.merchant-active {
  background-color: rgba(9, 98, 234, 0.1);
}
.menu-text {
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  margin-top: -14px;
  margin-left: -1px;
}
.el-menu-item.is-active {
  background-color: rgba(9, 98, 234, 0.1) !important;
}
.workspace-item:hover {
  background-color: rgba(9, 98, 234, 0.1);
}
.workspace-item-active {
  background-color: rgba(9, 98, 234, 0.1);
}
.main-menu-item {
  padding-left: 10px;
  line-height: 45px;
}
</style>
