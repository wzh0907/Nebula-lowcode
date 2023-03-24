<template>
  <div>
    <custom-header>
      <div style="width: 200px" slot="title">
        <div
          style="
            font-size: 14px;
            line-height: 40px;
            padding: 0 15px;
            cursor: pointer
          "
          :style="{color: hideLeftAsideMenu ? '#0962ea' : ''}"
          @click="closeLeftAsideMenu"
        >
          <i
            v-if="hideLeftAsideMenu"
            class="iconfont iconicon_yingyongguanli"
            style="margin-right: 8px;"
          ></i>
          <i
            v-else
            class="iconfont iconicon_yingyongguanli"
            style="margin-left: 16px; cursor: pointer"
          ></i>
          组件库
        </div>
      </div>
      <div slot="opertBtn" style="text-align: center">
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          :disabled="!$globalData.operateStack.length"-->
        <!--          size="medium"-->
        <!--          icon="el-icon-back"-->
        <!--          @click="handleUndo"-->
        <!--          >撤销</el-button-->
        <!--        >-->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          :disabled="!$globalData.operateRepealStack.length"-->
        <!--          size="medium"-->
        <!--          icon="el-icon-right"-->
        <!--          @click="handleRedo"-->
        <!--          >重做</el-button-->
        <!--        >-->
        <span class="el-button-opert-text">
          <el-button
            type="text"
            size="medium"
            icon="iconfont iconsave1"
            @click="onGenerateSaveJson"
            >保存</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-view"
            @click="onHandlePreview"
            >预览</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-view"
            @click="onHandleReload"
            >重载</el-button
          >
          <el-button
            type="text"
            size="medium"
            icon="iconfont iconqingkong"
            @click="onHandleClear"
            >清空</el-button
          >
          <!-- <el-button
            type="text"
            size="medium"
            icon="iconfont icontrash"
            @click="onHandleDelete"
            >删除</el-button
          > -->
          <!--          <el-button-->
          <!--            type="text"-->
          <!--            size="medium"-->
          <!--            icon="iconfont iconshangchuan"-->
          <!--            @click="uploadComment"-->
          <!--            v-has="'project:upload'"-->
          <!--            >上传市场-->
          <!--          </el-button>-->
          <!--          <el-button-->
          <!--            type="text"-->
          <!--            size="medium"-->
          <!--            icon="iconfont iconcloud-download"-->
          <!--            @click="downComponentDialogVisible = true"-->
          <!--            >页面模板-->
          <!--          </el-button>-->
          <el-button
            type="text"
            size="medium"
            icon="iconfont iconbianliangbijiao"
            @click="globalVarableDialogVisible = true"
            >全局变量
          </el-button>
          <el-button
            type="text"
            size="medium"
            icon="iconfont iconcloud-download"
            v-has="'report:showConfig'"
            @click="showConfigJson"
            >页面代码
          </el-button>
          <el-button

            type="text"
            size="medium"
            icon="iconfont iconlishijilu"
            v-has="'report:showConfig'"
            @click="showVersionManage"
            >历史记录
          </el-button>
        </span>
      </div>
      <div
        slot="right"
        style="
          font-size: 14px;
          line-height: 40px;
          text-align: right;
          padding-right: 8px;
          cursor: pointer
        "
        :style="{color: hideRightAsideMenu ? '#0962ea' : ''}"
        @click="closeRightAsideMenu"
      >
        <i
          v-if="hideRightAsideMenu"
          class="iconfont iconset"
          style="margin-right: 8px;"
        ></i>
        <i
          v-else
          class="iconfont iconset"
          style="margin-left: 16px; cursor: pointer"
        ></i>
        组件配置
      </div>
    </custom-header>
    <!-- 代码编辑弹窗 -->
    <codeEditDialog
      ref="codePreview"
      :visible="codeEditVisible"
      title="代码编辑"
      width="800px"
      form
      @on-close="codeEditVisible = false"
    >
      <el-tabs
        v-model="codeActiveName"
        type="border-card"
        style="box-shadow: none"
      >
        <el-tab-pane label="CSS" name="css">
          <code-editor v-model="cssTemplate" height="450px" mode="css" />
        </el-tab-pane>
      </el-tabs>

      <template slot="action">
        <template>
          <el-button type="primary" @click="onSaveCssJs">保存</el-button>
        </template>
      </template>
    </codeEditDialog>
    <!-- 图片组件 弹框 -->
    <img-top-dialog
      ref="imgTopDialogForm"
      :dialog-visible.sync="imgVisible"
      :title="imgTitle"
      :list-data="imgListData"
    />
    <!-- 组件上传 -->
    <uploadCommentDialog
      ref="uploadCommentForm"
      :dialog-visible.sync="uploadCommentVisible"
      title="组件上传"
    />
    <icon-select-dialog
      :dialog-visible.sync="iconVisible"
      :isChoose="false"
      title="图标"
      :list-data="iconListData"
    />
    <!-- 预览 -->
    <mobilePreviewDialog
      :dialog-visible.sync="previewDialog"
      :componentList="componentList"
      :subpageList="subpageList"
      :globalConfig="currentGlobalConfig"
      :reportId="String(id)"
      v-if="projectType === 'MOBILE'"
    />
    <pcPreviewDialog
      :dialog-visible.sync="previewDialog"
      :componentList="componentList"
      :subpageList="subpageList"
      :pageEventConfig="pageEventConfig"
      :globalConfig="currentGlobalConfig"
      v-if="projectType === 'PC'"
    />
