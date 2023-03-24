<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <div class="main-container">
      <sidebar class="sidebar-container" @onAddDialog="dialogVisible = true" />
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <!-- <breadcrumb class="breadcrumb-container" /> -->
      <div class="breadcrumb-container" />
      <app-main />
    </div>
    <!-- add pop -->
    <project-add-dialog
      :dialog-visible.sync="dialogVisible"
      title="创建新项目"
    />
    <guidance v-show="showGuide" @start="start" />
  </div>
</template>

<script>
// import Breadcrumb from '@/components/Breadcrumb'
import { Navbar, Sidebar, AppMain } from "./components";
import guidance from "./components/guidance";
import ResizeMixin from "./mixin/ResizeHandler";
import { EventBus } from "@/util/event-bus.js";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    // Breadcrumb,
    AppMain,
    guidance,
    "project-add-dialog": () => import("@/views/project/module/add.vue"),
  },
  data() {
    return {
      dialogVisible: false,
      showGuide: false,
    };
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  created() {
    let guide = getStorage("guide");
    if (guide) {
      this.showGuide = false;
    } else {
      this.showGuide = true;
    }
  },
  mounted() {
    EventBus.$on("onShowGuide", (data) => {
      this.showGuide = true;
    });
  },
  beforeDestroy() {
    EventBus.$off("onShowGuide");
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    handleCommand(command) {
      //  this.$refs.appMain.handleCommand(command);
    },
    start() {
      this.showGuide = false;
      // setStorage("guide", 'show');
      setStorage("guide", "show");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .breadcrumb-container {
    margin-left: 225px;
    padding-top: 50px;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
