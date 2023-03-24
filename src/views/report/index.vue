<template>
  <el-container class="fm2-container">
    <reportHeader
      v-show="editType=='edit'"
      :ref="id"
      :id="id"
      :reportName="reportName"
      :projectType="projectType"
      :globalConfig="globalConfig"
      :currentGlobalConfig="globalConfig"
      :mainComponentList="mainComponentList"
      :componentList="componentList"
      :subpageList="subpageList"
      :chooseSubpageIndex="chooseSubpageIndex"
      :currentFileData="currentFileData"
      :collectionPermissionListPool="collectionPermissionListPool"
      :imgFileId="imgFileId"
      :chosenFileId="chosenFileId"
      :pageEventConfig="pageEventConfig"
      :hide-left-aside-menu="hideLeftAsideMenu"
      :hide-right-aside-menu="hideRightAsideMenu"
      @removeSubPage="removeSubPage"
      @renameFile="renameFile"
      @removeTab="removeTab"
      @dealWithDetailData="dealWithDetailData"
      @refreshGroupComponentList="queryGroupComponentListService"
      @closeLeftAsideMenu="closeLeftAsideMenu"
      @closeRightAsideMenu="closeRightAsideMenu"
      @onReloadView="onReloadDesignView"
    />
    <el-main>
      <el-container style="background-color: #f5f5f5">
        <!-- 左侧新版菜单栏 -->
        <leftAsideMenu
          v-show="editType=='edit'"
          :componentsConfigs="componentsConfigs"
          :componentList="componentList"
          :globalConfig="globalConfig"
          :deviceDesignType="projectType"
          :pageModuleList="pageModuleList"
          :hide-aside-menu="hideLeftAsideMenu"
          @updateDownCommen="updateDownCommen"
          @refreshGroupComponentList="queryGroupComponentListService"
        />
        <!-- 主体内容 -->
        <el-container
          class="main-center-container"
          direction="vertical"
          v-if="reportDataIsAlready"
        >
          <pcWidgetContainer
            ref="pcReport"
            @pcViewClick="onGoPageConfig"
            @onChangeComponentList="onChangeComponentList"
            @onChangeChooseItemIndex="onChangeChooseItemIndex"
            @onCopyReportView="onCopyReportView"
            :componentList="componentList"
            :globalConfig="currentGlobalConfig"
            :parentNodeList="fullParentNodeList"
            v-if="projectType === 'PC'"
          />
          <mobileWidgetContainer
            ref="mobileReport"
            @mobileViewClick="onGoPageConfig"
            @onChangeComponentList="onChangeComponentList"
            @onChangeChooseItemIndex="onChangeChooseItemIndex"
            @onCopyReportView="onCopyReportView"
            :componentList="componentList"
            :globalConfig="currentGlobalConfig"
            :parentNodeList="fullParentNodeList"
            v-else
          />
        </el-container>
        <el-container
          class="main-center-container"
          direction="vertical"
          v-else
        ></el-container>
        <!-- 右侧组件配置栏 -->
        <rightAsideMenu
          ref="rightAsideMenu"
          :id="id"
          :projectType="projectType"
          :globalConfig="globalConfig"
          :mainComponentList="mainComponentList"
          :componentList="componentList"
          :subpageList="subpageList"
          :newSubpageList="newSubpageList"
          :chooseSubpageIndex="chooseSubpageIndex"
          :currentDeepParentNodeList="currentDeepParentNodeList"
          :collectionPermissionListPool="collectionPermissionListPool"
          :currentWidgetComponentConfig="currentWidgetComponentConfig"
          :currentGlobalConfig="currentGlobalConfig"
          :pageEventConfig="pageEventConfig"
          :imgFileUrl="imgFileUrl"
          :chosenFileUrl="chosenFileUrl"
          :hide-aside-menu="hideRightAsideMenu"
          @onDelSubpage="onDelSubpage"
          @changeImg="changeImg"
          @onReloadView="onReloadDesignView"
        />
      </el-container>
    </el-main>
    <el-footer height="0"></el-footer>
  </el-container>
