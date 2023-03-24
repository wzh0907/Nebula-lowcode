<template>
  <div class="navbar">
    <!-- <logo :collapse="true" /> -->
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- <el-select v-model="chosenMerchantId" @change="merchantChange" class="merchant-select">
      <el-option  v-for="item in merchantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select> -->
    <!-- <merchant-list /> -->
    <header-menu />
      <!-- <p class="tab-item">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ filterParams.projectType || '全部设备' }}
              <i class="iconfont iconxia" style="font-size: 14px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="">全部设备</el-dropdown-item>
              <el-dropdown-item command="PC">PC</el-dropdown-item>
              <el-dropdown-item command="MOBILE">MOBILE</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p> -->
    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Sidebar/Logo";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import HeaderMenu from "./header-menu";
import MerchantList from "./merchant-list";
import { getMerchantList,merchantChoose } from "@/api/merchant";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    HeaderMenu,
    Logo,
    MerchantList,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  data() {
    return {
      filterParams: {
        projectType: ''
      },
    };
  },
  created() {

  },
  methods: {    
    handleCommand(command) {
      this.filterParams.projectType = command;
      this.$emit("handleCommandChange",command);
    
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  width: calc( 100% - 80px );
  right: 0px;
  height: 50px;
  overflow: hidden;
  position: fixed;
  z-index: 100;
 background:#F0F2F3;
box-shadow: 0 0 6px 0 rgba(0,0,0,.12), 0 10px 12px 0 rgba(170,182,206,.2), inset 0 -1px 0 0 rgba(255,255,255,.3);
  
  // box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12),
  //   0 10px 12px 0 rgba(170, 182, 206, 0.2),
  //   inset 0 -1px 0 0 rgba(255, 255, 255, 0.3);

  // .hamburger-container {
  //   line-height: 46px;
  //   height: 100%;
  //   float: left;
  //   cursor: pointer;
  //   transition: background 0.3s;
  //   -webkit-tap-highlight-color: transparent;

  //   &:hover {
  //     background: rgba(0, 0, 0, 0.025);
  //   }
  // }

  // .breadcrumb-container {
  //   float: left;
  // }

  // .right-menu {
  //   float: right;
  //   height: 100%;
  //   line-height: 50px;

  //   &:focus {
  //     outline: none;
  //   }

  //   .right-menu-item {
  //     display: inline-block;
  //     padding: 0 8px;
  //     height: 100%;
  //     font-size: 18px;
  //     color: #5a5e66;
  //     vertical-align: text-bottom;

  //     &.hover-effect {
  //       cursor: pointer;
  //       transition: background 0.3s;

  //       &:hover {
  //         background: rgba(0, 0, 0, 0.025);
  //       }
  //     }
  //   }

  //   .avatar-container {
  //     margin-right: 30px;

  //     .avatar-wrapper {
  //       margin-top: 5px;
  //       position: relative;

  //       .user-avatar {
  //         cursor: pointer;
  //         width: 40px;
  //         height: 40px;
  //         border-radius: 10px;
  //       }

  //       .el-icon-caret-bottom {
  //         cursor: pointer;
  //         position: absolute;
  //         right: -20px;
  //         top: 25px;
  //         font-size: 12px;
  //       }
  //     }
  //   }
  // }
  // /deep/.el-input__inner{
  //   background-color: transparent;
  //   width:80px;
  //   border:0px;
  // }
}
</style>
