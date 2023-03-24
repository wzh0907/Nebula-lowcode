<template>
  <div>
    <!-- 弹窗组件 1、对话框  2、抽屉 -->
    <a-modal
      v-model="isShowPopupDialog"
      :title="popupConfig.title"
      :width="popupConfig.widthHeightConfig.width || 260"
      :height="popupConfig.widthHeightConfig.height || 260"
      :closable="true"
      :maskClosable="true"
      :footer="dialogFooterContainer ? undefined : null"
      @cancel="afterClose"
    >
      <div style="overflow-x: hidden; overflow-y: scroll" :style="popupHeight">
        <div v-for="(item, key) in popupSubPageConfigList" :key="key">
          <DynamicComponent :componentConfig="item" :key="key" :elIndex="key" />
        </div>
      </div>

      <!-- 自定义弹窗页脚 -->
      <template slot="footer" v-if="dialogFooterContainer">
        <div style="overflow: hidden;">
          <DynamicComponent :componentConfig="dialogFooterContainer" />
        </div>
      </template>
    </a-modal>
    <a-drawer
      :visible="isShowPopupDrawer"
      :width="popupConfig.widthHeightConfig.width || 260"
      :height="popupConfig.widthHeightConfig.height || 260"
      :placement="popupConfig.position || 'bottom'"
      :closable="true"
      :maskClosable="true"
      @close="afterClose"
    >
      <div style="overflow: scroll" :style="drawerSize">
        <div v-for="(item, key) in popupSubPageConfigList" :key="key">
          <DynamicComponent :componentConfig="item" :key="key" :elIndex="key" />
        </div>
      </div>

      <!-- 自定义弹窗页脚 -->
      <template slot="footer" v-if="dialogFooterContainer">
        <div style="overflow: hidden;">
          <DynamicComponent :componentConfig="dialogFooterContainer" />
        </div>
      </template>
      <!-- <div style="text-align: center; padding: 10px 0px">
        <van-button
          type="default"
          size="small"
          @click="isShowPopupDrawer = false"
          >取 消</van-button
        >
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          type="default"
          size="small"
          @click="isShowPopupDrawer = false"
          >确 定</van-button
        >
      </div> -->
    </a-drawer>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import WatchPageEvent from '@/views/report/utils/deal-component-event/watch-page-event'
