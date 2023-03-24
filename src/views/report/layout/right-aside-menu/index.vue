<template>
  <div v-if="!hideAsideMenu" class="widget-config-container">
    <el-aside style="width: 315px; background-color: white">
      <div class="component-name-tip">
        <i :class="['iconfont',currentWidgetComponentConfig.icon]" style="vertical-align: bottom; margin-right: 5px;"></i>
        <span class="component-point" v-if="!currentDeepParentNodeList.length" @click="onGoComponentConfig(currentWidgetComponentConfig)"> {{ currentWidgetComponentConfig.name }} </span>
        <span v-else @click="onGoComponentConfig(item)" v-for="(item, key) in currentDeepParentNodeList" :key="key">
        <span class="component-point">{{ item.name }}</span>
        <span v-if="key < currentDeepParentNodeList.length - 1">
          >
        </span>
      </span>
        <!-- 页面结构icon -->
        <i class="iconfont icontree" style="cursor: pointer; position: fixed; right: 15px;" @click="isShowPageTree = !isShowPageTree" title="页面结构"></i>
      </div>
      <pageTree ref="pageTree" v-if="isShowPageTree" :componentList="componentList" @onChangeNode="isShowPageTree = false" style="padding-top: 50px;" />
      <el-tabs
        v-else
        v-model="configTabsActive"
        stretch
        :class="['widget-config-tabs', componentList.length > 0 ? '' : 'widget-config-tabs-style']"
      >
        <el-tab-pane label="基础" name="widget">
          <!-- 页面配置 页面uuid为1, -->
          <widgetPageConfig
            :globalConfig="globalConfig"
            :isSubpage="!!chooseSubpageIndex"
            :chooseSubpageIndex="chooseSubpageIndex"
            :subpageList="subpageList"
            :imgFileUrl="imgFileUrl"
            :chosenFileUrl="chosenFileUrl"
            :deviceDesignType="projectType"
            @onDelSubpage="onDelSubpage"
            @changeImg="changeImg"
            v-if="currentWidgetComponentConfig.uuid === 1&&!isShowNewEventFlowChart"
          />
          <widgetSpecialConfig
            :globalConfig="globalConfig"
            :specialConfig="currentWidgetComponentConfig"
            :deviceDesignType="projectType"
            v-else-if="currentWidgetComponentConfig._isSpecialConfig&&!isShowNewEventFlowChart"
          />
          <!-- 组件配置 -->
          <widget-config
            :componentConfig="currentWidgetComponentConfig"
            :componentList="componentList"
            :subpageList="subpageList"
            :deviceDesignType="projectType"
            :collectionPermissionListPool="collectionPermissionListPool"
            v-else-if="!isShowNewEventFlowChart"
          />
          <widgetEventConfig
            v-if="
            currentWidgetComponentConfig.uuid &&
            currentWidgetComponentConfig.options &&
            currentWidgetComponentConfig.options.eventConfig
          "
            ref="eventWidget"
            :componentList="componentList"
            :componentConfig="currentWidgetComponentConfig"
            :subpageList="subpageList"
            :newSubpageList="newSubpageList"
            :deviceDesignType="projectType"
            @eventShow="eventShow"
          />
          <widgetEventConfig
            v-else-if="
            currentWidgetComponentConfig.uuid==1
          "
            ref="widgetEventConfig"
            :componentList="componentList"
            :componentConfig="currentWidgetComponentConfig"
            :pageEventConfig="pageEventConfig"
            :subpageList="subpageList"
            :newSubpageList="newSubpageList"
            :deviceDesignType="projectType"
            @eventShow="eventShow"
          />
          <widgetDataModelConfig 
            v-if="
              currentWidgetComponentConfig.uuid==1
            "
            v-has="'report:showConfig'"
            ref="widgetDataModelConfig"
            :id="id"
            :componentList="componentList"
            :componentConfig="currentWidgetComponentConfig"
            :pageEventConfig="pageEventConfig"
            :subpageList="subpageList"
            :newSubpageList="newSubpageList"
            :deviceDesignType="projectType"
            @eventShow="eventShow"
            @onReloadView="onReloadView"
          />

        </el-tab-pane>
        <el-tab-pane label="数据" name="data">
          <widgetDataConfig
            v-if="
            currentWidgetComponentConfig.uuid &&
            currentWidgetComponentConfig.options
          "
            :deviceDesignType="projectType"
            :componentList="componentList"
            :componentConfig="currentWidgetComponentConfig"
          />
          <!-- 页面特殊处理 -->
          <dataSourceApiConfigNew
            :choose-subpage-index="chooseSubpageIndex"
            v-if="currentWidgetComponentConfig.uuid==1"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="行为" name="event" >
          <widgetEventConfig
            v-if="
              currentWidgetComponentConfig.uuid &&
              currentWidgetComponentConfig.options &&
              currentWidgetComponentConfig.options.eventConfig
            "
            :componentList="componentList"
            :componentConfig="currentWidgetComponentConfig"
            :subpageList="subpageList"
            :newSubpageList="newSubpageList"
            :deviceDesignType="projectType"
          />
          <widgetEventConfig
            v-else-if="
              currentWidgetComponentConfig.uuid==1
            "
            :componentList="componentList"
            :componentConfig="currentWidgetComponentConfig"
            :pageEventConfig="pageEventConfig"
            :subpageList="subpageList"
            :newSubpageList="newSubpageList"
            :deviceDesignType="projectType"
          />
        </el-tab-pane> -->
      </el-tabs>
    </el-aside>
  </div>