</template>

<script lang="ts">
// Hooks
import useReportShortcuts from "@/hooks/use-report-shortcuts/index.js";
// ts类型
import {
  componentConfigItemType,
  pageGlobalConfigType,
  pageConfigType,
} from "@/views/report/type";
// vue第三方依赖包
import store from "@/store";
import { mapGetters } from "vuex"; // 这里不能删除，因为下面用到store
import { Vue, Watch, Prop, Component } from "vue-property-decorator";
// tools
import { EventBus } from "@/util/event-bus.js";
import { generateUUID } from "@/views/report/utils/index.js";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import { getTagDataByTreeId } from "@/views/report/utils/deal-data-cache/index";
// import { coverBigComponent } from "@/views/report/utils/common-const.js";
import { transformComponentConfigSimpleToFullV2 } from "@/views/report/utils/deal-component-data/transform-component-config-2.0";
// 配置
import pcComponentsConfigs from "./pc/components/configs/index";
import mobileComponentsConfigs from "./mobile/components/configs/index";
import groupComponentConfig from "./mobile/components/configs/group-component/index.js"; // 这里的配置两端是一样的，所以引用了mobile的，后面要提取出来
// 组件
import subpageManage from "./subpage-manage.vue";
import pcWidgetContainer from "./pc/index.vue";
import mobileWidgetContainer from "./mobile/index.vue";
import leftAsideMenu from "./layout/left-aside-menu/index.vue";
import reportHeader from "./layout/report-header/index.vue";
import rightAsideMenu from "./layout/right-aside-menu/index.vue";
// 接口
import { getReportDetail } from "@/api/chartsData";
import { getSubItemService } from "@/api/v5";
import { getGroupComponentListService } from "@/api/report";
import { ComponentDataSourceApiQuery } from "@/views/report/utils/deal-component-data-source/index";
import {getStorage,setStorage} from "@/util/storageUtil.js";
@Component({
  components: {
    // layout
    leftAsideMenu,
    reportHeader,
    subpageManage,
    rightAsideMenu,
    // 设计区域
    pcWidgetContainer,
    mobileWidgetContainer,
  },
})
export default class Design extends Vue {
  name: "FmMakingForm";
  $refs: { mobileReport: HTMLFormElement; pcReport: HTMLFormElement };
  // Vue Compute
  get merchantList() {
    return this.$store.getters.merchantList;
  }
  // Vue Prop
  @Prop({
    type: Number,
    default: 0,
  })
  id;
  @Prop({
    type: Boolean,
    default: false,
  })
  preview;
  @Prop({
    type: Boolean,
    default: false,
  })
  generateJson;
  @Prop({
    type: Boolean,
    default: false,
  })
  generateImgUpload;
  @Prop({
    type: Object,
    default: {},
  })
  currentFileData;
  @Prop({
    type: Number,
    default: 0,
  })
  treeId;
  @Prop({
    type: String,
    default: "MOBILE",
  })
  projectType;
  @Prop({
    type: String,
    default: "edit",
  })
  editType;
  // Vue Data
  collectionPermissionListPool = {}; // 权限收集, 组件id: 组件，这种结构可以快速查找到对应的权限
  isShowPageTree = false;
  reportDataIsAlready = false;
  hideLeftAsideMenu = false;
  hideRightAsideMenu = false;
  chooseSubpageIndex = 0;
  reportName = "";
  subpageList = [] as pageConfigType[];
  newSubpageList = [] as any;
  componentsConfigs = [] as componentConfigItemType[][];
  globalConfig = {
    reportId: "",
    reportName: "",
    pullRefresh: false,
    adaptiveStatusBar: true,
    statusBarColor: "",
    backgroundColor: "",
    remark: "",
    // 布局
    topPaddingDistance: 15,
    rightPaddingDistance: 20,
    bottomPaddingDistance: 15,
    leftPaddingDistance: 20,
    // 背景图片
    backgroundImage: "",
    backgroundPosition: "",
    backgroundRepeat: "",
    backgroundSize: "",
    backgroundAttachment: "",
    hideNavigator: false,
    navigatorBGColor: "",
    navigatorColor: "",
  } as pageGlobalConfigType;
  savedComponentListString = "";
  currentGlobalConfig = {} as pageGlobalConfigType;
  chooseComponentItemConfig = {} as componentConfigItemType;
  currentWidgetComponentConfig = {} as componentConfigItemType; // 右侧配置文件的数据
  currentDeepParentNodeList = [] as componentConfigItemType[]; // 选中的组件父节点list
  fullParentNodeList = [] as componentConfigItemType[]; // 选中的组件父节点list(不限制层数）
  mainComponentList = [] as componentConfigItemType[]; // 主页面组件列表配置
  componentList = [] as componentConfigItemType[];
  pageModuleList = [] as componentConfigItemType[];
  //页面图标以及选中图标
  imgFileId = 0;
  chosenFileId = 0;
  imgFileUrl = "" as String;
  chosenFileUrl = "" as String;
  pageEventConfig = {
    eventList: [
      {
        eventType: "load",
        version: "1.0.0",
        actionList: [],
      },
      {
        eventType: "show",
        version: "1.0.0",
        actionList: [],
      },
    ],
  } as any;

