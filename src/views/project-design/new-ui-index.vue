<template>
  <div style="display: flex" class="new-ui-content">
    <div style="display: flex; flex-direction: column; padding-left: 5px">
      <logo class="logo-ui" :simple="true" />
      <el-menu
        class="el-menu-vertical-demo"
        active-text-color="#000"
        style="z-index: 100; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15)"
        :collapse="true"
      >
        <el-menu-item
          index="2"
          @click="
            menuDrawer = true;
            projectType = 'PC';
            treeDrawer = false;
          "
        >
          <i class="iconfont iconshoujishumadiannao" style="font-size: 21px" />
          <span slot="title">电脑端页面</span>
        </el-menu-item>
        <el-menu-item
          index="2"
          @click="
            menuDrawer = true;
            projectType = 'MOBILE';
            treeDrawer = false;
          "
        >
          <i class="iconfont iconshouji-tianchong" style="font-size: 20px" />
          <span slot="title">移动端页面</span>
        </el-menu-item>
        <el-menu-item index="3" @click="fileTreeClick">
          <i class="iconfont iconAPIwangguan" />
          <span slot="title">后端接口服务</span>
        </el-menu-item>
        <el-menu-item index="5" @click="changeDataType('dataManage')">
          <i class="iconfont icondb" style="font-size: 23px" />
          <span slot="title">数据库管理</span>
        </el-menu-item>
        <el-menu-item index="6" @click="changeDataType('systemManage')">
          <i class="iconfont iconconnect" style="font-size: 23px" />
          <span slot="title">外部系统接口</span>
        </el-menu-item>
