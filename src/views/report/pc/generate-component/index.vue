<template>
  <div
    class="generate-component-pc"
    :class="{ perspective: isDesignModel }"
    :style="{
      padding: `${globalConfig.topPaddingDistance || 0}px ${globalConfig.rightPaddingDistance || 0}px ${globalConfig.bottomPaddingDistance || 0}px ${globalConfig.leftPaddingDistance || 0}px`,
      backgroundColor: globalConfig.backgroundColor,
      backgroundImage: 'url(' + globalConfig.backgroundImage + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      opacity: (globalConfig.backgroundOpacity && (Math.abs(globalConfig.backgroundOpacity - 10) / 10)),
      fontSize: globalConfig.fontSize,
      height: 'inherit'
    }"
  >

    <transition-group name="fade" tag="div" class="widget-form-list">
      <template v-for="(item, key) in componentList">
        <template v-if="item.type !== 'van-design-placeholder'">
          <DynamicComponent
            :key="key"
            :component-config="item"
            :el-index="key"
          />
        </template>
        <template v-else>
          <generate-custom-components
            :key="key"
            :component-config="item"
            :el-index="key"
          />
        </template>
      </template>
    </transition-group>
    <!-- 预加载的组件 -->
    <preloadComponent
      ref="preload"
      :component-list="componentList"
      :generateComponentsUUID="generateComponentsUUID"
      :subpageList="subpageList"
      :isGenerateModel="true"
      @onChangeComponentList="onChangeComponentList"
      @onOpenDialogSubComponentList="onOpenDialogSubComponentList"
      @onCloseDialog="pageShow"
      v-if="componentList.length"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import WatchPageEvent from '@/views/report/utils/deal-component-event/watch-page-event'
