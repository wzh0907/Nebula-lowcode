<template>
  <el-drawer
    :with-header="false"
    size="60%"
    :visible.sync="isShowDrawer"
    :direction="direction"
    :before-close="handleClose"
    @open="drawerOpen"
  >
    <div class="page-tree">
      <div class="page-tree-search">
        <span style="flex: 1">页面</span>
        <span class="el-dropdown-link" @click="addMenu()">
          <i class="icon-font el-icon-plus" title="添加页面"></i>
        </span>
      </div>
      <div class="tree-wrap">
        <el-tree
          v-if="isShowTree"
          class="file-tree-nodes"
          ref="tree"
          node-key="treeId"
          highlight-current
          default-expand-all
          :draggable="!isInputFocus"
          :expand-on-click-node="false"
          :data="subPageList"
          :props="defaultProps"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :filter-node-method="filterNode"
          @node-drop="handleDrop"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ data, node }" class="tree-item-text-wrap">
            <span>{{ data.name }}</span>
            <el-popover
              :visible-arrow="false"
              placement="right"
              width="150"
              trigger="hover"
            >
              <ul class="file-popover-menu">
<!--                <li-->
<!--                  v-if="projectType === 'PC' && data.parentId == '0'"-->
<!--                  @click="addMenu(data.id)"-->
<!--                >-->
<!--                  添加子页面-->
<!--                </li>-->
                <li @click="updatePage(data)">修改</li>
                <li @click="delPage(data)">删除</li>
              </ul>
              <i class="el-icon-more" slot="reference"></i>
            </el-popover>
          </span>
        </el-tree>
      </div>
      <addSubPageDialog
        :dialog-visible.sync="addDialogVisible"
        :parent-id="subPageList[0].id"
        entry-dir-id="0"
        :title="updatePageDialog ? '修改页面' : '添加页面'"
        :pageItem="pageItem"
        :projectType="projectType"
        :is-update="updatePageDialog"
        @addSubpageComplete="addSubpageComplete"
        @updatePageComplete="updatePageComplete"
        @uploadDirTree="initData"
      />
    </div>
  </el-drawer>
</template>

<script>
import {
  saveFileNameService,
  saveDirectoryV4,
  saveReportV4,
  delDirectoryV4,
  delReportV4,
  delDatasetV4,
  delDatabaseV4,
  delProcessV4,
  copyReportV4,
  copyDatasetV4,
  copyProcessV4, renameReportService,
} from "@/api/v4";
import {
  getMenuListV4,
  saveMenuService,
  deleteMenuService,
  sortList,
} from "@/api/report";
import addSubPageDialog from "./dialog-module/add-subpage";