<!--    <el-dialog :visible.sync="delDialogVisible" width="30%">-->
<!--      <span style="font-size: large">是否删除？</span>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="delDialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="delConfirm">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
    <downComponentDialog
      @refreshGroupComponentList="refreshGroupComponentList"
      @refreshConfigJson="dealWithDetailData"
      :dialog-visible.sync="downComponentDialogVisible"
      openType="0"
      title="组件下载"
    />
    <globalVariableDialog
      :dialog-visible.sync="globalVarableDialogVisible"
      title="全局变量"
    />
    <VersionManageDialog
     ref="versionManage"
     :dialog-visible.sync="versionManageVisible"
     :id="id"
     type="report"
     :scheme="scheme"
      title="历史记录"
      @loadData="loadData"
    />
    <el-dialog :visible.sync="configDialogVisible" width="30%">
      <span style="font-size: large">
        <el-input
          type="textarea"
          :rows="15"
          placeholder="请输入内容"
          v-model="configJson"
        >
        </el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmJson">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
// ts类型
import { componentConfigItemType } from "@/views/report/type";
// vue
import { Vue, Watch, Prop, Component } from "vue-property-decorator";
// tools
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import { coverBigComponent } from "@/views/report/utils/common-const";
import { loadCssStyle } from "@/views/report/utils/index.js";
import { loadCss } from "@/util/index.js";
// 组件
import customHeader from "@/components/customHeader/index.vue";
import codeEditDialog from "@/views/report/modules/code-edit-dialog.vue";
import CodeEditor from "@/components/CodeEditor/index.vue";
import imgTopDialog from "@/views/report/modules/imgUpload/imgTopDialog.vue";
import uploadCommentDialog from "@/views/report/modules/uploadComment/index.vue";
import iconSelectDialog from "@/views/report/modules/icon-select-dialog.vue";
import mobilePreviewDialog from "@/views/report/modules/preview-dialog-mobile.vue";
import pcPreviewDialog from "@/views/report/modules/preview-dialog-pc.vue";
import groupComponentConfig from "@/views/report/mobile/components/configs/group-component/index.js";
// api
import { saveAuthorityService } from "@/api/authority/index";
import { iconList } from "@/api/icon";
import { delReportV4, renameReportService } from "@/api/v4/index";
import { getGroupComponentListService } from "@/api/report";
import { transformComponentConfigSimpleToFullV2 } from "@/views/report/utils/deal-component-data/transform-component-config-2.0";
import downComponentDialog from "../../../project-design/dialog-module/downComment/index.vue";
import globalVariableDialog from "../../../project-design/dialog-module/globalVariable/index.vue";
import VersionManageDialog from "../../../project-design/dialog-module/versionManage/index.vue";
import {
  saveReportV3,
  commonlyImgList,
  getReportCssItem,
  getReportSaveCss,
} from "@/api/chartsData";
import { saveSubItemService, deleteSubItemService } from "@/api/v5";
import { EventBus } from "@/util/event-bus.js";