  // Vue method
  created() {
    this.onLoadDesignView();
  }
  mounted() {
    // 监听切换聚焦当前组件事件
    this.addListenEvent();
  }
  beforeDestroy() {
    EventBus.$off(
      "onChangeCurrentWidgetComponentConfig",
      this.onChangeCurrentWidgetComponentConfig
    );
    EventBus.$off("onChangeTableColEvent", this.onChangeTableColEvent);
    EventBus.$off("moveOutComponentItem", this.moveOutComponentItem);
    EventBus.$off("pcEventHandler", this.pcEventHandler);
    EventBus.$off("mobileEventHandler", this.mobileEventHandler);
  }
  onLoadDesignView() {
    this.reportDataIsAlready = false;
    this.globalConfig.reportId = this.id;
    this.componentsConfigs =
      this.projectType === "PC" ? pcComponentsConfigs : mobileComponentsConfigs;
    this.queryGroupComponentListService().then(() => {
      setTimeout(() => {
        if (this.id) {
          this.queryReportDetail();
        }
      }, 0);
    });
    this.initGlobalConfigData();
    // 清空操作记录
    this.$globalData.operateStack = [];
    this.$globalData.operateRepealStack = [];
  }

  onCopyReportView(itemKey) {
    const reportId = getStorage(itemKey);
    if (!reportId) return false;

    this.reportDataIsAlready = false;
    this.queryReportDetail(reportId);
    this.initGlobalConfigData();
    // 清空操作记录
    this.$globalData.operateStack = [];
    this.$globalData.operateRepealStack = [];
  }
  // initData(){
  //   this.initGlobalConfigData()
  // }
  addListenEvent() {
    // EventBus.$off('onChangeCurrentWidgetComponentConfig');
    // EventBus.$off('onChangeTableColEvent');
    EventBus.$on(
      "onChangeCurrentWidgetComponentConfig",
      this.onChangeCurrentWidgetComponentConfig
    );
    EventBus.$on("onChangeTableColEvent", this.onChangeTableColEvent);
    EventBus.$on("moveOutComponentItem", this.moveOutComponentItem);
    EventBus.$on("pcEventHandler", this.pcEventHandler);
    EventBus.$on("mobileEventHandler", this.mobileEventHandler);

    // Ctrl+C、V 复制粘贴功能
    // useReportCtrlCv({ value: this.componentList }, { value: this.currentWidgetComponentConfig }, { value: this.componentsConfigs })
    useReportShortcuts(
      this,
      () => {
        this.$refs[this.id].onGenerateSaveJson();
      },
      () => {
        this.$refs[this.id].onHandlePreview();
      }
    );
  }

