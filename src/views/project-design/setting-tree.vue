<template>
  <!-- <el-tree
    v-if="isShowTree"
    ref="tree"
    class="file-tree-nodes"
    node-key="treeId"
    highlight-current
    :default-expand-all="defaultExpandAll"
    :draggable="true"
    :data="settingList"
    @node-click="handleNodeClick"
  >
  </el-tree> -->
  <div>
     <el-menu
      class="el-menu-vertical-demo"
      >
      <el-menu-item :index="(sKey+1).toString()" v-for="(setting,sKey) in settingList" :key="sKey" @click="menuClick(setting)">
        <i class="el-icon-menu"></i>
        <span slot="title">{{setting.label}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "settingTree",
  components: {},
  props: ["projectType", "currentMenuId", "drawerVisible"],
  data() {
    return {
      settingList: [
        {
          label: "基础信息",
          dataType: "projectSetting",
        },
        // {
        //   label: "组织结构",
        //   dataType: "organization",
        // },
        // {
        //   label: "AOP配置",
        //   dataType: "TODO",
        // },
        // {
        //   label: "系统参数",
        //   dataType: "TODO",
        // },
        {
          label: "定时任务",
          dataType: "job",
        },
        // {
        //   label: "工作流配置",
        //   dataType: "TODO",
        // },
        // {
        //   label: "第三方设置",
        //   dataType: "TODO",
        // },
        // {
        //   label: "版本管理",
        //   dataType: "TODO",
        // },
      ],
      currentDirLevel: 1,
      loaderObj: {},
      tabName: "first",
      direction: "ttb",
      isInputFocus: false,
      isShowTree: true,
      defaultExpandAll: false,
      type: "report",
    };
  },

  computed: {},
  created() {
    // this.initData();
  },
  mounted() {},
  methods: {
    menuClick(data){
       console.log("--------menuClick---",data);
       const dataType = data.dataType;

      if ("TODO" == dataType) {
      } else {
        this.$emit("changeDataType", dataType, data);
      }
    },
    handleNodeClick(data, parentData) {
      console.log("--------handleNodeClick---", data);
      const dataType = data.dataType;

      if ("TODO" == dataType) {
      } else {
        this.$emit("changeDataType", dataType, data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-tree {
  max-height: 600px;
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
.file-tree-search {
  height: 40px;
  line-height: 40px;
  padding: 0px 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  //justify-content: space-between;
  text-align: center;
  .icon-font {
    font-size: 18px;
    cursor: pointer;
  }
  .iconfangda {
    text-align: right;
  }
  .search-input {
    width: 85%;
    margin-left: 6px;
  }
}
.file-tree-nodes {
  padding-left: 4px;
  margin-top: 20px;
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
    vertical-align: middle;
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
    color: #409eff;
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
    color: #409eff;
    background-color: #f5f5f5;
  }
}
.file-tree-front {
  padding: 10px 26px 10px 10px;
  line-height: 26px;
  cursor: pointer;
  background: #f5f5f5;
  text-align: center;
}
.el-drawer__body {
overflow: auto;
}
.el-drawer__container ::-webkit-scrollbar {
display: none;
}
</style>
