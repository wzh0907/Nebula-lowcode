<template>
  <el-drawer
    :with-header="false"
    :visible.sync="isShowDrawer"
    :direction="direction"
    :before-close="handleClose"
    @open="drawerOpen"
  >
    <div class="file-tree">
      <span class="preview-item" @click="toPcDoor">PC</span>
      <span class="preview-item" @click="toMobileDoor">移动端</span>

      <previewDialog
        :dialog-visible.sync="previewVisible"
        :preview-url="previewUrl"
        :title="'扫描二维码打开项目'"
      />
    </div>
  </el-drawer>
</template>

<script>
import previewDialog from "@/views/report/modules/preview/index.vue";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "previewDrawer",
  components: {
    previewDialog,
  },
  props: {
    projectId: {
      type: Number,
      default: 0,
    },
    merchantId: {
      type: Number,
      default: 0,
    },
    drawerVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      previewVisible: false,
      previewUrl: "",
      direction: "ttb",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    // ...mapGetters(["projectList"]),
    isShowDrawer: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit("update:drawerVisible", val);
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    drawerOpen() {
      console.log("drawerOpen");
      // this.initData();
    },
    handleClose(done) {
      this.isShowDrawer = false;
      // this.$emit("cancel");
    },
    toMobileDoor() {
      this.previewVisible = true;
      this.handleClose();
    },
    toPcDoor() {
      const phoneNumber = getStorage("phoneNumber");
      const username = getStorage("username");
      const token = getStorage("token");

      window.open(
        // "https://pc.dipaas.com/#/authPage?projectId=" +
        "http://localhost:8889/#/authPage?projectId=" +
          this.projectId +
          "&merchantId=" +
          this.merchantId +
          "&phoneNumber=" +
          phoneNumber +
          "&username=" +
          username +
          "&token=" +
          token +
          "&projectName=" +
          this.projectName +
          "&type=viewLook",
        "_blank"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.file-tree {
  display: flex;
  flex-direction: column;
  /deep/.el-dialog__wrapper .el-dialog {
    margin-top: 6vh !important;
  }
}
.tree-wrap {
  // flex: 1;
  overflow-y: scroll;
  // 滚动条
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 0;
    background: #fff;
  }
}
.preview-item {
  padding: 25px 0;
  text-align: center;
  width: 100%;
  cursor: pointer;
}
.file-tree-nodes {
  padding-left: 4px;
}
.tree-item-text-wrap {
  width: 100%;
  .tree-text-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    display: inline-block;
    width: 90%;
  }
  .rename-input {
    border: 0;
    border-bottom: 1px solid;
    width: 95%;
  }
  .el-icon-more {
    visibility: hidden;
    position: absolute;
    right: 2px;
    margin-top: 7px;
  }
  &:hover {
    .el-icon-more {
      visibility: inherit;
    }
  }
  .el-icon-more:hover {
    color: red;
  }
}
.file-popover-menu {
  margin: 0;
  padding: 0;
  font-size: 13px;
  li {
    padding: 5px;
    padding-left: 10px;
    // height: 20px;
    // line-height: 20px;
    cursor: pointer;
  }
  li:hover {
    color: red;
    background-color: #f5f5f5;
  }
}
</style>