  onReloadDesignView() {
    // this.reportDataIsAlready = false
    // this.$nextTick(() => {
    //   this.reportDataIsAlready = true
    // })
    this.onLoadDesignView();
  }

  onChangeCurrentWidgetComponentConfig(data, tabsType) {
    // @ts-ignore
    this.$refs.rightAsideMenu &&
    // @ts-ignore
      this.$refs.rightAsideMenu.onClickComponent(data);
    // this.$refs.rightAsideMenu && this.$refs.rightAsideMenu.onChangeConfigTabsActive('widget'); // 切换组件时，默认跳转到基础面板
    if (tabsType) {
      // @ts-ignore
      this.$refs.rightAsideMenu &&
      // @ts-ignore
        this.$refs.rightAsideMenu.onChangeConfigTabsActive(tabsType); // 切换组件时，默认跳转到基础面板
    }
    this.currentWidgetComponentConfig = data;
    let uuid = this.currentWidgetComponentConfig.uuid;
    let deepParentNodeList = [] as any;
    let isQueryComponentNode = false;
    queryParentComponentNode(this.componentList);
    this.fullParentNodeList = Array.from(deepParentNodeList);
    let page = { name: this.reportName } as componentConfigItemType;
    this.fullParentNodeList.unshift(page);
    if (deepParentNodeList.length >= 5) {
      // 最多显示4层，超出的显示...
      deepParentNodeList = deepParentNodeList.slice(
        deepParentNodeList.length - 4,
        deepParentNodeList.length
      );
      deepParentNodeList.unshift({
        name: "...",
      });
    }
    this.currentDeepParentNodeList = deepParentNodeList;
    function queryParentComponentNode(componentList) {
      if (!componentList || !componentList.length) return false;
      componentList.forEach((item) => {
        if (isQueryComponentNode) return false;
        deepParentNodeList.push(item);
        if (uuid === item.uuid) {
          isQueryComponentNode = true;
        } else if (
          item.options &&
          item.options.columns &&
          item.options.columns.length
        ) {
          item.options.columns.forEach((columnItem) => {
            queryParentComponentNode(columnItem.componentList);
          });
          if (isQueryComponentNode) return false;
          deepParentNodeList = [];
        } else {
          // deepParentNodeList = []
          deepParentNodeList.splice(deepParentNodeList.length - 1, 1);
        }
      });
    }
  }
  onChangeTableColEvent() {
    // @ts-ignore
    this.$refs.rightAsideMenu &&
    // @ts-ignore
      this.$refs.rightAsideMenu.onChangeConfigTabsActive("event"); // 切换组件时，默认跳转到基础面板
  }
  moveOutComponentItem(index, comp) {
    //只嵌套了一层，组件-> 栅格(或列表)-> 页面
    if (this.fullParentNodeList.length === 3) {
      const container =
        this.fullParentNodeList[this.fullParentNodeList.length - 2];
      const index = this.componentList.findIndex(
        (item) => item.uuid === container.uuid
      );
      this.componentList.splice(index + 1, 0, comp);
    }
    //嵌套了多层
    else if (this.fullParentNodeList.length > 3) {
      const target =
        this.fullParentNodeList[this.fullParentNodeList.length - 3];
      if (target.options.columns) {
        target.options.columns[0].componentList.push(comp);
      }
    }
  }
  pcEventHandler(type) {
    // @ts-ignore
    this.$refs.rightAsideMenu && this.$refs.rightAsideMenu.pcEventHandler(type);
  }
  mobileEventHandler(type) {
    // @ts-ignore
    this.$refs.rightAsideMenu &&
    // @ts-ignore
      this.$refs.rightAsideMenu.mobileEventHandler(type);
  }
  //关闭侧边栏
  closeLeftAsideMenu() {
    this.hideLeftAsideMenu = !this.hideLeftAsideMenu;
  }
  closeRightAsideMenu() {
    this.hideRightAsideMenu = !this.hideRightAsideMenu;
  }