import WatchPageEventV1_0_0 from '@/views/report/utils/deal-component-event/watch-page-event-v1.0.0'
import {  getLocalDataByKey, saveAndUpdateLocalData } from '@/views/report/utils/deal-data-cache/index'
import { generateUUID } from "@/views/report/utils/index";
import DynamicComponent from "./dynamic-component.vue";
import preloadComponent from "./preload-component.vue";
import componentsConfigs from "@/views/report/pc/components/configs/index";
import { transformComponentConfigSimpleToFull } from '@/views/report/utils/deal-component-data/transform-component-config'
import { ComponentDataSourceApiQuery } from '@/views/report/utils/deal-component-data-source/index'
import { transformComponentListTreeToPlan } from '@/views/report/utils/deal-component-data/transform-component-list'
export default {
  name: "GenerateComponentPc",
  components: {
    DynamicComponent,
    preloadComponent,
    // @ts-ignore
    GenerateCustomComponents: window.MakingFormComponent && window.MakingFormComponent.DynamicCustomComponent
  },
  props: {
    isDesignModel: {
      type: Boolean,
      default: false,
    },
    componentConfigList: {
      type: Array,
      default: () => [],
    },
    subpageList: {
      type: Array,
      default: []
    },
    globalConfig: {
      type: Object,
      default: {}
    },
    pageEventConfig: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      roleNameList: [],
      componentList: [],
      componentsConfigs,
      generateComponentsUUID: "",
    };
  },
  created() {
    this.initPageData();
    this.getHrefPageParams()
    this.generateComponentsUUID = generateUUID();
    this.handleSubpageList()
    if (this.componentConfigList && this.componentConfigList.length) {
        this.componentList = [];
        this.transformComponentConfigSimpleToFull(this.componentConfigList, this.componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
        //2021-1-14 在预览数据的时候 处理组件中interfaceDataConfig 接口配置 ，重新拉取数据
        // 把所有组件中 有接口配置的都取出来， 记录dataApiId,params,返回值,组件uuid 在map中
        let dataSourceApiQuery = new ComponentDataSourceApiQuery(this.componentConfigList, this.componentList, this.$pageDataModelEngine) // 集中处理页面直接的数据获取
        dataSourceApiQuery.init()
    }
      // 触发一次页面事件
    let tempArr = [];
    this.transformComponentListTreeToPlan(this.componentList, tempArr);
    let uuidComponentList = tempArr;
    let resData={
      detail:{
        data:this.pageEventConfig.eventList[0]
      }
    }
    let loadEvent = this.pageEventConfig.eventList[0]
    if(loadEvent&&loadEvent.version=='1.0.0'){
      let watchPageEventV1_0_0 = new WatchPageEventV1_0_0(this, this.componentsConfigs, this.subpageList, uuidComponentList, {}, 'PC')
      watchPageEventV1_0_0.init(resData);
    }else{
      let watchPageEvent = new WatchPageEvent(this, this.componentsConfigs, this.subpageList, uuidComponentList, {}, 'PC')
      watchPageEvent.init(resData)
    }

  },
  mounted() {
    this.pageShow();
    document.body.ondrop = function (event) {
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    pageShow(){
      // pageShow 大概率是被弹窗 关闭触发，这边如果不重新初始化页面数据引擎，会使用上一个页面的引擎，导致一些问题（比如组件刷新找不到接口）
      this.initPageData();
      this.getHrefPageParams();
      let tempArr = [];
      this.transformComponentListTreeToPlan(this.componentList, tempArr);
      let uuidComponentList = tempArr;
      let showEvent = this.pageEventConfig.eventList[1];
      let resData={
        detail:{
          data:this.pageEventConfig.eventList[1]
        }
      }
      if(showEvent&&showEvent.version=='1.0.0'){
        let watchPageEventV1_0_0 = new WatchPageEventV1_0_0(this, this.componentsConfigs, this.subpageList, uuidComponentList, {}, 'PC')
        watchPageEventV1_0_0.init(resData);
      }else{
        let watchPageEvent = new WatchPageEvent(this, this.componentsConfigs, this.subpageList, uuidComponentList, {}, 'PC')
        watchPageEvent.init(resData)
      }
    },
    getHrefPageParams(){
      let hrefPageParams = getLocalDataByKey('hrefPageParams') || {}
      for(let key in hrefPageParams) {
        // saveAndUpdateLocalData(key, hrefPageParams[key])
        this.$pageDataModelEngine.saveCustomData(key, hrefPageParams[key])
      }
    },
    initPage(){
      this.initPageData();
      this.getHrefPageParams()
      this.generateComponentsUUID = generateUUID();
      this.handleSubpageList()
      if (this.componentConfigList && this.componentConfigList.length) {

          this.componentList = [];
          this.transformComponentConfigSimpleToFull(this.componentConfigList, this.componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
          //2021-1-14 在预览数据的时候 处理组件中interfaceDataConfig 接口配置 ，重新拉取数据
          // 把所有组件中 有接口配置的都取出来， 记录dataApiId,params,返回值,组件uuid 在map中
          let dataSourceApiQuery = new ComponentDataSourceApiQuery(this.componentConfigList, this.componentList, this.$pageDataModelEngine) // 集中处理页面直接的数据获取
          dataSourceApiQuery.init()
      }

        // 触发一次页面事件
      let tempArr = [];
      this.transformComponentListTreeToPlan(this.componentList, tempArr);
      let uuidComponentList = tempArr;
      let resData={
        detail:{
          data:this.pageEventConfig.eventList[0]
        }
      }
      let loadEvent=this.pageEventConfig.eventList[0]
      if(loadEvent&&loadEvent.version=='1.0.0'){
        let watchPageEventV1_0_0 = new WatchPageEventV1_0_0(this, this.componentsConfigs, this.subpageList, uuidComponentList, {}, 'PC')
        watchPageEventV1_0_0.init(resData);
      }else{
        let watchPageEvent = new WatchPageEvent(this, this.componentsConfigs, this.subpageList, uuidComponentList, {}, 'PC')
        watchPageEvent.init(resData)
      }

       this.$refs.preload.initevent(this.generateComponentsUUID,uuidComponentList);
       //2022-01-17 由于不会再触发create 所以也不会给这个_isGenerateComponent赋值成true 所以这边处理下
      tempArr.forEach((temp:any)=>{
        temp.options._isGenerateComponent=true;
      });
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
    handleSubpageList(){
      this.subpageList.forEach(item => {
        let listTemp = item.list
        let componentList = []
        this.transformComponentConfigSimpleToFull(listTemp, componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
        // let subdataSourceApiQuery = new ComponentDataSourceApiQuery(listTemp, componentList)
        // subdataSourceApiQuery.init()
        item.list = componentList
      })
    },
    onChangeComponentList(configJson){
      this.componentConfigList = configJson.list || [];
      this.globalConfig = configJson.config || {};
      this.pageEventConfig = configJson.eventConfig || {};
      setTimeout(()=>{
        this.initPage();
      },100);
    },
 
    onOpenDialogSubComponentList(listTemp){
    //  this.subpageList.forEach((item,index) => {
    //   if(index===subPageConfigIndex){
    //     let listTemp = item.list
    //     let componentList = []
    //     this.transformComponentConfigSimpleToFull(listTemp, componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
    //     let subdataSourceApiQuery = new ComponentDataSourceApiQuery(listTemp, componentList, this.$pageDataModelEngine)
    //     subdataSourceApiQuery.init()
    //     item.list = componentList
    //   }
    //  });

      let componentList = []
      this.transformComponentConfigSimpleToFull(listTemp, componentList, this.componentsConfigs, this.roleNameList, this.generateComponentsUUID)
      let subdataSourceApiQuery = new ComponentDataSourceApiQuery(listTemp, componentList, this.$pageDataModelEngine)
      subdataSourceApiQuery.init()

        // item.list = componentList
    },
    transformComponentConfigSimpleToFull,
    transformComponentListTreeToPlan
  }
};
</script>

<style lang="scss" scoped>
.generate-component-pc .widget-form-list {
  border: 0 !important;
  margin: 0 !important;
  height: 100%;
}
.generate-component-pc {
  overflow: auto;
  min-height: 100%;
  &::-webkit-scrollbar {
    width: 0;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