<!--        <el-menu-item index="4" @click="todoor">-->
<!--          <i class="iconfont iconenable" style="font-size: 18px" />-->
<!--          <span slot="title">项目预览</span>-->
<!--        </el-menu-item>-->
        <!-- <el-menu-item index="7" @click="changeDataType('version')">
          <i class="iconfont iconprojectupload" style="font-size: 17px;" />
          <span slot="title">发布</span>
        </el-menu-item> -->
        <!-- <el-menu-item index="7" @click="changeDataType('etl')">
          <i class="iconfont iconicon_convert" style="font-size:23px;" />
          <span slot="title">数据ETL</span>
        </el-menu-item> -->
        <el-menu-item index="8" @click="changeDataType('settings')">
          <i class="iconfont iconshezhi" style="font-size: 23px" />
          <span slot="title">设置</span>
        </el-menu-item>
        <!-- <el-menu-item  v-has="'report:showConfig'" index="10" @click="changeDataType('mind')">
          <i class="iconfont iconmindmap" />
          <span slot="title">项目思维导图</span>
        </el-menu-item> -->
        <el-menu-item
          index="9"
          @click="changeDataType('release')"
          v-has="'project:deploy'"
          v-if="workMode === 'MERCHANT'"
        >
          <i class="iconfont iconprojectupload" style="font-size: 17px" />
          <span slot="title">项目发布</span>
        </el-menu-item>
        <el-menu-item index="11" @click="toHelp">
          <i class="iconfont iconwenhao" />
          <span slot="title">帮助中心</span>
        </el-menu-item>
        <el-menu-item
          index="12"
          v-has="'project:deploy'"
          @click="chatGPTVisible = true"
        >
          <img :src="chartImg" style="width: 24px" />
          <span slot="title">ChatGPT</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 项目菜单抽屉 -->
    <!-- <el-drawer
      :with-header="false"
      size="60%"
      :visible.sync="menuDrawer"
      :direction="direction"
      :before-close="handleClose"

    > -->
    <menuTree
      ref="menuTree"
      :drawer-visible.sync="menuDrawer"
      :project-type="projectType"
      :current-menu-id="currentMenuId"
      @getSubPageList="getSubPageList"
      @changeDataType="changeDataType"
      @changeDirId="changeDirId"
      @delFile="delFile"
      @nodeClick="menuNodeClick"
      @onChangeMainPage="onChangeMainPage"
      @onChangeNewSubpage="onChangeNewSubpage"
      @onChangeScreen="onChangeScreen"
      @cancel="cancelDrawer"
    />
    <pageTree
      style="margin-left: 315px"
      ref="pageTree"
      :drawer-visible.sync="pageDrawer"
      :project-type="projectType"
      :current-menu-id="currentMenuId"
      :subPageList="subPageList"
      @changeDataType="changeDataType"
      @changeDirId="changeDirId"
      @addSubPage="addSubPage"
      @delFile="delFile"
      @nodeClick="pageNodeClick"
      @onChangeMainPage="onChangeMainPage"
      @onChangeNewSubpage="onChangeNewSubpage"
      @cancel="cancelDrawer"
      @removeTab="removeTab"
    />
    <!-- </el-drawer> -->
    <!-- 文件树抽屉 -->
    <el-drawer
      size="80%"
      :with-header="false"
      :visible.sync="treeDrawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <fileTree
        ref="fileTree"
        :project-type="projectType"
        :project-name="projectName"
        :current-dir-id="currentDirId"
        :database-list="databaseList"
        @changeDataType="changeDataType"
        @changeDirId="changeDirId"
        @renameFile="renameFile"
        @delFile="delFile"
        @nodeClick="nodeClick"
      />
    </el-drawer>

    <!-- <el-drawer
      :with-header="false"
      :visible.sync="settingDrawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <settingTree @changeDataType="changeDataType"/>
    </el-drawer> -->

    <!-- <div class="menu-div">
       <menuTree
          ref="menuTree"
          :projectType="projectType"
          :currentMenuId="currentMenuId"
          @changeDataType="changeDataType"
          @changeDirId="changeDirId"
          @delFile="delFile"
        />
    </div> -->

    <div class="ui-content-main content-main">
      <el-row>
        <el-col :span="24">
          <el-tabs
            v-model="editableTabsValue"
            mode="horizontal"
            closable
            @tab-remove="removeTab"
            @tab-click="clickTab"
          >
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.treeId ? item.treeId : item.id"
              :label="item.title"
              :name="item.name"
              style="height: calc(100vh - 51px)"
            >
              <keep-alive>
                <webDesignerIndex
                  v-if="
                    currentDataType === 'report' &&
                    item.treeId === currentFileData.treeId
                  "
                  :id="currentFileData.queryId"
                  :ref="'report' + currentFileData.queryId"
                  :current-file-data="currentFileData"
                  :project-type="currentFileData.queryType || 'PC'"
                  :tree-id="item.treeId"
                  @renameFile="renameFile"
                  @refetchData="refetchData"
                  @tempSave="tempSave"
                  @removeTab="removeTab"
                />
                <webDesignerIndex
                  v-if="
                    currentDataType === 'menu' && item.id === currentFileData.id
                  "
                  :id="currentFileData.queryId"
                  :ref="'menu' + currentFileData.queryId"
                  :current-file-data="currentFileData"
                  :project-type="currentFileData.queryType || 'PC'"
                  :tree-id="item.treeId"
                  @refetchData="refetchData"
                  @renameFile="renameFile"
                  @tempSave="tempSave"
                  @removeTab="removeTab"
                />

                <processIndexV5
                  v-if="
                    currentDataType === 'process' &&
                    currentFileData.subType === 'process' &&
                    item.treeId === currentFileData.treeId &&
                    currentFileData.version === 'V5'
                  "
                  :id="currentFileData.queryId"
                  :tree-id="item.treeId"
                  :current-file-data="currentFileData"
                  @refetchData="refetchData"
                  @renameFile="renameFile"
                  @removeTab="removeTab"
                />
                <processIndex
                  v-else-if="
                    currentDataType === 'process' &&
                    currentFileData.subType === 'process' &&
                    item.treeId === currentFileData.treeId
                  "
                  :id="currentFileData.queryId"
                  :tree-id="item.treeId"
                  :current-file-data="currentFileData"
                  @refetchData="refetchData"
                  @renameFile="renameFile"
                  @removeTab="removeTab"
                />
                <interfaceView
                  v-if="
                    currentDataType === 'process' &&
                    currentFileData.subType === 'interface' &&
                    item.treeId === currentFileData.treeId
                  "
                  :id="currentFileData.queryId"
                  :current-file-data="currentFileData"
                  @refetchData="refetchData"
                />

                <tableauIndex
                  v-if="
                    [
                      'dataset',
                      'dataset-view',
                      'dataset-storedProcedure',
                    ].indexOf(currentDataType) !== -1 &&
                    item.treeId === currentFileData.treeId
                  "
                  :id="currentFileData.queryId"
                  :current-data-type="currentDataType"
                  :current-file-data="currentFileData"
                  script-model="scriptModel"
                  @refetchData="refetchData"
                />
                <databaseIndex
                  v-if="
                    currentDataType === 'database' &&
                    currentFileData.subType === 'database' &&
                    item.treeId === currentFileData.treeId
                  "
                  :database-id="currentFileData.queryId"
                  @changeDataType="changeDataType"
                  @refetchData="refetchData"
                />
                <connect
                  v-if="
                    currentDataType === 'database' &&
                    currentFileData.subType === 'connect' &&
                    item.treeId === currentFileData.treeId
                  "
                  :database-id="currentFileData.queryId"
                  @changeDataType="changeDataType"
                  @refetchData="refetchData"
                />
                <div v-if="currentDataType === 'project'">
                  <el-container>
                    <el-main>
                      <projectIndex :project-type="projectType" />
                    </el-main>
                  </el-container>
                </div>
                <div
                  v-if="
                    currentDataType === 'menu' && item.id === currentFileData.id
                  "
                >
                  <el-container>
                    <el-main>
                      <menuSet
                        :query-type="projectType"
                        :current-file-data="currentFileData"
                      />
                    </el-main>
                  </el-container>
                </div>
                <databaseInfoIndex
                  v-if="
                    currentDataType === 'databaseInfo' &&
                    item.treeId === currentFileData.treeId
                  "
                  :table-name="databaseInfoItemData.tableName"
                  :database-id="databaseInfoItemData.databaseId"
                  :table-id="databaseInfoItemData.tableId"
                  :info-data-type="databaseInfoItemData.infoDataType"
                  @refetchData="refetchData"
                  @changeDataType="changeDataType"
                />
                <dataManageIndex
                  v-if="
                    currentDataType === 'dataManage' &&
                    item.treeId === currentFileData.treeId
                  "
                  :table-name="databaseInfoItemData.tableName"
                  :database-id="databaseInfoItemData.databaseId"
                  :table-id="databaseInfoItemData.tableId"
                  :info-data-type="databaseInfoItemData.infoDataType"
                  @refetchData="refetchData"
                  @changeDataType="changeDataType"
                />
                <!-- 系统连接管理 -->
                <systemManageIndex
                  v-if="
                    currentDataType === 'systemManage' &&
                    item.treeId === currentFileData.treeId
                  "
                  :table-name="databaseInfoItemData.tableName"
                  :database-id="databaseInfoItemData.databaseId"
                  :table-id="databaseInfoItemData.tableId"
                  :info-data-type="databaseInfoItemData.infoDataType"
                  @refetchData="refetchData"
                  @changeDataType="changeDataType"
                />
                <!-- 前端函数脚本 -->
                <functionManageIndex
                  v-if="
                    currentDataType === 'reportFunctionManage' &&
                    item.treeId === currentFileData.treeId
                  "
                  type="report"
                  @changeDataType="changeDataType"
                />
                <!-- 后端函数脚本 -->
                <functionManageIndex
                  v-if="
                    currentDataType === 'processFunctionManage' &&
                    item.treeId === currentFileData.treeId
                  "
                  type="process"
                  @changeDataType="changeDataType"
                />
                <!-- 设置 -->
                <settingsIndex
                  v-if="
                    currentDataType === 'settings' &&
                    item.treeId === currentFileData.treeId
                  "
                  @changeDataType="changeDataType"
                />
                <mindIndex
                  v-if="
                    currentDataType === 'mind' &&
                    item.treeId == currentFileData.treeId
                  "
                  :project-name="projectName"
                  @changeDataType="changeDataType"
                />
                <versionIndex
                  v-if="
                    currentDataType === 'version' &&
                    item.treeId == currentFileData.treeId
                  "
                  @changeDataType="changeDataType"
                />
                <!-- <settingIndex
                  v-if="
                    currentDataType === 'projectSetting' &&
                    item.treeId == currentFileData.treeId
                  "
                  @changeDataType="changeDataType"
                /> -->
                <organizationIndex
                  v-if="
                    currentDataType === 'organization' &&
                    item.treeId == currentFileData.treeId
                  "
                  @changeDataType="changeDataType"
                />
                <!-- <jobIndex
                  v-if="
                    currentDataType === 'job' &&
                    item.treeId == currentFileData.treeId
                  "
                  @changeDataType="changeDataType"
                /> -->
                <etlIndex
                  v-if="
                    currentDataType === 'etl' &&
                    item.treeId == currentFileData.treeId
                  "
                  @changeDataType="changeDataType"
                />
                <release-version
                  v-if="
                    currentDataType === 'release' &&
                    item.treeId == currentFileData.treeId
                  "
                />
              </keep-alive>
              <div
                v-if="
                  currentDataType === 'screen' &&
                  item.treeId == currentFileData.treeId
                "
              >
                <iframe
                  id="iframeId"
                  :src="screenUrl"
                  frameborder="0"
                  class="pc iframe"
                  scrolling="auto"
                >
                </iframe>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <previewDialog
      :dialog-visible.sync="previewVisible"
      :preview-url="previewUrl"
      :projectName="projectName"
      :title="'扫描二维码打开项目'"
    />
    <ChatGPTDrawer
      ref="chatGPT"
      :dialog-visible.sync="chatGPTVisible"
      title="ChatGPT对话"
    />
  </div>