  /**
   * 组件操作相关代码
   *
   */
  onChangeChooseItemIndex(currentComponentList, index) {
    this.chooseComponentItemConfig = currentComponentList[index];
    EventBus.$emit(
      "onChangeCurrentWidgetComponentConfig",
      this.chooseComponentItemConfig
    );
  }
  onChangeComponentList(componentList) {
    // console.log(JSON.stringify(this.componentList))
    //  TODO  2021-07-21 新增一个逻辑 每次触发change 的时候 吧 数据model 里面的componentData清除 ，然后重新赋值  （可能有性能问题，以后有机会优化）
    this.$pageDataModelEngine.clearComponentData();
    componentList.forEach((item, index) => {
      if (item.type === "van-design-group-component") {
        return this.handleGroupComponentUUID(item, componentList, index);
      }
      this.$pageDataModelEngine.saveComponentData(item.uuid, item);
      if (!item.uuid) {
        let newItem = this.componentDeepClone(item);
        newItem.uuid = generateUUID();
        newItem.options.commonConfigAssignSign = newItem.uuid;
        componentList[index] = newItem;
        // 保存操作记录
        this.$globalData.operateStack.push({
          uuid: newItem.uuid,
          componentList,
          isAdd: true,
        });
      } else {
        /**
         * 更新操作记录中引用的组件容器列表
         * 如果不更新的话，会导致进行撤销重做时不能更新页面
         * 为什么会导致这个问题：因为每次组件改变时都会生成新的componentList，之前引用的就没用了
         *
         * TODO::: 待优化（每次页面中的组件改变都要遍历一下，严重影响性能）
         * 撤销功能没了，先注释
         */
        /*
        let stackItem = this.$globalData.operateStack[this.$globalData.operateStack.length - 1]
        if(item && stackItem && item.uuid === stackItem.uuid) {
          stackItem.componentList = componentList
          if (stackItem.isMove) {
            // stackItem.newComponentList = componentList
            // stackItem.oldComponentList = componentList
            if (stackItem.moveType === 'layout') {
              stackItem.newComponentList = componentList
            } else {
              stackItem.oldComponentList = componentList
              stackItem.newComponentList = componentList
            }
          }
        }
        */
        // this.$globalData.operateStack.forEach(stackItem => {})
      }
    });
    this.componentList = componentList;

    // console.log('*****onChangeComponentList****');
    // console.log('id=====', this.id)
    const configJson = this.$refs[this.id].handleConfigPageConfigJson();
    // console.log(JSON.stringify(configJson).length)
    // console.log(this.savedComponentListString.length)
    // console.log(JSON.stringify(configJson) === this.savedComponentListString)
    let changed = JSON.stringify(configJson) !== this.savedComponentListString;
    this.$emit("configJsonChanged", this.id, changed);

    this.$store.dispatch("report/setComponentList", this.componentList);
    // console.log(JSON.stringify(this.componentList).length)
    // console.log(this.savedComponentListString)
    // console.log(JSON.stringify(componentList) === this.savedComponentListString)
  }
  /**
   * 页面渲染相关代码
   *
   */
  queryReportDetail(id?) {
    //组件上传需要reportId
    setStorage("reportId", this.id);
    const data = {
      reportId: id || this.id,
    };
    getReportDetail(data)
      .then((res) => {
        let data = res.data || {};
        // 上传组件存类型
        setStorage("subType", data.subType);
        this.reportName = data.reportName;
        this.projectType = data.queryType;
        let configJson = JSON.parse(data.configJson || "{}");
        this.savedComponentListString = JSON.stringify(configJson);
        if (!configJson) {
          configJson.config.reportName = data.reportName;
        }
        // 上传组件存类型
        this.dealWithDetailData(configJson);
        this.imgFileId = data.imgFileId;
        this.imgFileUrl = data.imgFileUrl;
        this.chosenFileId = data.chosenFileId;
        this.chosenFileUrl = data.chosenFileUrl;
        this.newSubpageList = data.subPageList;
        // 这边需要 和dataprocess 一样维护 成一个数组
        let pageInfo = {
          pageIndex: "mainPage",
          id: this.id,
          subpageList: data.subPageList,
        };
        let pageMap = {
          id: this.id,
          pageInfo: pageInfo,
        };
        this.$store.dispatch("report/setPageMap", pageMap);
        // 初始化数据model 的组件
        this.componentList.forEach((item, index) => {
          this.$pageDataModelEngine.saveComponentData(item.uuid, item);
        });
      })
      .catch(() => {
        // 上传组件失败存类型
        setStorage("subType", "");
      });
  }
  initPageData() {
    // 页面接口初始化
    this.$pageDataModelEngine.clearModelDataPool();
    let interfaceDataConfig =
      this.currentGlobalConfig.interfaceDataConfig || [];
    interfaceDataConfig.forEach((item) => {
      this.$pageDataModelEngine.saveInterfaceData(item);
    });
    // 这句话不能删 不然数据模型在添加的时候 不会加载数据，导致 图表 无法渠道tableData导致无法配置
    this.$pageDataModelEngine.initInterfaceData();
    // 页面入参数据初始化
    this.pageParamsInit();
    // 组件初始化
    this.onChangeComponentList(this.componentList);
  }
  initSubPageData() {
    /**
     * 2021-10-22 这里 是为了子页面切换服务的 ，
     * 在切换完子页面以后，mobileWidgetContainer
     * 由于嵌套2层不会触发 mounted 或者create
     * 所以主动触发的一遍接口调用让所见即所得（数据回显页面）
     */
    if (this.projectType == "PC") {
      this.$refs.pcReport.initApiQuery();
    } else {
      this.$refs.mobileReport.initApiQuery();
    }
  }
  queryDetailOnHandleGlobalConfig() {
    this.globalConfig.reportId = this.id;
    this.globalConfig.statusBarColor = "";
    this.currentGlobalConfig = this.globalConfig;
    this.initPageData();
    // 兼容老配置
    if (typeof this.globalConfig.topPaddingDistance === "undefined") {
      this.initGlobalConfigData();
    }
    if (typeof this.globalConfig.backgroundImage === "undefined") {
      this.fixGlobalConfigDataByBackgroundImage();
    }
  }
  queryDetailOnHandleSubpageList(subpageList, componentConfigList) {
    let componentListTemp = [];
    this.transformComponentConfigSimpleToFullV2(
      componentConfigList,
      componentListTemp,
      this.componentsConfigs
    );
    this.componentList = componentListTemp;
    this.mainComponentList = componentListTemp;
    let subpageComponentListTemp = [];
    subpageList.forEach((subpageItem) => {
      subpageComponentListTemp = [];
      this.transformComponentConfigSimpleToFullV2(
        subpageItem.list,
        subpageComponentListTemp,
        this.componentsConfigs
      );
      subpageItem.list = subpageComponentListTemp;
    });
    this.subpageList = subpageList;
  }
  pageParamsInit() {
    // @ts-ignore
    let pageParamsList = this.globalConfig.pageParamsList || [];
    pageParamsList.forEach((item) => {
      let dataTemp = this.$pageDataModelEngine.getCustomData(
        item.operateHrefPageParamName
      );
      this.$pageDataModelEngine.saveCustomData(
        item.operateHrefPageParamName,
        dataTemp || "",
        item
      );
    });
  }
  transformComponentConfigSimpleToFullV2 =
    transformComponentConfigSimpleToFullV2;
  /**
   * 子页面操作相关代码
   *
   */
  onChangeMainPage() {
    // this.chooseSubpageIndex = 0
    // this.componentList = this.mainComponentList
    // this.currentGlobalConfig = this.globalConfig
    if (this.id) {
      this.queryReportDetail();
    }
    this.chooseSubpageIndex = 0;
  }
  onDelSubpage() {
    this.subpageList.splice(this.chooseSubpageIndex - 1, 1);
    this.onChangeMainPage();
  }
  /**
   ************************* 非核心代码 ***********************
   * 以下代码出错不影响页面渲染
   *
   */
  onGoPageConfig() {
    let nodeItem = {
      uuid: 1,
      name: this.reportName,
      componentList: [],
    };
    store.dispatch("app/changeMobileDesignComponentUUID", nodeItem.uuid);
    EventBus.$emit("onChangeCurrentWidgetComponentConfig", nodeItem);
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
        newGroupComponentConfig.options.logoUrl = itemData.logoUrl;
        this.pageModuleList.push(newGroupComponentConfig);
      });
    });
  }
  // 组件市场复合组件下载到本地
  updateDownCommen() {
    this.queryGroupComponentListService();
  }
  initGlobalConfigData() {
    if (this.projectType === "MOBILE") {
      this.$set(this.globalConfig, "topPaddingDistance", 5);
      this.$set(this.globalConfig, "rightPaddingDistance", 15);
      this.$set(this.globalConfig, "bottomPaddingDistance", 5);
      this.$set(this.globalConfig, "leftPaddingDistance", 15);
      this.$set(this.globalConfig, "backgroundColor", "#f8f8f8");
    } else {
      this.$set(this.globalConfig, "topPaddingDistance", 15);
      this.$set(this.globalConfig, "rightPaddingDistance", 20);
      this.$set(this.globalConfig, "bottomPaddingDistance", 15);
      this.$set(this.globalConfig, "leftPaddingDistance", 20);
      this.$set(this.globalConfig, "backgroundColor", "#fff");
    }
  }
  fixGlobalConfigDataByBackgroundImage() {
    // 兼容老配置添加页面背景图片属性
    this.$set(this.globalConfig, "backgroundImage", "");
    this.$set(this.globalConfig, "backgroundPosition", "");
    this.$set(this.globalConfig, "backgroundRepeat", "");
    this.$set(this.globalConfig, "backgroundSize", "");
    this.$set(this.globalConfig, "backgroundAttachment", "");
  }
  // 处理复合组件
  handleGroupComponentUUID(itemTemp, mainComponentList, mainIndex) {
    if (itemTemp.uuid) return false;
    let groupComponentItem = this.componentDeepClone(itemTemp);
    let componentList = [];
    groupComponentItem.uuid = generateUUID();
    groupComponentItem.options.commonConfigAssignSign = groupComponentItem.uuid;
    let componentConfigList = groupComponentItem.options.componentList;
    this.transformComponentConfigSimpleToFullV2(
      componentConfigList,
      componentList,
      this.componentsConfigs,
      true
    );
    groupComponentItem.options.componentList = componentList;
    mainComponentList[mainIndex] = groupComponentItem;
  }
  renameFile(treeId, reportName) {
    this.$emit("renameFile", treeId, reportName);
  }
  removeTab(tabName) {
    this.$emit("removeTab", tabName);
  }
  dealWithDetailData(configJson) {
    let treeData = getTagDataByTreeId(this.treeId);
    if (treeData != "") {
      configJson = treeData;
      // this.dealWithDetailData(treeData);
    }
    // 上传组件存类型
    let componentConfigList = configJson.list || [];
    let subpageList = configJson.subpageList || [];
    this.globalConfig = configJson.config || {};
    this.queryDetailOnHandleGlobalConfig();
    this.queryDetailOnHandleSubpageList(subpageList, componentConfigList);
    this.reportDataIsAlready = true;
    this.pageEventConfig = configJson.eventConfig;
    if (typeof this.pageEventConfig == "undefined") {
      this.pageEventConfig = {
        eventList: [
          {
            eventType: "load",
            version: "1.0.0",
            actionList: [],
          },
          {
            eventType: "show",
            version: "1.0.0",
            actionList: [],
          },
        ],
      };
    }
    // 2021-04-14 初始化变量从configJson 中获取localData  {key:xxx,value:xxx,dataType:xxx}
    // removeLocalData();
    // configJson.localData&&configJson.localData.forEach(dataItem=>{
    //   // saveAndUpdateLocalData(dataItem.key,dataItem.value)
    //   this.$pageDataModelEngine.saveComponentData(dataItem.key, dataItem.value)
    // });
    // 页面入参数据初始化
    // this.pageParamsInit()
  }
  changeImg(type, value, fileId) {
    //2021-06-24 记录report-config-special 回传的 图标以及选中图标
    if (type == "icon") {
      this.imgFileId = fileId;
    } else if (type == "chosenIcon") {
      this.chosenFileId = fileId;
    }
  }

  onSaveOldPage() {
    this.$refs[this.id].onGenerateSaveJson();
  }
  onChangeNewSubpage(subItem, subPageIndex) {
    const data = {
      subPageId: subItem,
    };
    getSubItemService(data).then((res) => {
      let data = res.data || {};
      // 上传组件存类型
      setStorage("subType", data.subType);
      this.reportName = data.reportName;
      let configJson = JSON.parse(data.configJson || "{}");
      // 上传组件存类型
      this.dealWithDetailData(configJson);
      this.globalConfig.reportId = data.id;
      this.globalConfig.reportName = data.reportName;
      // 初始化数据model 的组件
      console.log(
        "------------初始化数据model 的组件getSubItemService",
        this.componentList
      );
      this.componentList.forEach((item, index) => {
        this.$pageDataModelEngine.saveComponentData(item.uuid, item);
      });
      this.chooseSubpageIndex = subPageIndex;
    });
  }
  onAddNewSubpage(data) {
    let pageMap = this.$store.getters.pageMap;
    let pageInfo = pageMap.get(this.id);

    this.newSubpageList.push(data);
    pageInfo.subpageList = this.newSubpageList;
    this.$store.dispatch("report/setPageMap", pageMap);
  }
  removeSubPage(subPageIndex) {
    this.newSubpageList.splice(subPageIndex, 1);
    this.queryReportDetail();
  }
  componentDeepClone = componentDeepClone;
}
</script>