const pako = require('pako');

@Component({
  components: {
    customHeader,
    codeEditDialog,
    CodeEditor,
    imgTopDialog,
    iconSelectDialog,
    mobilePreviewDialog,
    pcPreviewDialog,
    uploadCommentDialog,
    downComponentDialog,
    globalVariableDialog,
    VersionManageDialog
  },
})
export default class DesignHeader extends Vue {
  name: "DesignHeader";
  // Vue Compute
  get merchantList() {
    return this.$store.getters.merchantList;
  }
  // prop
  @Prop({
    type: String,
    default: "",
  })
  projectType;
  @Prop({
    type: Number,
    default: 0,
  })
  id;
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  globalConfig;
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  currentGlobalConfig;
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  componentList;
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  mainComponentList;
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  subpageList;
  @Prop({
    type: Number,
    default: 0,
  })
  chooseSubpageIndex;
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  currentFileData;
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  collectionPermissionListPool; // 权限收集, 组件id: 组件，这种结构可以快速查找到对应的权限

  @Prop({
    type: Number,
    default: "",
  })
  imgFileId;
  @Prop({
    type: Number,
    default: "",
  })
  chosenFileId;
  @Prop({
    type: Boolean,
    default: false,
  })
  hideLeftAsideMenu;

  @Prop({
    type: Boolean,
    default: false,
  })
  hideRightAsideMenu;
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  pageEventConfig;
  isEditingName = false;
  // data
  // collectionPermissionListPool = {};// 权限收集, 组件id: 组件，这种结构可以快速查找到对应的权限
  iconListData = {};
  imgTitle = "";
  imgListData = [];
  codeEditVisible = false;
  cssId = "";
  cssTemplate = "";
  jsTemplate = "";
  codeActiveName = "css";
  imgVisible = false;
  uploadCommentVisible = false;
  downComponentDialogVisible = false;
  globalVarableDialogVisible = false;
  iconVisible = false;
  addReportId = 0;
  previewDialog = false;
  delDialogVisible = false;
  choosePageGroupComponentList = [] as componentConfigItemType[];
  pageModuleList = [] as componentConfigItemType[];
  componentsConfigs = [] as componentConfigItemType[][];
  configDialogVisible = false;
  versionManageVisible = false;
  configJson = "";
  scheme=";"

  @Watch("imgFileId")
  onImgFileId(val, oldVal) {
    this.imgFileId = val;
  }
  @Watch("chosenFileId")
  onChosenFileId(val, oldVal) {
    this.chosenFileId = val;
  }
  @Watch("chooseSubpageIndex")
  onChooseSubpageIndex(val, oldVal) {
    this.chooseSubpageIndex = val;
  }

  mounted() {}
  beforeDestroy() {}
  created() {
    this.getDefaultIcon();
  }

  // 刷新页面
  onHandleReload() {
    this.$emit('onReloadView')
  }

  //关闭侧边栏
  closeLeftAsideMenu() {
    this.$emit("closeLeftAsideMenu");
  }
  closeRightAsideMenu() {
    this.$emit("closeRightAsideMenu");
  }