</template>

<script>
import Logo from "@/layout/components/Sidebar/Logo";
import { getFirstReportV5Service } from "@/api/v5";
import { getGlobalVariableListService } from "@/api/globalVariable";

import customHeader from "@/components/customHeader/index";
import Hamburger from "@/components/Hamburger";
import projectIndex from "@/views/project/index.vue";
import webDesignerIndex from "@/views/report/index.vue";
// import mobileDesignIndex from "@/views/report/mobile/old-index.vue";
// import pcDesignIndex from "@/views/report/pc/old-index.vue";

import tableauIndex from "@/views/tableau-design/index.vue";
import databaseIndex from "@/views/database/index.vue";
import databaseInfoIndex from "@/views/database/info/index.vue";
import dataManageIndex from "@/views/data-manage/index.vue";
import systemManageIndex from "@/views/interface-manage/index.vue";
import mindIndex from "@/views/mind/index.vue";
import versionIndex from "@/views/project/version/index.vue";
import functionManageIndex from '@/views/function-manage/index.vue'
// import jobIndex from "@/views/job/index.vue";
// import settingIndex from "@/views/project/setting/index.vue";
import organizationIndex from "@/views/project/organization/index.vue";
import connect from "@/views/connect/index.vue";
import interfaceView from "@/views/interface/index.vue";
import etlIndex from "@/views/etl/index.vue";
import releaseVersion from "@/views/release-version/index.vue";
import menuSet from "@/views/project/menu-set";
import previewDialog from "@/views/report/modules/preview/index.vue";
// import databaseAddDialog from "@/views/database/add.vue";
import fileTree from "./file-tree.vue";
import menuTree from "./menu-tree.vue";
import pageTree from "./page-tree.vue";
import ChatGPTDrawer from "./chatGPT/index.vue";
// import settingTree from "./setting-tree.vue";
import settingsIndex from "./settings.vue";
import processIndex from "@/views/process/new_processV4.vue";
import processIndexV5 from "@/views/process/new_processV5.vue";
import { mapGetters } from "vuex";
import {
  saveAndUpdateTagData,
  removeTagDataByTreeId,
  clearTagData,
} from "@/views/report/utils/deal-data-cache/index";
import { EventBus } from "@/util/event-bus.js";
import Vue from "vue";
import store from "@/store";
import { getStorage, setStorage } from "@/util/storageUtil.js";
import { initVariable } from "@/views/report/utils/deal-global-variable/globalUtils";
export default {
  name: "ProjectDesign",
  components: {
    Logo,
    customHeader,
    Hamburger,
    fileTree,
    menuTree,
    pageTree,
    // settingTree,
    processIndex,
    processIndexV5,
    settingsIndex,
    projectIndex,
    webDesignerIndex,
    // mobileDesignIndex,
    // pcDesignIndex,

    tableauIndex,
    databaseIndex,
    databaseInfoIndex,
    interfaceView,
    dataManageIndex,
    systemManageIndex,
    functionManageIndex,
    menuSet,
    connect,
    mindIndex,
    versionIndex,
    // jobIndex,
    // settingIndex,
    organizationIndex,
    etlIndex,
    previewDialog,
    releaseVersion,
    ChatGPTDrawer,
    // databaseAddDialog,
    // Breadcrumb
  },
  data() {
    return {
      menuDrawer: false,
      treeDrawer: false,
      pageDrawer: false,
      settingDrawer: false,
      direction: "ttb",
      databaseList: [],
      subPageList: [],
      // databaseAdddialogVisible: false,
      fileTreeSideOpened: true,
      projectName: "项目名称",
      projectType: "PC",
      currentFileData: {},
      databaseInfoItemData: {},
      currentDataType: "project",
      currentDirId: "0",
      currentMenuId: 0,
      editableTabsValue: "2",
      editableTabs: [],
      tabIndex: 2,
      merchantId: 0,
      projectId: 0,
      tempSaveDataList: [
        // {
        // treeId:"",
        // treeJsonData:""
        // }
      ],
      previewVisible: false,
      previewUrl: "",
      screenUrl: "",
      currentTabDataList: [],
      singlePageDataType: [
        "mind",
        "version",
        "dataManage",
        "systemManage",
        "settings",
        // "job",
        "etl",
        "release",
        "screen",
        // "projectSetting",
        "organization",
        "reportFunctionManage",
        "processFunctionManage"
      ],
      singlePageDataName: [
        { name: "思维导图", treeId: 999996 },
        { name: "发版", treeId: 999997 },
        { name: "数据源管理", treeId: 999998 },
        { name: "系统管理", treeId: 999999 },
        { name: "设置", treeId: 9999910 },
        // { name: "任务管理", treeId: 999995 },
        { name: "数据ETL", treeId: 999994 },
        { name: "发布", treeId: 999993 },
        { name: "大屏", treeId: 999992 },
        // { name: "基础信息", treeId: 999991 },
        { name: "组织结构", treeId: 999990 },
        { name: "函数管理", treeId: 999911 },
        { name: "函数管理", treeId: 999912 },
      ],
      workMode: getStorage("workMode"),
      chatGPTVisible: false,
      chartImg: require("@/assets/icon/chatGPT.svg"),
    };
  },
  computed: {
    ...mapGetters(["projectList"]),
  },
  created() {
    this.projectName = this.$route.query.name;
    window.document.title = this.projectName;
    this.projectType = this.$route.query.type;
    this.projectId = Number(this.$route.query.projectId);
    this.merchantId = Number(this.$route.query.merchantId);
    this.$store.dispatch("project/setProjectId", this.projectId);
    this.$store.dispatch("user/setMerchantId", this.merchantId);
    if (!this.projectType) this.$message.error("项目数据不全！");

    // this.merchantId = this.$store.getters.merchantId
    // this.projectId = this.$store.getters.projectId
    // Vue.prototype.$deviceDesignType = this.projectType;
    clearTagData();
    // 2021-05-31 进项目 先取第一个菜单页面
    this.queryFirst();
    // this.addTab("project");
    getGlobalVariableListService().then((res) => {
      if (res.code == 0) {
        store.dispatch("global/setGlobalVariables", res.dataList);
      }
    });
    // 用于处理页面的mock 数据的一个变量
    setStorage("authEnv", "dev");
    initVariable();
  },
  mounted() {
    EventBus.$on("onChangeDataTypeGroup", (data) => {
      this.changeDataType("report", data);
    });
    EventBus.$on("onChangeDataTypeEvent", (type, data) => {
      this.changeDataType(type, data);
    });
  },
  beforeDestroy() {
    EventBus.$off("onChangeDataTypeGroup");
    EventBus.$off("onChangeDataTypeEvent");
  },
  methods: {
    closeAllDrawer() {
      (this.menuDrawer = false),
        (this.treeDrawer = false),
        (this.pageDrawer = false),
        (this.settingDrawer = false);
    },
    openSettingDrawer() {
      this.closeAllDrawer();
      this.settingDrawer = true;
    },
    cancelDrawer() {
      this.menuDrawer = false;
      this.pageDrawer = false;
    },
    cancelMenuDrawer() {
      this.menuDrawer = false;
    },
    cancelPageDrawer() {
      this.pageDrawer = false;
    },
    queryFirst() {
      getFirstReportV5Service().then((res) => {
        if (res.code == 0 && res.data.id) {
          this.changeDataType("report", res.data);
        }
      });
    },
    addTab(dataType, fileData, otherData) {
      var tabName;
      var currentTreeId;
      var singleIndex = this.singlePageDataType.indexOf(dataType);
      if (singleIndex != -1) {
        tabName = this.singlePageDataType[singleIndex];
        this.editableTabs.forEach((item, index) => {
          if (item.dataType == tabName) {
            this.$nextTick(() => {
              this.currentDataType = item.dataType;
              this.currentFileData = {
                treeId: item.treeId,
                name: item.name,
              };
            });

            this.editableTabsValue = tabName;
            currentTreeId = item.treeId;

            return true;
          }
        });
        if (!currentTreeId) {
          this.editableTabs.push({
            title: this.singlePageDataName[singleIndex].name,
            name: tabName,
            dataType: dataType,
            treeId: this.singlePageDataName[singleIndex].treeId,
          });
          this.$nextTick(() => {
            this.currentDataType = dataType;
            this.currentFileData = {
              treeId: this.singlePageDataName[singleIndex].treeId,
              name: tabName,
            };
          });
        }
        this.editableTabsValue = tabName;
      } else {
        if (dataType == "menu") {
          tabName = "menu" + fileData.id;
          this.editableTabs.some((item, index) => {
            if (item.id === fileData.id) {
              this.editableTabsValue = tabName;
              currentTreeId = item.id;
              return true;
            }
          });
        } else if (dataType == "report") {
          tabName = "report" + fileData.treeId;
          this.editableTabs.some((item, index) => {
            if (item.id === fileData.id) {
              this.editableTabsValue = tabName;
              currentTreeId = item.id;
              return true;
            }
          });
        } else {
          if (dataType == "directory") {
            return false;
          }
          tabName = "tree" + fileData.treeId;
          this.editableTabs.some((item, index) => {
            if (item.treeId === fileData.treeId) {
              this.editableTabsValue = tabName;
              currentTreeId = item.treeId;
              return true;
            }
          });
        }

        if (!currentTreeId) {
          this.editableTabs.push({
            title: fileData.name,
            id: fileData.id,
            treeId: fileData.treeId,
            name: tabName,
            dataType: dataType,
            fileData: fileData,
            otherData: otherData,
          });
          this.editableTabsValue = tabName;
        }
      }
    },
    removeTab(name) {
      let currentIndex;
      this.editableTabs.forEach((item, index) => {
        if (item.name == name) {
          currentIndex = index;
          removeTagDataByTreeId(item.treeId);
        }
      });
      this.editableTabs.splice(currentIndex, 1);
    },
    clickTab(tab) {
      this.editableTabs.forEach((item, index) => {
        if (item.name == tab.name) {
          this.currentDataType = "";
          this.$nextTick(() => {
            this.currentDataType = item.dataType;
            if (this.singlePageDataType.indexOf(this.currentDataType) != -1) {
              this.currentFileData = {
                treeId: item.treeId,
                name: item.name,
              };
            } else {
              item.fileData && (this.currentFileData = item.fileData);
              item.otherData && (this.databaseInfoItemData = item.otherData);
            }
          });
        }
      });
      EventBus.$off("onChangeCurrentWidgetComponentConfig");
      EventBus.$off("onChangeTableColEvent");
      EventBus.$off("moveOutComponentItem");
      EventBus.$off("pcEventHandler");
      // 数据model 错乱问题
      if (tab.name.indexOf("menu") != -1) {
        let that = this;
        setTimeout(() => {
          let reportRep = "menu" + that.currentFileData.queryId;
          that.$refs[reportRep][0].initPageData();
          that.$refs[reportRep][0].addListenEvent();
        }, 100);
      }
      if (tab.name.indexOf("report") != -1) {
        let that = this;
        setTimeout(() => {
          let reportRep = "report" + that.currentFileData.queryId;
          that.$refs[reportRep][0].initPageData();
          that.$refs[reportRep][0].addListenEvent();
        }, 100);
      }
    },
    handleClose(done) {
      done();
    },
    toHelp() {
      window.open(
        "https://qiekcaj4o3.feishu.cn/docs/doccnAm4ZZ1kzjCiA6smQypU8Cf"
      );
    },
    todoor() {
      this.previewVisible = true;
      // const phoneNumber = localStorage.getItem("phoneNumber");
      // const username = localStorage.getItem("username");
      // const token = localStorage.getItem("token");
      // if (this.projectType === "MOBILE") {
      // this.previewVisible = true;
      // } else {
      //   if (this.merchantId == 8 && this.projectId == 55) {
      //     window.open(
      //       "https://pc.dipaas.com/#/tamlogin?merchantId=" +
      //         this.merchantId +
      //         "&projectId=" +
      //         this.projectId,
      //       "_blank"
      //     );
      //   } else {
      //     window.open(
      //       "https://pc.dipaas.com/#/authPage?projectId=" +
      //         this.projectId +
      //         "&merchantId=" +
      //         this.merchantId +
      //         "&phoneNumber=" +
      //         phoneNumber +
      //         "&username=" +
      //         username +
      //         "&token=" +
      //         token +
      //         "&projectName=" +
      //         this.projectName +
      //         "&type=viewLook",
      //       "_blank"
      //     );
      //   }
      // }
    },
    refetchData() {
      this.$refs.fileTree.initData();
    },
    getSubPageList(subPageList) {
      this.subPageList = subPageList;
      this.treeDrawer = false;
      this.pageDrawer = true;
    },
    changeDataType(dataType, fileData, otherData) {
      if (
        this.currentDataType === dataType &&
        this.currentFileData === fileData
      )
        return false; // 判断是否为同一对象，是的话说明是同一个页面
      if (dataType == "report") {
        EventBus.$off("onChangeCurrentWidgetComponentConfig");
        EventBus.$off("onChangeTableColEvent");
        EventBus.$off("moveOutComponentItem");
        EventBus.$off("pcEventHandler");
      }
      this.currentDataType = "";
      this.$nextTick(() => {
        this.currentDataType = dataType;
        fileData && (this.currentFileData = fileData);
        otherData && (this.databaseInfoItemData = otherData);
        this.addTab(dataType, fileData, otherData);
      });
    },
    menuNodeClick() {
      // this.treeDrawer = false;
      // this.pageDrawer = true;

      this.menuDrawer = false;
      this.treeDrawer = false;
    },
    pageNodeClick(pageType) {
      this.menuDrawer = false;
      this.treeDrawer = false;
      this.pageDrawer = false;
    },
    nodeClick() {
      this.menuDrawer = false;
      this.treeDrawer = false;
      this.pageDrawer = false;
    },
    onChangeMainPage(pageId) {
      this.menuDrawer = false;
      this.treeDrawer = false;
      this.pageDrawer = false;
      console.log("onChangeMainPage");
      // this.$refs[refName].onChangeMainPage()
    },
    onChangeNewSubpage(pageId, index) {
      this.menuDrawer = false;
      this.treeDrawer = false;
      this.pageDrawer = false;
      console.log("onChangeNewSubpage");
      // this.$refs[refName].onChangeNewSubpage(pageId, index)
    },
    onChangeScreen(url) {
      this.menuDrawer = false;
      this.treeDrawer = false;
      this.pageDrawer = false;
      this.changeDataType("screen");
      this.screenUrl = url;
    },
    addSubPage() {},
    changeDirId(dirId) {
      this.currentDirId = dirId;
    },
    changeMenuId(menuId) {
      this.currentMenuId = menuId;
    },
    toggleSideBar() {
      this.fileTreeSideOpened = !this.fileTreeSideOpened;
    },

    renameFile(treeId, name) {
      this.editableTabs.forEach((item, index) => {
        if (item.treeId == treeId) {
          item.title = name;
          this.editableTabsValue = "tree" + treeId;
        }
      });
    },
    delFile(fileData, dataType) {
      var name;
      if (dataType == "menu") {
        name = "menu" + fileData.id;
      } else {
        name = "tree" + fileData.treeId;
      }
      this.removeTab(name);
    },
    fileTreeClick() {
      this.treeDrawer = true;
      this.menuDrawer = false;
      // this.$refs.fileTree.initData()
    },
    // 暂时用keepalive 代替了
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName.indexOf("report") != -1) {
        let that = this;
        //  if(that.$refs[oldActiveName][0]){
        //   that.$refs[oldActiveName][0].removeCurrent();
        //  }
        // setTimeout(() => {
        //   let reportRep = 'report'+that.currentFileData.queryId
        //   console.log("-----------beforeLeave--",that.currentFileData,oldActiveName);

        //   that.$refs[oldActiveName][0].removeListenEvent();
        // }, 100);
      }

      // if (oldActiveName != 2) {
      //   const oldNameList = oldActiveName.split("menu");
      //   console.log("oldNameList", oldNameList);
      //   if (oldNameList.length > 1) {
      //     const oldTreeId = parseInt(oldNameList[1]);
      //     this.tempSaveDataList.forEach((temp) => {
      //       if (temp.type == "menu" && temp.treeId === oldTreeId) {
      //         // this.currentTabDataList.push(temp);
      //         saveAndUpdateTagData(temp.treeId, temp.treeJsonData);
      //       }
      //     });
      //   }
      // }
    },
    tempSave(treeId, jsonData, type) {
      // 2021-06-17 功能修改暂时注释
      var existFlag = false;
      this.tempSaveDataList.forEach((tempItem) => {
        if (tempItem.treeId == treeId) {
          existFlag = true;
          tempItem.treeJsonData = jsonData;
        }
      });
      if (!existFlag) {
        this.tempSaveDataList.push({
          treeId: treeId,
          type: type,
          treeJsonData: jsonData,
        });
      }
    },
  },
};
</script>