<style lang="scss" scoped>
.fm2-container .main-center-container {
  // display: block;
  padding: 16px;
  background-color: #f5f5f5;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
}
.pages-select-btn-wrap {
  position: fixed;
  left: 5px;
  top: 470px; //530
  border-radius: 10px;
  background-color: #fff;
  width: 50px;
  padding-bottom: 10px;
  text-align: center;
  padding-top: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
  li {
    display: inline-block;
    padding: 2px;
    width: 50px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    font-size: 12px;
    cursor: pointer;
    &.active {
      background-color: rgba(0, 125, 250, 0.2);
      color: rgba(0, 125, 250, 1);
    }
  }
  li:nth-last-child(1) i {
    padding: 5px 10px;
    border-top: 1px solid #d5d5d5;
  }
}
.widget-config-container {
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
  }
  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: #fff;
  }
  .component-name-tip {
    height: 42px;
    position: fixed;
    padding: 0px 10px 10px;
    line-height: 48px;
    background: #fff;
    z-index: 99;
    width: 100%;
    border-bottom: 1px solid #ebeef5;
    .component-point {
      cursor: pointer;
    }
  }
  /deep/.widget-config-tabs > .el-tabs__header {
    // margin: 0;
    margin-top: 50px;
    position: fixed;
    top: 90px;
    z-index: 20;
    width: 300px;
    background: #fff;
  }
  /deep/.widget-config-tabs-style > .el-tabs__header {
    margin-top: -12px;
  }
  /deep/.widget-config-tabs-style > .el-tabs__content {
    margin-top: 90px;
  }
  /deep/.el-tabs__content {
    overflow-y: auto;
    height: calc(100vh - 190px);
    margin-top: 90px;
    padding: 0px 10px 10px;
    // min-height: 550px;
  }
  /deep/.el-tabs__content::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
  }
  /deep/.m-colorPicker .box {
    left: -120px;
  }
}
</style>
