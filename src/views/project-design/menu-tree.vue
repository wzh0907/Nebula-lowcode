<template>
  <el-drawer
    :with-header="false"
    size="70%"
    :visible.sync="isShowDrawer"
    :direction="direction"
    :before-close="handleClose"
    @open="drawerOpen"
  >
    <el-tabs v-model="tabName" :stretch="true" @tab-click="clickTabs">
      <el-tab-pane label="页面" name="first">
        <el-button
          icon="el-icon-plus"
          style="margin-left: 24px"
          type="text"
          @click="addReport()"
          >添加页面</el-button
        >
        <el-button
          icon="el-icon-plus"
          style="position: absolute; right: 20px"
          type="text"
          @click="addDir()"
          >添加文件夹</el-button
        >
        <div class="tree-wrap">
          <!-- <el-tree
            v-if="isShowTree"
            class="file-tree-nodes"
            ref="tree"
            node-key="treeId"
            highlight-current
            default-expand-all
            :draggable="!isInputFocus"
            :expand-on-click-node="false"
            :data="frontPageList"
            :props="defaultProps"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :filter-node-method="filterNode"
            @node-drop="handleDrop"
            @node-click="openPage"
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
                <li @click="updatePage(data)">修改</li>
                <li @click="delPage(data)">删除</li>
              </ul>
              <i class="el-icon-more" slot="reference"></i>
            </el-popover>
          </span>
          </el-tree> -->
          <el-tree
            v-if="isShowTree"
            ref="tree"
            class="file-tree-nodes"
            node-key="treeId"
            highlight-current
            :default-expand-all="defaultExpandAll"
            :draggable="true"
            :data="reportTreeList"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandedKeys"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :filter-node-method="filterNode"
            @node-drop="handleReportDrop"
            @node-click="handleReportNodeClick"
            @node-expand="handleReportNodeExpand"
            @node-collapse="handleReportNodeCollapse"
          >
            <span slot-scope="{ data, node }" class="tree-item-text-wrap">
              <span class="tree-text-item" :title="data.name">
                <i
                  v-if="data.subType"
                  class="iconfont"
                  :class="fileTypeIconMap[data.subType]"
                />
                <i
                  v-else
                  class="iconfont"
                  :class="fileTypeIconMap[data.dataType]"
                />
                <span>
                  {{ data.name }}
                </span>
              </span>
              <el-popover
                v-show="!data.isEditMode"
                v-if="projectType != 'FROM'"
                :visible-arrow="false"
                placement="right"
                width="150"
                trigger="hover"
              >
                <ul class="file-popover-menu">
                  <!-- <li v-if="data.dataType === 'project' || data.dataType === 'directory'" @click="dropdownCommand('report', data.queryId)">添加页面</li> -->
                  <li
                    v-if="
                      data.dataType === 'project' ||
                      data.dataType === 'directory'
                    "
                    @click="
                      addDialogVisible = true;
                      pageItem = {};
                      entryDirId = data.queryId;
                      updatePageDialog = false;
                      dirItem = {};
                    "
                  >
                    添加页面
                  </li>
                  <!-- <li v-if="data.dataType === 'project' || data.dataType === 'directory'" @click="dropdownCommand('dataset', data.queryId)">添加数据</li>
              <li v-if="data.dataType === 'project' || data.dataType === 'directory'" @click="addFile('database', data.queryId)">添加连接</li> -->
                  <!-- <li
                    v-if="
                      (data.dataType === 'project' ||
                        data.dataType === 'directory') &&
                      node.level < 5
                    "
                    @click="addDir(data.queryId)"
                  >
                    添加子文件夹
                  </li> -->
                  <li
                    @click="updateDir(data, node)"
                    v-if="data.dataType == 'directory'"
                  >
                    修改
                  </li>
                  <li
                    @click="updatePage(data, node)"
                    v-if="data.dataType == 'report'"
                  >
                    修改
                  </li>
                  <li
                    @click="copyFile(data, node)"
                    v-if="
                      data.dataType !== 'project' &&
                      data.dataType !== 'directory' &&
                      data.dataType !== 'database'
                    "
                  >
                    创建副本
                  </li>
                  <li @click="delFileDirTips(data)">删除</li>
                </ul>
                <i slot="reference" class="el-icon-more" />
              </el-popover>
            </span>
          </el-tree>
        </div>
      </el-tab-pane>
      <el-tab-pane label="菜单" name="second">
        <div style="display: flex; flex-direction: row">
          <el-button
            icon="el-icon-plus"
            style="flex: 1; text-align: left; margin-left: 24px"
            type="text"
            @click="addMenu()"
          >
            {{ "添加菜单" }}
          </el-button>
          <el-button
            style="margin-right: 24px"
            @click="previewProject"
            type="text"
            >项目预览</el-button>
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
            :data="treeDataList"
            :props="defaultProps"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
            :filter-node-method="filterNode"
            @node-drop="handleDrop"
          >
            <span slot-scope="{ data, node }" class="tree-item-text-wrap">
              <span>{{ data.name }}</span>
              <el-popover
                :visible-arrow="false"
                placement="right"
                width="150"
                trigger="hover"
              >