<style  lang="scss" >
.ui-content-main > .el-row > .el-col > .el-tabs > .el-tabs__header {
  background-color: #fff;
  padding-left: 20px;
  .el-tabs__nav {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  .el-tabs__item {
    height: 50px;
    line-height: 50px;
  }
  .el-tabs__item.is-active {
    color: #0962ea;
    border-bottom: 2px solid rgba(9, 98, 234, 1);
  }
  .el-tabs__active-bar {
    background-color: transparent;
    border: 0px;
  }
  .el-tabs__item:nth-child(2) {
    padding-left: 20px;
  }
  .el-tabs__item:last-child {
    padding-right: 20px;
  }
  // .el-tabs__item{
  //   background-color: #f5f5f5;
  //   border:1px solid #EAEAEA;
  //   margin: 0px 10px;
  //    color:#666;
  //   border-top-left-radius: 5px;
  //   border-top-right-radius: 5px;
  // }
  //   .el-tabs__item.is-active{
  //     background-color: #fff;
  //     color:#666;
  //     margin: 0px 10px;
  //     border-bottom: 0px;
  //   }
}
</style>

<style lang="scss" scoped>
.logo-ui {
  height: 50px;
  margin-left: -10px;
  padding-left: 10px;
  line-height: 50px;
  background: #fff;
  /deep/img {
    margin-right: 0px !important;
  }
}
.element::-webkit-scrollbar {
  display: none;
}
.menu-div {
  position: absolute;
  left: 66px;
  top: 10px;
  z-index: 999;
  width: 200px;
  background-color: #fff;
  border-radius: 10px;
}
.new-ui-content {
  /deep/.el-menu--collapse {
    width: 50px;
    max-height: 500px;
    border-radius: 5px;
    margin-top: 5px;
  }
  /deep/.el-drawer.ttb {
    width: 260px !important;
    margin-left: 70px;
    border-radius: 5px;
    overflow: auto;
    margin-top: 55px;
  }
}
.el-menu-vertical-demo {
  .el-menu-item {
    height: 50px;
  }
  .iconfont {
    color: #444444;
    font-size: 24px;
  }
  /deep/.el-tooltip {
    padding: 0px 13px !important;
    line-height: 50px;
  }
}
/deep/.ttb::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.el-drawer .ttb {
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
}

.project-slider {
  display: flex;
  flex-direction: column;
  float: left;
  height: 100%;
  width: 40px;
  padding-top: 14px;
  background-color: #fff;
  box-shadow: 3px 0px 2px rgba(150, 150, 150, 0.3);
  transition: width 0.5s;
  &.sliderActive {
    width: 200px;
  }
  .hamburger-container {
  }
  .project-file-tree {
    flex: 1;
    overflow: hidden;
    border-top: 1px solid #dbdbdb;
  }
}
.content-main {
  float: left;
  height: 100%;
  flex: 1;
  overflow-x: hidden;
}
/deep/.el-tabs__header {
  margin: 0px;
}
.iframe {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 93vh;
  background: #fff;
  overflow-y: hidden;
}
</style>