import WatchPageEventV1_0_0 from '@/views/report/utils/deal-component-event/watch-page-event-v1.0.0'
import pcComponentsConfigs from "../components/configs/index";
import { transformComponentListTreeToPlan } from '@/views/report/utils/deal-component-data/transform-component-list'
import DynamicComponent from "./dynamic-component.vue";
import { dataSaveV4Service } from "@/api/database";
import { generateUUID } from "@/views/report/utils/index";
import { transformComponentConfigSimpleToFull } from '@/views/report/utils/deal-component-data/transform-component-config'
import { ComponentDataSourceApiQuery } from '@/views/report/utils/deal-component-data-source/index'
export default {
  name: "generate-preload-component",
  props: [
    "isGenerateModel",
    "componentList",
    "subpageList",
    "generateComponentsUUID",
  ],
  components: {
    DynamicComponent,
  },
  data() {
    return {
      preloadEventUUID: "",
      calendarType: "single",
      isShowVantCalendar: false,
      isShowVantDatetimePicker: false,
      isShowPopupDrawer: false,
      isShowPopupDialog: false,
      datetimePickerMinDate: new Date(1970, 0, 1),
      datetimePickerMaxDate: new Date(3000, 10, 1),
      minDate: new Date(new Date().getFullYear() - 1, 0, 1),
      uuidComponentList: [],
      popupSubPageConfigList: [],
      popupUuidComponentList:[],
      componentsConfigs : [] ,
      popupConfig: {
        title: "",
        position: "",
        widthHeightConfig: {
          width: "",
          height: "",
        },
      },
      globalConfig:{},
      pageEventConfig:{},
      // 自定义弹窗页脚
      dialogFooterContainer: null
    };
  },
  computed: {
    popupHeight() {
      let totalHeight = this.popupConfig.widthHeightConfig.height + 'vh'
      let headHeight = 103 + 'px'
      return `height: calc(${totalHeight} - ${headHeight})`
    },
    drawerSize() {
      //如果不手动设置尺寸,会导致页面渲染不出来
      let totalWidth = (this.popupConfig.widthHeightConfig.width).replace('%', '') + 'vw'
      let padding = 48 + 'px'  //drawer的padding
      return `width: calc(${totalWidth} - ${padding});)`
    }
  },
  created() {
    window.addEventListener("on-preload-change-calendar", (res: any) => {
      let value = res.detail.value;
      this.preloadEventUUID = res.detail.preloadEventUUID;
      this.isShowVantCalendar = value;
    });
    window.addEventListener("on-preload-change-calendar-type", (res: any) => {
      let value = res.detail.value;
      this.preloadEventUUID = res.detail.preloadEventUUID;
      this.calendarType = value;
    });
    window.addEventListener("on-preload-change-datetime-picker", (res: any) => {
      let value = res.detail.value;
      this.preloadEventUUID = res.detail.preloadEventUUID;
      this.isShowVantDatetimePicker = value;
    });
    if (this.isGenerateModel) {
      this.onHandleAllEvent();
    }
    // 获取组件uuid: obj列表
    let tempArr = [];
    this.transformComponentListTreeToPlan(this.componentList, tempArr);
    this.uuidComponentList = tempArr;
    this.componentsConfigs = pcComponentsConfigs;
  },
  mounted() {
  },
  beforeDestroy() {
    this.onRemoveAllEvent();
  },
  methods: {
    afterClose(){
      this.isShowPopupDialog = false
      this.isShowPopupDrawer = false
      this.$emit("onCloseDialog")
    },
    onCalendarConfirm(date) {
      this.isShowVantCalendar = false;
      let operateEventNameA = new CustomEvent(
        `${this.preloadEventUUID}-on-preload-change-calendar-get-response-data`,
        { detail: { value: date } }
      );
      window.dispatchEvent(operateEventNameA);
    },
    onDatetimePickerConfirm(date) {
      this.isShowVantDatetimePicker = false;
      let operateEventNameA = new CustomEvent(
        `${this.preloadEventUUID}-on-preload-change-datetime-picker-get-response-data`,
        { detail: { value: date } }
      );
      window.dispatchEvent(operateEventNameA);
    },
    onDatetimePickerCancel() {
      this.isShowVantDatetimePicker = false;
    },
    onOpenDialogSubComponentList(componentConfigList,hrefPageParams){
      this.initPageData();
      hrefPageParams.forEach(hrefPageParamItem => {
        let operateHrefPageParamName = hrefPageParamItem.operateHrefPageParamName || ''
        let operateHrefPageParamValue = hrefPageParamItem.operateHrefPageParamValue || ''
        this.$pageDataModelEngine.saveCustomData(operateHrefPageParamName, operateHrefPageParamValue)
      })
      // this.$pageDataModelEngine.initInterfaceData()
      let guuid = generateUUID();
      this.componentList = []

      if (componentConfigList && componentConfigList.length) {
        this.transformComponentConfigSimpleToFull(componentConfigList, this.componentList, this.componentsConfigs, this.roleNameList,guuid,false)
        let subdataSourceApiQuery = new ComponentDataSourceApiQuery(componentConfigList, this.componentList, this.$pageDataModelEngine)
        subdataSourceApiQuery.init()
        this.popupSubPageConfigList=this.componentList;
        //单独注册下 弹窗的事件
        window.addEventListener(
          `${guuid}-on-preload-handle-btn-confirm`,
          this.handleEventFunc
        );
      }
      // 触发一次页面事件
      let tempArr = [];
      this.popupUuidComponentList=[]
      this.transformComponentListTreeToPlan(this.componentList, tempArr);
      this.popupUuidComponentList = tempArr;
      let loadEvent = this.pageEventConfig.eventList[0]
      let resData={
          detail:{
            data:this.pageEventConfig.eventList[0]
          }
        }
      if(loadEvent&&loadEvent.version=='1.0.0'){
        let watchPageEventV1_0_0 = new WatchPageEventV1_0_0(this, this.componentsConfigs, this.subpageList, this.popupUuidComponentList, {}, 'PC')
        watchPageEventV1_0_0.init(resData);
      }else{
        let watchPageEvent = new WatchPageEvent(this, this.componentsConfigs, this.subpageList, this.popupUuidComponentList, {}, 'PC')
        watchPageEvent.init(resData)
      }
       //2022-01-17 由于不会再触发create 所以也不会给这个_isGenerateComponent赋值成true 所以这边处理下
      tempArr.forEach((temp:any)=>{
        temp.options._isGenerateComponent=true;
      });

      /************************************ 自定义弹窗页脚 ***************************************/
      let dialogFooterContainerIndex = -1
      this.popupSubPageConfigList.forEach((componentConfigItem, componentConfigIndex) => {
        if (componentConfigItem.type === 'van-design-layout' && componentConfigItem.options.isDialogFooterContainer) {
          dialogFooterContainerIndex = componentConfigIndex
          this.dialogFooterContainer = componentConfigItem
        }
      })
      console.log('dialogFooterContainerIndex===', dialogFooterContainerIndex);
      dialogFooterContainerIndex >= 0 && this.popupSubPageConfigList.splice(dialogFooterContainerIndex, 1)
      // console.log('--xx-----xx-----xx--->', this.dialogFooterContainer)
    },
    initPageData(){
      // 页面接口初始化
      this.$pageDataModelEngine.clearModelDataPool()
      let interfaceDataConfig = this.globalConfig.interfaceDataConfig || []
      interfaceDataConfig.forEach(item => {
        this.$pageDataModelEngine.saveInterfaceData(item)
      })
      // this.$pageDataModelEngine.initInterfaceData()
    },
    initevent(generateComponentsUUID,uuidComponentList){
      this.onRemoveAllEvent();
      this.generateComponentsUUID=generateComponentsUUID;
      this.uuidComponentList = uuidComponentList;

      this.onHandleAllEvent();
    },
    // 监听所有操作类型的事件
    onHandleAllEvent() {
      window.addEventListener(
        `${this.generateComponentsUUID}-on-preload-handle-btn-confirm`,
        this.handleEventFunc
      );
      window.addEventListener(
        `${this.generateComponentsUUID}-on-preload-handle-form-confirm`,
        this.handleFormConfirmEventFunc
      );

      window.addEventListener(
        `${this.generateComponentsUUID}-on-preload-handle-btn-charts`,
        this.handleChartsEventFunc
      );
    },
    handleChartsEventFunc(data) {
    },
    handleFormConfirmEventFunc(resData) {
      let eventDataPackage = resData.detail.data;
      dataSaveV4Service(eventDataPackage).then((res) => {});
    },
    handleEventFunc(resData){
      let uuidComponentList = [];
      if(this.isShowPopupDialog||this.isShowPopupDrawer){
        uuidComponentList= this.popupUuidComponentList
      }else{
        uuidComponentList = this.uuidComponentList
      }
      //
      if(resData.detail.version&&resData.detail.version=='1.0.0'){
        let watchPageEventV1_0_0 = new WatchPageEventV1_0_0(this, this.componentsConfigs, this.subpageList, uuidComponentList, this.popupConfig, 'PC')
        watchPageEventV1_0_0.init(resData)
      }else{
        let watchPageEvent = new WatchPageEvent(this, this.componentsConfigs, this.subpageList, uuidComponentList, this.popupConfig, 'PC')
        watchPageEvent.init(resData)
      }
    },
    transformComponentConfigSimpleToFull,
    transformComponentListTreeToPlan,
    // 移除所有事件
    onRemoveAllEvent() {
      window.removeEventListener(
        `${this.generateComponentsUUID}-on-preload-handle-btn-confirm`,
        this.handleEventFunc
      );
      window.removeEventListener(
        `${this.generateComponentsUUID}-on-preload-handle-form-confirm`,
        this.handleFormConfirmEventFunc
      );
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.ant-modal-title {
  min-height: 22px;
}
</style>