<!--                <ul v-if="isShowPage" class="file-popover-menu">-->
<!--                  <li @click="updatePage(data)">修改</li>-->
<!--                  <li @click="delPage(data)">删除</li>-->
<!--                </ul>-->
                <ul class="file-popover-menu">
                  <li
                    v-if="projectType === 'PC' && data.parentId == '0'"
                    @click="addMenu(data.id)"
                  >
                    添加子菜单
                  </li>
                  <li @click="updateMenu(data)">修改</li>
                  <li @click="delMenu(data)">删除</li>
                </ul>
                <i class="el-icon-more" slot="reference"></i>
              </el-popover>
            </span>
          </el-tree>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="大屏" name="third">
        <el-button
          icon="el-icon-plus"
          style="margin-left: 24px"
          type="text"
          @click="addScreen()"
          >添加大屏</el-button
        >

        <div class="tree-wrap">
          <el-tree
            v-if="isShowScreenTree"
            ref="tree"
            class="file-tree-nodes"
            node-key="treeId"
            highlight-current
            :default-expand-all="defaultExpandAll"
            :default-expanded-keys="defaultExpandedKeys"
            :draggable="false"
            :data="screenTreeList"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-drop="handleReportDrop"
            @node-click="handleScreenNodeClick"
          >
            <span slot-scope="{ data, node }" class="tree-item-text-wrap">
              <span class="tree-text-item" :title="data.name">
                <i
                  v-if="data.subType"
                  class="iconfont"
                  :class="fileTypeIconMap[data.subType]"
                />
                <i
                  v-else
                  class="iconfont"
                  :class="fileTypeIconMap[data.dataType]"
                />
                <span>
                  {{ data.name }}
                </span>
              </span>
              <el-popover
                v-show="!data.isEditMode"
                v-if="projectType != 'FROM'"
                :visible-arrow="false"
                placement="right"
                width="150"
                trigger="hover"
              >
                <ul class="file-popover-menu">
                  <li
                    @click="updateDir(data, node)"
                    v-if="data.dataType == 'directory'"
                  >
                    修改
                  </li>
                  <li
                    @click="updatePage(data, node)"
                    v-if="data.dataType == 'report'"
                  >
                    修改
                  </li>

                  <li @click="delScreen(data)">删除</li>
                </ul>
                <i slot="reference" class="el-icon-more" />
              </el-popover>
            </span>
          </el-tree>
        </div>
      </el-tab-pane> -->
    </el-tabs>
    <div class="function-view" @click="handleFunction">
      <i class="iconfont iconfunction" />
      <div style="margin-left: 8px">函数脚本</div>
    </div>
    <div class="file-tree">
      <!--      <div class="file-tree-front" @click="goFrontPage()">-->
      <!--        首页入口-->
      <!--      </div>-->

      <!--      <div class="file-tree-search">-->
      <!--        <span style="flex: 1">主页菜单</span>-->
      <!--        <span class="el-dropdown-link" @click="addMenu()">-->
      <!--          <i class="icon-font el-icon-plus" title="添加菜单"></i>-->
      <!--        </span>-->
      <!--      </div>-->

      <menuDialog
        :dialog-visible.sync="menuDialogVisible"
        :parentId="parentId"
        :projectType="projectType"
        :menuItem="menuItem"
        @initData="initData"
      />
      <dirAddDialog
        :dialog-visible.sync="dirAddDialogVisible"
        :dirId="entryDirId"
        :dirItem="dirItem"
        :title="updateDirDialog ? '修改文件夹' : '添加文件夹'"
        :queryType="projectType"
        :type="type"
        @addFile="addFile"
        @initData="initData"
      />
      <addSubPageDialog
        :dialog-visible.sync="addDialogVisible"
        :parentId="entryDirId"
        entry-dir-id="0"
        :title="updatePageDialog ? '修改页面' : '添加页面'"
        :pageItem="pageItem"
        :projectType="projectType"
        :is-update="updatePageDialog"
        @addFile="addSubpageComplete"
        @updatePageComplete="updatePageComplete"
        @initData="initData"
      />
      <addScreenDialog
        :dialog-visible.sync="addScreenDialogVisible"
        :parentId="entryDirId"
        entry-dir-id="0"
        :title="'添加页面'"
        :pageItem="pageItem"
        @initData="initData"
      />
      <previewDialog
        :dialog-visible.sync="previewVisible"
        :title="'扫描二维码打开项目'"
      />
    </div>
  </el-drawer>