import {deleteSubItemService, saveSubItemService} from "@/api/v5";
import {getReportDetail} from "@/api/chartsData";
export default {
  name: "menuTree",
  components: {
    addSubPageDialog
  },
  props: ["projectType", "currentMenuId", "drawerVisible", "subPageList"],
  data() {
    return {
      currentDirLevel: 1,
      loaderObj: {},
      direction: "ttb",
      isInputFocus: false,
      isShowTree: true,
      filterText: "",
      parentId: 0,
      addDialogVisible: false,
      treeSearchVisible: false,
      updatePageDialog: false,
      // currentTreeChildren: [],
      pageDataList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      pageItem: {},
      fileTypeTextMap: {
        project: "项目",
        directory: "文件夹",
        report: "页面",
        process: "接口",
        dataset: "数据",
        datasetScript: "脚本",
        database: "数据源",
      },
      fileTypeIconMap: {
        directory: "icontabs",
        report: "iconzhanshi",
        process: "iconliuchengshuoming",
        dataset: "iconshujuji",
        database: "icondataBase",
      },
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
  created() {
    this.initData();
  },
  mounted() {
    console.log("mounted menu");
  },
  methods: {
    drawerOpen(){
      console.log("drawerOpen",this.projectType)
      this.initData();
    },
    handleClose(done) {
      this.isShowDrawer=false;
      // this.$emit("cancel");
    },
    updatePage(data) {
      this.pageItem = data;
      this.updatePageDialog = true
      this.addDialogVisible = true
    },
    updatePageComplete(data) {
      this.addDialogVisible = false
      let index = this.subPageList.findIndex(element => element.id == data.reportId)
      this.subPageList[index].name = data.reportName
    },
    renameFileInputFocus(data, elId) {
      if (data.dataType === "project") return false;
      this.isInputFocus = true;
      this.isShowTree = false;
      data.isEditMode = true;
      this.$nextTick(() => {
        this.isShowTree = true;
        setTimeout(() => {
          let el = document.getElementById(elId);
          el && el.focus();
          el && el.select();
        });
      });
    },
    renameFileInputBlur(data) {
      if (data.dataType === "directory") {
        this.renameDir(data.queryId, data.name);
      } else {
        this.renameFile(data.treeId, data.name);
      }
      this.isInputFocus = false;
      this.isShowTree = false;
      data.isEditMode = false;
      this.$nextTick(() => {
        this.isShowTree = true;
      });
    },
    // searchTree(){
    //   this.treeSearchVisible = true
    // },
    addDir(dirId) {
      if (!dirId && this.currentDirLevel >= 5) return false;
      this.triggerLoading();
      // this.currentTreeChildren.push({
      //   dataType: 'directory',
      //   name: '新建文件夹'
      // })
      saveDirectoryV4({
        parentId: dirId || this.currentDirId,
        name: "新建文件夹",
      }).then((res) => {
        this.initData(res.data.treeId);
      });
    },
    triggerLoading() {
      this.loaderObj = this.$loading({
        lock: true,
        text: "处理中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    renameFile(treeId, name) {
      saveFileNameService({
        treeId,
        name,
      }).then(() => {
        this.initData();
      });
    },
    renameDir(id, name) {
      saveDirectoryV4({
        // parentId: dirId || this.currentDirId,
        id,
        name,
      }).then(() => {
        this.initData();
      });
    },
    addFile(dataType, dirId) {
      if (!dataType) return false;
      let fileName = `新建${this.fileTypeTextMap[dataType]}`;
      let saveFileService = saveReportV4;
      let params = {
        parentId: dirId || this.currentDirId,
      };
      if (dataType === "report") {
        saveFileService = saveReportV4;
        params.reportName = fileName;
        params.queryType = this.projectType;
        params.subType = "report";
      }
      this.triggerLoading();
      saveFileService(params).then((res) => {
        // this.initData(res.data.treeId);
      });
      // dataType = (dataType === 'datasetScript' ? 'dataset' : dataType)
      // this.currentTreeChildren.push({
      //   dataType,
      //   name: fileName
      // })
    },
    addMenu(parentId) {
      this.pageItem = {};
      if (parentId) {
        this.parentId = parentId;
      } else {
        this.parentId = 0;
      }
      this.updatePageDialog = false;
      this.addDialogVisible = true;
    },
    saveDatabase(res) {
      this.triggerLoading();
      this.initData(res.data.treeId);
    },
    copyFile(fileData, nodeData) {
      let dataType = fileData.dataType;
      let parentId = nodeData.parent.data.queryId;
      let newFileName = fileData.name + " Copy";
      let copyFileService = copyReportV4;
      if (dataType === "report") {
        copyFileService = copyReportV4;
      } else if (dataType === "process") {
        copyFileService = copyProcessV4;
      } else if (dataType === "dataset" || dataType === "datasetScript") {
        copyFileService = copyDatasetV4;
      } else {
        return false;
      }
      this.triggerLoading();
      copyFileService({
        name: newFileName,
        parentId,
        queryId: fileData.queryId,
      }).then((res) => {
        this.initData(res.data.treeId);
      });
    },
    delPage(fileData) {
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let tabName = "menu" + fileData.id;
          let index = this.subPageList.findIndex((element) => element.id == fileData.id)
          if (index == 0) {
            //删除主页面
            delReportV4({
              reportId: fileData.id,
            }).then(() => {
            })
          } else {
            //删除子页面
            deleteSubItemService({
              subPageId:  fileData.id
            }).then(() => {
              this.subPageList.splice(index, 1)
              // this.$emit("removeSubPage", pageInfo.pageIndex);
            })
          }
          this.$emit("removeTab", tabName)
        })
        .catch(() => {});
    },
    delFileDir(fileData) {
      let dataType = fileData.dataType;
      if (dataType === "directory") {
        delDirectoryV4({
          directoryId: fileData.queryId,
        }).then(() => {
          this.initData();
        });
      } else if (dataType === "report") {
        delReportV4({
          reportId: fileData.queryId,
        }).then(() => {
          this.initData();
        });
      } else if (dataType === "process") {
        delProcessV4({
          processId: fileData.queryId,
        }).then(() => {
          this.initData();
        });
      } else if (dataType === "dataset" || dataType === "datasetScript") {
        delDatasetV4({
          dsConfigId: fileData.queryId,
        }).then(() => {
          this.initData();
        });
      } else if (dataType === "database") {
        delDatabaseV4({
          configId: fileData.queryId,
        }).then(() => {
          this.initData();
        });
      }
    },
    handleDrop() {
      console.log(this.pageDataList, "drop");

      let queryList = [];
      for (let i = 0; i < this.pageDataList.length; i++) {
        let item = this.pageDataList[i];
        // let parentId = 0;
        // if (item.parentId) {
        //   parentId = item.parentId;
        // }

        let query = {
          id: item.id,
          rank: i + 1,
          parentId: 0,
        };
        query = this.getChildren(query, item);
        queryList.push(query);
      }
      sortList(queryList);
    },
    getChildren(query, item) {
      if (item.children) {
        query.children = [];
        for (let j = 0; j < item.children.length; j++) {
          let itemj = item.children[j];
          let queryj = {
            id: itemj.id,
            rank: j + 1,
            parentId: item.id,
          };
          queryj = this.getChildren(queryj, itemj);
          query.children.push(queryj);
        }
      }
      return query;
    },
    allowDrag() {
      return true;
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.dataType === "project") return false;
      if (type === "inner" && dropNode.data.dataType !== "directory") {
        return false;
      } else {
        return true;
      }
    },
    initData() {
      //   getProjectFileTreeListService().then(res => {
      //     this.treeDataList[0].children = res.dataList
      //     // this.currentTreeChildren = this.treeDataList[0].children
      //     treeId && this.$nextTick(() => {
      //       let data = this.findFileTree(treeId, this.treeDataList[0].children)
      //       data && this.renameFileInputFocus(data, 'rename-input' + treeId)
      //     })
      //     if (this.loaderObj.close && typeof this.loaderObj.close === 'function') this.loaderObj.close()
      //   });
      var params = {
        queryType: this.projectType,
      };
      getMenuListV4(params).then((res) => {
        this.pageDataList = res.dataList;
        if (this.loaderObj.close && typeof this.loaderObj.close === "function")
          this.loaderObj.close();
      });
    },
    findFileTree(treeId, treeList) {
      let data = "";
      treeList.forEach((item) => {
        if (item.treeId === treeId) {
          data = item;
          return;
        }
        if (item && item.children && item.children.length) {
          let res = this.findFileTree(treeId, item.children);
          res && (data = res);
        }
      });
      return data;
    },
    handleNodeClick(data, node) {
      if (node.isLeaf) {
        let dataType = "menu";
        data.queryType=this.projectType
        data.queryId=data.id
        this.$emit("changeDataType", dataType, data);
        if(data.id == this.subPageList[0].id) {
          this.$emit("onChangeMainPage", data.id)
        } else {
          let index = this.subPageList.findIndex((element) => element.id == data.id) - 1
          this.$emit("onChangeNewSubpage", data.id, index)
        }
      }
    },
    addSubpageComplete(data) {
      this.updatePageDialog = false
      this.addDialogVisible = false
      this.$emit("changeDataType", 'menu', data)
      this.$emit("onChangeNewSubpage", data.id, this.subPageList.length)
    },
    filterNode(value, data) {
      if (!value || !data.name) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-tree {
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
.page-tree-search {
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