  // onDebug(){
  //   let password = window.prompt('输入密码')
  //   console.log(password)
  // }
  // 代码编辑
  onGenerateCode() {
    this.codeEditVisible = true;
    // console.log(this.codeEditVisible)
  }
  onHandlePreview() {
    this.previewDialog = true;
    return

  }
  onHandleClear() {
    this.$confirm("请确认是否清空?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.componentList.splice(0, this.componentList.length);
        this.subpageList.splice(0, this.subpageList.length);
        // 清空操作记录
        this.$globalData.operateStack = [];
        this.$globalData.operateRepealStack = [];
      })
      .catch(() => {});
  }
  onHandleDelete() {
    this.$confirm("请确认是否删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.delConfirm()
        // this.componentList.splice(0, this.componentList.length);
        // this.subpageList.splice(0, this.subpageList.length);
        // // 清空操作记录
        // this.$globalData.operateStack = [];
        // this.$globalData.operateRepealStack = [];
      })
      .catch(() => {});
  }
  uploadComment() {
    this.uploadCommentVisible = true;
  }
  //删除组件
  deleComment() {
    let deleCreatGroupEvent = new CustomEvent("dele-creat-group", {
      detail: { data: this.currentFileData },
    });
    window.dispatchEvent(deleCreatGroupEvent);
  }
  // 保存json数据
  onGenerateSaveJson() {
    console.log('onGenerateSaveJson');
    let pageMap = this.$store.getters.pageMap;
    let pageInfo = pageMap.get(this.id);
    const configJson = this.handleConfigPageConfigJson();
    let saveService;
    const configJsonString = JSON.stringify(configJson)
    //压缩configJson
    const compressed = pako.deflate(configJsonString)
    const restored = pako.inflate(compressed, { to: 'string' });

    const jsonData = {
      id: 0,
      configJson: configJsonString,
      type: "app",
      queryType: this.projectType,
      imgFileId: 0,
      chosenFileId: 0,
    };
    if (pageInfo.id) {
      jsonData.id = this.id;
    }
    if (this.chooseSubpageIndex) {
      saveService = saveSubItemService;
      jsonData.id = pageInfo.subpageList[this.chooseSubpageIndex - 1];
    } else {
      jsonData.id = pageInfo.id;
      saveService = saveReportV3;
      jsonData.imgFileId = this.imgFileId;
      jsonData.chosenFileId = this.chosenFileId;
    }

    if (this.id) {
      jsonData.id = this.id;
      this.handlePermission(this.id);
    }

    console.log("JSON: =============>>>>>", configJsonString);
    // console.log("compressed: =============>>>>>", compressed);

    saveService(jsonData).then((res: any) => {
      this.addReportId = res.data.id;
      this.$message.success(res.message);
      this.$emit("refetchData");
    });
    this.$emit('savePage')
  }
  handleConfigJson(compList) {
    let mainList = [];
    let subpageList = [] as any;
    let componentList = compList;
    let globalConfig = this.globalConfig;

    globalConfig.interfaceDataConfig =
      this.$pageDataModelEngine.getCleanInterfaceConfig();
    this.choosePageGroupComponentList = [];
    this.handleComponentListData(componentList, mainList);
    this.subpageList.forEach((subpageItem) => {
      let listTemp = [];
      this.handleComponentListData(subpageItem.list, listTemp);
      subpageList.push({
        list: listTemp,
        config: subpageItem.config,
      });
    });
    return {
      list: mainList,
      subpageList,
      config: this.globalConfig,
      groupList: this.choosePageGroupComponentList,
      eventConfig: this.pageEventConfig,
      // localData: getPageLocalData(),
    };
  }
  handleConfigPageConfigJson() {
    let mainList = [];
    let subpageList = [] as any;
    let componentList = this.componentList;
    // console.log('handleConfigPageConfigJson===',  this.componentList)
    let globalConfig = this.globalConfig;

    globalConfig.interfaceDataConfig =
      this.$pageDataModelEngine.getCleanInterfaceConfig();
    this.choosePageGroupComponentList = [];
    this.handleComponentListData(componentList, mainList);
    this.subpageList.forEach((subpageItem) => {
      let listTemp = [];
      this.handleComponentListData(subpageItem.list, listTemp);
      subpageList.push({
        list: listTemp,
        config: subpageItem.config,
      });
    });
    console.log(
      "handleConfigPageConfigJson",
      globalConfig,
      this.globalConfig,
      this.pageEventConfig
    );
    return {
      list: mainList,
      subpageList,
      config: this.globalConfig,
      groupList: this.choosePageGroupComponentList,
      eventConfig: this.pageEventConfig,
      // localData: getPageLocalData(),
    };
  }
  handleComponentListData(componentList, listTemp) {
    // TODO::: table组件需要特殊处理 a
    componentList.forEach((item) => {
      if (item.type == "diy") {
        listTemp.push(item);
      } else {
        let newItem = this.componentDeepClone(item); // 重新复制一份进行操作，避免影响设计器中的数据
        let componentObj = {} as any;
        componentObj.type = newItem.type;
        componentObj.uuid = newItem.uuid;
        componentObj.options = newItem.options;
        let optionsColumns =
          componentObj.options && componentObj.options.columns;
        // 处理嵌套型组件
        if (
          coverBigComponent.indexOf(componentObj.type) !== -1 &&
          optionsColumns &&
          optionsColumns.length
        ) {
          optionsColumns.forEach((columnItem) => {
            if (columnItem.componentList && columnItem.componentList.length) {
              let tempComponentList = [];
              this.handleComponentListData(
                columnItem.componentList,
                tempComponentList
              );
              columnItem.componentList = tempComponentList;
            }
          });
        } else if (item.type == "van-design-group-component") {
          if (
            componentObj.options.componentList &&
            componentObj.options.componentList.length
          ) {
            let tempComponentList = [];
            this.handleComponentListData(
              componentObj.options.componentList,
              tempComponentList
            );
            componentObj.options.componentList = tempComponentList;
          }
        }

        // 处理组件的临时数据
        if (
          componentObj.options.interfaceDataConfig &&
          componentObj.options.interfaceDataConfig.tableData
        ) {
          // 正常组件
          componentObj.options.interfaceDataConfig.tableData = [];
        }
        if (
          componentObj.options.interfaceDataConfig &&
          componentObj.options.interfaceDataConfig.chartData
        ) {
          // 图表组件
          if (componentObj.options.interfaceDataConfig.chartData.rows) {
            componentObj.options.interfaceDataConfig.chartData.rows = [];
          }
        }
        if (
          componentObj.options.columnsData &&
          componentObj.options.columnsData.length
        ) {
          // table组件特殊处理
          componentObj.options.columnsData.forEach((columnsDataItem) => {
            if (
              columnsDataItem.interfaceDataConfig &&
              columnsDataItem.interfaceDataConfig.tableData
            ) {
              columnsDataItem.interfaceDataConfig.tableData = [];
            }
          });
        }

        // Table组件特殊处理
        if (componentObj.type === 'van-design-table') {
          componentObj.options.columns.forEach(tableColumnItem => {
            tableColumnItem._specialConfig && (tableColumnItem._specialConfig.interfaceDataConfig.tableData = [])
            tableColumnItem._specialConfig &&  tableColumnItem._specialConfig.componentList.forEach(componentItem => {
              componentItem.interfaceDataConfig.tableData = []
            })
          })
          componentObj.options.columnsConfigList.forEach(tableColumnConfigItem => {
            tableColumnConfigItem.interfaceDataConfig.tableData = []
            tableColumnConfigItem.componentList.forEach(componentItem => {
              componentItem.interfaceDataConfig.tableData = []
            })
          })
        }
        listTemp.push(componentObj);
      }
    });
  }
  handlePermission(id) {
    // 处理权限，使用权限列表发起请求
    for (let key in this.collectionPermissionListPool) {
      // 添加权限
      let permissionData = this.collectionPermissionListPool[key];
      saveAuthorityService({
        reportId: id,
        type: "component",
        queryType:this.projectType,
        authorityName: permissionData.options.commonConfigAssignName,
        authorityId: permissionData.uuid,
      });
    }
  }
  onSaveCssJs() {
    if (this.codeActiveName === "css") {
      let params = {
        css: this.cssTemplate,
        reportId: this.id,
      } as any;
      if (this.cssId) {
        params.id = this.cssId;
      }
      getReportSaveCss(params).then((res: any) => {
        if (res.code === 0) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.codeEditVisible = false;
          this.queryCssJs();
        } else {
          this.$message.error(res.message);
        }
      });
    } else {
    }
  }
  queryCssJs() {
    getReportCssItem({ reportId: this.id }).then((res) => {
      this.cssId = (res.data && res.data.id) || "";
      this.cssTemplate = (res.data && res.data.css) || "";
      this.cssTemplate && loadCssStyle(this.cssTemplate);
    });
  }
  // 查看图库
  getUploadImg() {
    this.imgVisible = true;
    this.imgTitle = "图片";
    this.getDefaultImg();
  }
  getDefaultImg() {
    commonlyImgList({ type: "default" }).then((res: any) => {
      if (res.code === 0) {
        this.imgListData = res.dataList;
      } else {
        this.$message.error(res.message);
      }
    });
  }
  // 查看图库
  getUploadIcon() {
    this.iconVisible = true;
    this.getDefaultIcon();
  }
  getDefaultIcon() {
    iconList({ type: "custom" }).then((res: any) => {
      if (res.code === 0) {
        this.iconListData = res.data.iconList;
        let cssUrl = res.data.cssUrl;
        loadCss(cssUrl);
      } else {
        this.$message.error(res.message);
      }
    });
  }
  /**
   * 撤销重做功能思路：
   *
   */
  handleUndo() {
    // 声明操作栈的数据结构
    type operateStackItem = {
      uuid: string; // 操作组件的uuid
      isDelete: boolean; // 是否为删除操作
      isAdd: boolean; // 是否为添加操作
      isMove: boolean; // 是否为移动操作
      componentList: []; // 被操作组件的容器（容器的组件列表）
      componentConfig: {}; // 被操作组件的详细内容
      componentIndex: number; // 被操作组件在容器中的位置
    };
    // 从操作栈弹出一条记录进行撤销操作
    let operateStackItem = this.$globalData.operateStack.pop();
    if (!operateStackItem) return false;
    let repealStackItem = operateStackItem;
    // 三种操作类型：删除组件、添加组件、移动组件
    if (operateStackItem.isDelete) {
      // 撤销删除操作
      let componentIndex = operateStackItem.componentIndex;
      let componentList = operateStackItem.componentList;
      let componentConfig = operateStackItem.componentConfig;
      componentList.splice(componentIndex, 0, componentConfig);
    } else if (operateStackItem.isAdd) {
      // 撤销添加操作
      // console.log('xxxx', operateStackItem)
      let componentList = operateStackItem.componentList;
      componentList.forEach((componentItem, componentIndex) => {
        if (operateStackItem.uuid === componentItem.uuid) {
          let arr = componentList.splice(componentIndex, 1);
          // 往重做栈中推入新纪录
          repealStackItem.componentConfig = arr[0];
          repealStackItem.componentIndex = componentIndex;
        }
      });
    } else if (operateStackItem.isMove) {
      let oldComponentList = operateStackItem.oldComponentList;
      let newComponentList = operateStackItem.newComponentList;
      let oldComponentIndex = operateStackItem.oldComponentIndex;
      let componentConfig = operateStackItem.componentConfig;
      newComponentList.forEach((item, index) => {
        if (item.uuid === operateStackItem.uuid) {
          newComponentList.splice(index, 1);
          operateStackItem.newComponentIndex = index;
        }
      });
      oldComponentList.splice(oldComponentIndex, 0, componentConfig);
      // console.log('xxxx', operateStackItem)
    }
    // 往重做栈中推入新纪录
    this.$globalData.operateRepealStack.push(repealStackItem);
  }
  handleRedo() {
    // 只有撤销之后，才能有重做记录
    let repealStackItem = this.$globalData.operateRepealStack.pop();
    if (!repealStackItem) return false;
    let componentIndex = repealStackItem.componentIndex;
    let componentList = repealStackItem.componentList;
    let componentConfig = repealStackItem.componentConfig;

    if (repealStackItem.isDelete) {
      // 再次执行删除操作
      componentList.splice(componentIndex, 1);
    } else if (repealStackItem.isAdd) {
      // 再次执行添加操作
      componentList.splice(componentIndex, 0, componentConfig);
    } else if (repealStackItem.isMove) {
      /**
       * 重做移动
       */
      let oldComponentList = repealStackItem.oldComponentList;
      let newComponentList = repealStackItem.newComponentList;
      let newComponentIndex = repealStackItem.newComponentIndex;
      let componentConfig = repealStackItem.componentConfig;
      oldComponentList.forEach((item, index) => {
        if (item.uuid === repealStackItem.uuid) {
          oldComponentList.splice(index, 1);
          repealStackItem.oldComponentIndex = index;
        }
      });
      newComponentList.splice(newComponentIndex, 0, componentConfig);
    }
    // 往撤销栈中推入新纪录
    this.$globalData.operateStack.push(repealStackItem);
  }
  renameReport() {}
  change() {
    this.$forceUpdate(); // 偶尔输入不了
  }
  delConfirm() {
    // this.delDialogVisible = false;

    let pageMap = this.$store.getters.pageMap;
    let pageInfo = pageMap.get(this.id);
    let tabName = "tree" + pageInfo.id;
    if (!this.chooseSubpageIndex) {
      delReportV4({
        reportId: pageInfo.id,
      }).then(() => {
        this.queryGroupComponentListService();
        this.$emit("removeTab", tabName);
      });
    } else {
      deleteSubItemService({
        subPageId: pageInfo.subpageList[this.chooseSubpageIndex - 1],
      }).then(() => {
        this.$emit("removeSubPage", pageInfo.pageIndex);
      });
    }
  }
  refreshGroupComponentList() {
    this.$emit("refreshGroupComponentList");
  }
  queryGroupComponentListService() {
    this.pageModuleList = [] as any;
    return getGroupComponentListService({
      queryType: this.projectType,
    }).then((res: any) => {
      let dataList = res.dataList;
      dataList.forEach((itemData) => {
        let componentConfigList =
          JSON.parse(itemData.configJson || "{}").list || [];
        let newGroupComponentConfig = this.componentDeepClone(
          groupComponentConfig
        ) as any;
        newGroupComponentConfig.reportName = itemData.reportName;
        let componentList = [];
        this.transformComponentConfigSimpleToFullV2(
          componentConfigList,
          componentList,
          this.componentsConfigs,
          true
        );
        newGroupComponentConfig.options.componentList = componentList;
        newGroupComponentConfig.options.groupComponentId = itemData.id;
        newGroupComponentConfig.options.groupComponentVersion =
          itemData.version;
        this.pageModuleList.push(newGroupComponentConfig);
      });
    });
  }
  dealWithDetailData(configJson) {
    this.$emit("dealWithDetailData", configJson);
  }
  showConfigJson() {
    this.configJson = JSON.stringify(this.handleConfigPageConfigJson());
    this.configDialogVisible = true;
  }
  showVersionManage(){
     this.versionManageVisible = true;
     this.scheme=JSON.stringify(this.handleConfigPageConfigJson());
     (this.$refs.versionManage as any).dialogOpen()
  }
  confirmJson() {
    this.configDialogVisible = false;
    this.$emit("dealWithDetailData", JSON.parse(this.configJson));
  }
  loadData(scheme){
    this.$emit("dealWithDetailData", JSON.parse(scheme));
  }

  componentDeepClone = componentDeepClone;
  transformComponentConfigSimpleToFullV2 =
    transformComponentConfigSimpleToFullV2;
}
</script>

<style lang="scss" scoped>
/deep/.header_left {
  flex: 0;
}
.el-main {
  display: flex;
}
/deep/.header_right {
  width: 100%;
  text-align: center;
}
</style>