</template>

<script>
import {
  saveProjectFileTreeListSortService,
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
  copyProcessV4,
} from "@/api/v4";
import {
  getMenuListV4,
  getMenuListV5,
  saveMenuService,
  deleteMenuService,
  sortList,
} from "@/api/report";
import { getScreenListService, delScreen } from "@/api/screen";
import { getReportTreeListV5Service } from "@/api/v5";
import menuDialog from "./dialog-module/menuDialog.vue";
import addSubPageDialog from "./dialog-module/add-subpage";
import dirAddDialog from "./dialog-module/add-dir.vue";
import addScreenDialog from "./dialog-module/add-screen.vue";
import previewDialog from "@/views/report/modules/preview/index.vue";
import { getReportDetail } from "@/api/chartsData";
import { deleteSubItemService } from "@/api/v5";
import {getStorage} from "@/util/storageUtil";
import {mapState} from "vuex";
export default {
  name: "menuTree",
  components: {
    menuDialog,
    dirAddDialog,
    addSubPageDialog,
    addScreenDialog,
    previewDialog
  },
  props: ["projectType", "currentMenuId", "drawerVisible"],
  data() {
    return {
      currentDirLevel: 1,
      loaderObj: {},
      tabName: "first",
      direction: "ttb",
      isInputFocus: false,
      isShowTree: true,
      isShowScreenTree: true,
      addDialogVisible: false,
      addScreenDialogVisible: false,
      updatePageDialog: false,
      updateDirDialog: false,
      filterText: "",
      parentId: 0,
      menuDialogVisible: false,
      treeSearchVisible: false,
      dirAddDialogVisible: false,
      defaultExpandAll: false,
      // currentTreeChildren: [],
      treeDataList: [], //菜单数据
      reportTreeList: [],
      frontPageList: [], //首页页面数据
      pageDataList: [], //菜单tab页面数据
      screenTreeList: [],
      // isShowPage: false, //展示的是菜单还是页面（针对菜单tab）
      previewVisible: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      screenProps: {
        children: "children",
        label: "screenName",
      },
      frontId: 0,
      menuItem: {},
      pageItem: {},
      entryDirId: 0,
      dirItem: {},
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
      type: "report",
      defaultExpandedKeys: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    ...mapState({
      token: (state) => state.user.token,
      userName: (state) => state.user.phoneNumber,
      merchantId: (state) => state.user.merchantId,
      projectId: (state) => state.project.projectId,
    }),
    isShowDrawer: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit("update:drawerVisible", val);
      },
    },
    // pageParentId() {
    //   let id = 0;
    //   if (this.tabName === "first") {
    //     if (this.frontPageList.length > 0) {
    //       id = this.frontPageList[0].id;
    //     }
    //   } else {
    //     if (this.pageDataList.length > 0) {
    //       id = this.pageDataList[0].id;
    //     }
    //   }
    //   return id;
    // },
    pageList() {
      return this.tabName === "first" ? this.frontPageList : this.pageDataList;
    },
  },
  created() {
    // this.initData();
  },
  mounted() {
    console.log("mounted menu");
  },
  methods: {
    clickTabs(tab, event) {
      console.log(this.isShowTree);
    },
    drawerOpen() {
      console.log("drawerOpen", this.projectType);
      this.tabName = "first";
      this.isShowPage = false;
      this.initData();
    },
    handleClose(done) {
      this.isShowDrawer = false;
      // this.$emit("cancel");
    },
    updateMenu(data) {
      this.menuItem = data;
      this.menuDialogVisible = true;
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
    delFileDirTips(fileData) {
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delFileDir(fileData);
        })
        .catch(() => {});
    },
    delScreen(data) {
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除
          let param = {
            screenId: data.id,
          };
          delScreen(param).then((res) => {
            this.initData();
          });
        })
        .catch(() => {});
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
      this.updateDirDialog = false;
      this.entryDirId = dirId;
      this.dirAddDialogVisible = true;
      this.dirItem = {};
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
    addReport() {
      this.updatePageDialog = false;
      this.entryDirId = 0;
      this.pageItem = {};
      this.addDialogVisible = true;
    },
    addScreen() {
      this.addScreenDialogVisible = true;
    },
    addMenu(parentId) {
      this.parentId = parentId;
      this.entryDirId = 0;
      this.menuItem = {};
      this.menuDialogVisible = true;
      // this.addPage(this.entryDirId);
      // if (this.tabName === "first") {
      //   this.addPage(this.entryDirId);
      // } else {
      //   if (this.isShowPage) {
      //     this.addPage(this.entryDirId);
      //   } else {
      //     this.menuItem = {};
      //     if (parentId) {
      //       this.parentId = parentId;
      //     } else {
      //       this.parentId = 0;
      //     }
      //     this.menuDialogVisible = true;
      //   }
      // }
    },
    // addPage(parentId) {
    //   console.log("parentId===" + parentId);
    //   this.pageItem = {};
    //   if (parentId) {
    //     this.parentId = parentId;
    //   } else {
    //     this.parentId = 0;
    //   }
    //   this.updatePageDialog = false;
    //   this.addDialogVisible = true;
    // },
    goFrontPage() {
      this.queryReportDetail(this.frontId);
    },
    addSubpageComplete(data) {
      this.updatePageDialog = false;
      this.addDialogVisible = false;
      this.$emit("changeDataType", "report", data);
      // this.$emit(
      //   "onChangeNewSubpage",
      //   data.id,
      //   this.tabName === "first"
      //     ? this.frontPageList.length
      //     : this.pageDataList.length
      // );
    },
    updatePageComplete(data) {
      this.addDialogVisible = false;
      let index = this.pageList.findIndex(
        (element) => element.id == data.reportId
      );
      this.pageList[index].name = data.reportName;
    },
    updatePage(data) {
      this.pageItem = data;
      this.updatePageDialog = true;
      this.addDialogVisible = true;
    },
    delPage(fileData) {
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let tabName = "menu" + fileData.id;
          let index = this.pageList.findIndex(
            (element) => element.id == fileData.id
          );
          if (index == 0) {
            //删除主页面
            delReportV4({
              reportId: fileData.id,
            }).then(() => {
              this.isShowPage = false;
              this.initData();
            });
          } else {
            //删除子页面
            deleteSubItemService({
              subPageId: fileData.id,
            }).then(() => {
              this.pageList.splice(index, 1);
              // this.$emit("removeSubPage", pageInfo.pageIndex);
            });
          }
          this.$emit("removeTab", tabName);
        })
        .catch(() => {});
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
        this.initData();
        // this.initData(res.data.treeId);
      });
    },
    delMenu(fileData) {
      this.$confirm("请确认是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除菜单
          const params = {
            id: fileData.id,
          };
          deleteMenuService(params).then((res) => {
            if (res.code == 0) {
              this.initData();
              this.$emit("delFile", fileData, "menu");
            }
          });
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
    handleReportDrop() {
      console.log(this.reportTreeList, "drop");
      let treeList = this.reportTreeList;
      this.handleTreeSort(treeList);
      saveProjectFileTreeListSortService(treeList);
    },
    handleTreeSort(treeList) {
      if (!treeList || !treeList.length) return false;
      treeList.forEach((treeData, index) => {
        treeData.rank = index + 1;
        if (treeData.children && treeData.children.length) {
          this.handleTreeSort(treeData.children);
        }
      });
    },
    handleDrop() {
      console.log(this.treeDataList, "drop");

      let queryList = [];
      for (let i = 0; i < this.treeDataList.length; i++) {
        let item = this.treeDataList[i];
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
    initData(treeId) {
      console.log("initData");
      this.updatePageDialog = false;
      this.addDialogVisible = false;
      this.addScreenDialogVisible = false;
      var params = {
        queryType: this.projectType,
      };
      // getMenuListV5(params).then((res) => {
      //   this.frontId = res.data.frontMenu.queryId;
      //   this.treeDataList = res.data.menuList;
      //   if (
      //     this.loaderObj.close &&
      //     typeof this.loaderObj.close === "function"
      //   ) {
      //     this.loaderObj.close();
      //   }
      //   // this.queryReportDetail(this.frontId)
      // });
      getMenuListV4(params).then((res) => {
        this.treeDataList = res.dataList;
        if (this.loaderObj.close && typeof this.loaderObj.close === "function")
          this.loaderObj.close();
      });
      let treeParam = {
        queryType: this.projectType,
      };
      getReportTreeListV5Service(treeParam).then((res) => {
        console.log("getReportTreeListV5Service", res);
        this.reportTreeList = res.dataList;
        treeId &&
          this.$nextTick(() => {
            let data = this.findFileTree(treeId, this.reportTreeList);
            if (data) {
              data.queryType = this.projectType;
              this.$emit("changeDataType", data.dataType, data);
            }
          });
      });
      getScreenListService().then((res) => {
        console.log("getScreenListService", res);
        this.screenTreeList = res.dataList;
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
    handleReportNodeExpand(data, node) {
      if (!this.defaultExpandedKeys.includes(data.treeId)) {
        this.defaultExpandedKeys.push(data.treeId);
      }
    },
    handleReportNodeCollapse(data, node) {
      if (this.defaultExpandedKeys.includes(data.treeId)) {
        this.defaultExpandedKeys.map((val, i) => {
          if (val == data.treeId) {
            this.defaultExpandedKeys.splice(i, 1);
          }
        });
      }
    },
    handleReportNodeClick(data, parentData) {
      const dataType = data.dataType;
      if (dataType === "directory") {
        this.$emit("changeDirId", data.queryId);
        const children = data.children || [];
        // if (!children || typeof children.push === 'function') this.currentTreeChildren = children
      } else {
        // currentFileData
        data.queryType = this.projectType;
        data.id = data.queryId;
        this.$emit("changeDataType", dataType, data);
        if (dataType === "project" || dataType === "dataManage") return false;
        const children = parentData.parent.data.children; // 根目录是写死的，所以不用担心没有parent的情况
        const dirId = parentData.parent.data.queryId;
        if (!children || typeof children.push === "function") {
          this.$emit("changeDirId", dirId || "0");
        }
        this.$emit("nodeClick");
      }
      // 获取当前文件夹的层级
      if (dataType === "directory") {
        this.currentDirLevel = parentData.level;
      } else {
        this.currentDirLevel = parentData.level - 1;
      }
    },
    handleScreenNodeClick(data) {
      let merchantId = this.$store.getters.merchantId;
      let projectId = this.$store.getters.projectId;
      let phoneNumber = this.$store.getters.phoneNumber;
      let token = this.$store.getters.token;
      let url;
       
      this.$emit("onChangeScreen", url);
    },
    openPage(data, node) {
      console.log("data.id====" + data.id);
      if (node.isLeaf) {
        let dataType = "menu";
        data.queryType = this.projectType;
        data.queryId = data.id;
        this.$emit("changeDataType", dataType, data);
        if (data.id == this.pageList[0].id) {
          this.$emit("onChangeMainPage", data.id);
        } else {
          let index =
            this.pageList.findIndex((element) => element.id == data.id) - 1;
          this.$emit("onChangeNewSubpage", data.id, index);
        }
      }
    },
    filterNode(value, data) {
      if (!value || !data.name) return true;
      return data.name.indexOf(value) !== -1;
    },
    queryReportDetail(reportId) {
      // setStorage('reportId',this.id)
      const data = {
        reportId: reportId,
      };
      getReportDetail(data)
        .then((res) => {
          // let data = res.data || {};
          // console.log(data.subPageVOList)
          let subPageList = [];
          subPageList.push({
            id: res.data.id,
            name: res.data.reportName,
          });
          if (this.tabName === "first") {
            this.frontPageList = subPageList.concat(res.data.subPageVOList);
          } else {
            this.pageDataList = subPageList.concat(res.data.subPageVOList);
          }

          // this.$emit('getSubPageList', subPageList)
        })
        .catch(() => {
          // 上传组件失败存类型
          // setStorage('subType','')
        });
    },
    updateDir(data, node) {
      console.log("updateDir", data);
      this.updateDirDialog = true;
      this.dirItem = {
        name: data.name,
        id: data.queryId,
      };
      this.dirAddDialogVisible = true;
    },
    handleFunction() {
      this.$emit("nodeClick");
      this.$emit("changeDataType", 'reportFunctionManage');
    },
    previewProject() {
      if (this.projectType === 'MOBILE') {
        this.previewVisible = true
      } else {
        this.toPcDoor()
      }
    },
    toPcDoor() {
      const phoneNumber = getStorage("phoneNumber");
      const username = getStorage("username");
      const token = getStorage("token");
      const projectName = this.$route.query.name

      
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
  height: calc(70vh - 80px);
  padding-bottom: 50px;
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

.function-view {
  background: white;
  cursor: pointer;
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #dddddd;
}
</style>