</template>

<script lang="ts">
import { Vue,  Prop, Component } from "vue-property-decorator";
import store from '@/store'
import { EventBus } from "@/util/event-bus.js";
// 组件
import pageTree from '../left-aside-menu/page-tree.vue'
import widgetConfig from "../report-config-basics/index.vue";
import widgetPageConfig from "../report-config-special/index.vue";
import widgetSpecialConfig from "../report-config-special/special-config/index.vue";
import widgetEventConfig from "../report-config-event/index.vue";
import widgetDataModelConfig from "../report-config-data-model/index.vue";
import widgetDataConfig from "../report-config-data/index.vue";
import dataSourceApiConfigNew from "../report-config-data/data-config-new/data-source-api-config-new.vue";

@Component({
  components: {
    pageTree,
    widgetConfig,
    widgetPageConfig,
    widgetSpecialConfig,
    widgetEventConfig,
    widgetDataConfig,
    dataSourceApiConfigNew,// 这个是页面配置的特殊处理
    widgetDataModelConfig,
  },
})
export default class DesignHeader extends Vue {
  name: "DesignComponentConfigPanel";
  // Vue Compute
  get merchantList() {
    return this.$store.getters.merchantList;
  }
  @Prop({
    type: Number,
    default: 0,
  })
  id;
  // prop
  @Prop({
    type: String,
    default: "",
  })
  projectType;
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
    type: Object,
    default: () => {
      return {};
    },
  })
  currentWidgetComponentConfig
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  subpageList
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  newSubpageList
  @Prop({
    type: Array,
    default: () => {
      return [];
    },
  })
  currentDeepParentNodeList
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  collectionPermissionListPool
  @Prop({
    type: Number,
    default: 0
  })
  chooseSubpageIndex
   @Prop({
    type: String,
    default: "",
  })
  imgFileUrl;
   @Prop({
    type: String,
    default: "",
  })
  chosenFileUrl;
  @Prop({
    type: Object,
    default: () => {
      return {
         eventList:[
          {
            eventType:'load',
            actionList:[]
          },
          {
            eventType:'show',
            actionList:[]
          }
        ]
      };
    },
  })
  pageEventConfig;

  @Prop({
    type: Boolean,
    default: false,
  })
  hideAsideMenu;

  // data
  isShowPageTree = false;
  configTabsActive = "widget";
  isShowNewEventFlowChart=false;
  created() {
  }

  onGoComponentConfig(nodeItem){

    if (!nodeItem.uuid) return false
    store.dispatch('app/changeMobileDesignComponentUUID', nodeItem.uuid)
    EventBus.$emit('onChangeCurrentWidgetComponentConfig', nodeItem)
  }

  onDelSubpage(){
    this.$emit('onDelSubpage')
  }
  changeImg(type,value,fileId){
    this.$emit('changeImg',type,value,fileId)
  }

  onChangeConfigTabsActive(value){
    this.configTabsActive = value
  }

  onClickComponent(data) {
    // @ts-ignore
    this.$refs.pageTree && this.$refs.pageTree.onClickComponent(data)
  }

  eventShow(isShowNewEventFlowChart){
    this.isShowNewEventFlowChart=isShowNewEventFlowChart
  }
  onReloadView(){
    this.$emit("onReloadView");
  }
  pcEventHandler(type) {
    console.log('pcEventHandler', type);
    // @ts-ignore
    this.$refs.eventWidget && this.$refs.eventWidget.eventClick(type)
  }
  mobileEventHandler(type) {
    console.log('mobileEventHandler', type);
    // @ts-ignore
    this.$refs.eventWidget && this.$refs.eventWidget.eventClick(type)
  }
}
</script>

<style lang="scss" scoped>
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
  .component-name-tip{
    height: 42px;
    position: fixed;
    padding: 0px 10px 10px;
    line-height: 48px;
    background: #fff;
    z-index: 99;
    width: 100%;
    border-bottom: 1px solid #EBEEF5;
    .component-point {
      cursor: pointer;
    }
  }
  /deep/.widget-config-tabs > .el-tabs__header {
    // margin: 0;
    margin-top:40px;
    position: fixed;
    top: 50px;
    z-index: 20;
    width: 300px;
    background: #fff;
  }
  /deep/.widget-config-tabs-style > .el-tabs__header{
     margin-top:0;
  }
  /deep/.widget-config-tabs-style > .el-tabs__content{
       margin-top: 50px;
  }
  /deep/.el-tabs__content {
    overflow: initial;
    margin-top: 90px;
    padding: 0px 10px 10px;
    // min-height: 550px;
  }
  /deep/.m-colorPicker .box {
    left: -140px;
  }
}

</style>

