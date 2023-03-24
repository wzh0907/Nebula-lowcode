<template>
  <div style="padding-top: 5px">
    <span style="font-size:13px;color:#303133;font-weight:500">事件行为</span>
    <div style="text-align: center">
      <!-- <el-button size="small" @click="isShowNewEventFlowChart = !isShowNewEventFlowChart" style="margin-bottom: 10px;" v-if="!isShowNewEventFlowChart">显示事件流程图</el-button> -->
      <div
        class="event-div"
        @click="eventClick('click')"
        v-if="!isShowNewEventFlowChart && componentConfig.uuid != 1"
      >
        <i class="event-icon iconfont icondianji" />
        点击事件
      </div>
      <div
        class="event-div"
        @click="eventClick('change')"
        v-if="!isShowNewEventFlowChart && componentConfig.uuid != 1"
      >
        <i class="event-icon iconfont iconbiangengguanli" />
        值变化事件
      </div>
      <div
        class="event-div"
        @click="eventClick('load')"
        v-if="!isShowNewEventFlowChart && componentConfig.uuid == 1"
      >
        <i class="event-icon iconfont iconbiangengguanli" />
        页面加载
      </div>
      <div
        class="event-div"
        @click="eventClick('show')"
        v-if="!isShowNewEventFlowChart && componentConfig.uuid == 1"
      >
        <i class="event-icon iconfont iconbiangengguanli" />
        页面重载
      </div>
    </div>
    <eventConfigNew
      v-if="eventItem.version == '1.0.0'"
      ref="eventConfigNew"
      :dialog-visible.sync="dialogEventVisible"
      :deviceDesignType="deviceDesignType"
      :eventList="newEventList"
      title="事件行为配置"
      :componentList="componentList"
      :refreshComponentList="refreshComponentList"
      :dialogBoxComponentList="dialogBoxComponentList"
      :linearComponentList="linearComponentList"
      @eventSave="eventSave"
    />
    <div class="new-event-demo-wrap" v-else-if="isShowNewEventFlowChart">
      <div class="new-event-demo">
        <eventFlowChart
          ref="eventFlowChart"
          @foldUp="onSaveFlowChartData"
          @onClickNode="onClickFlowChartNode"
          @onClickLine="onClickFlowChartLine"
          :eventList="eventList"
          :chooseEventType="chooseEventType"
        />
      </div>
    </div>
    <el-form size="small" v-if="isShowNewEventFlowChart && isReloadEventConfig">
      <el-form-item
        :label="actionTypeMap[selectedActionNodeData.actionType]"
      ></el-form-item>
      <eventActionView
        :actionItem="selectedActionNodeData"
        :deviceDesignType="deviceDesignType"
        :refreshComponentList="refreshComponentList"
        :dialogBoxComponentList="dialogBoxComponentList"
        :linearComponentList="linearComponentList"
        :interfaceApiAll="interfaceApiAll"
        :componentUUIDList="componentUUIDList"
        :hrefPageList="hrefPageList"
        :subpageList="subpageList"
        :newSubpageList="newSubpageList"
        @onSaveLineConfig="onSaveLineConfig"
      />
    </el-form>
  </div>
</template>

<script>
import { pickInputComponentList } from "@/views/report/utils/deal-component-data/transform-component-list";
import {
  coverBigComponent,
  dataRefreshComponents,
} from "@/views/report/utils/common-const";

import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import eventActionView from "./action-modules/event-item.vue";
import eventFlowChart from "./flow-chart-event-config/event-flow-chart.vue";
import eventConfigNew from "./event-config-new/index.vue";
import { EventBus } from "@/util/event-bus.js";
export default {
  components: {
    eventActionView,
    eventFlowChart,
    eventConfigNew,
  },
  props: {
    deviceDesignType: {
      type: String,
      default: "MOBILE",
    },
    componentList: {
      type: Array,
      default: [],
    },
    componentConfig: {
      type: Object,
      default: {},
    },
    subpageList: {
      type: Array,
      default: [],
    },
    newSubpageList: {
      type: Array,
      default: [],
    },
    pageEventConfig: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isReloadEventConfig: true,
      selectedActionNodeData: {
        actionType: "",
        operateEventType: "event-operate-refresh",
        operateRefresh: [],
        operateHrefPageId: "",
        operateHrefPageNative: "",
        operateDialog: "",
        operateApiId: "",
        operateDisplay: [],
        operatePrintComponentId: '', // 需要打印的组件id
        interfaceDataConfig: {
          paramsConfigs: [],
          operateApiId: 0,
        },
      },
      isShowNewEventFlowChart: false,
      chooseEventType: "click",
      version: "",
      eventItem: {
        eventType: "",
        version: "",
        actionList: [],
      },
      eventTypeConfigMap: {
        click: {
          label: "点击",
          icon: "",
        },
        change: {
          label: "值变化",
          icon: "",
        },
      },
      dialogEventVisible: false,
      eventConfigList: [],
      actionTypeList: [
        {
          label: "数据刷新",
          value: "event-operate-refresh",
        },
        {
          label: "接口调用",
          value: "event-operate-interface",
        },
        {
          label: "隐藏/显示",
          value: "event-operate-display",
        },
        {
          label: "页面跳转",
          value: "event-operate-href",
        },
        {
          label: "页面返回",
          value: "event-operate-back",
        },
        {
          label: "页面跳转（本页面）",
          value: "event-operate-href-reload",
        },
        {
          label: "页面跳转（子页面）",
          value: "event-operate-href-subpage",
        },
        {
          label: "页面跳转（Native）",
          value: "event-operate-href-native",
        },
        {
          label: "表单提交",
          value: "event-operate-form-submit",
        },
        {
          label: "弹出层",
          value: "event-operate-dialog-box",
        },
        {
          label: "关闭弹窗",
          value: "event-operate-close-dialog",
        },
        {
          label: "逻辑判断",
          value: "event-operate-logic-judgment",
        },
        {
          label: "关闭传值",
          value: "event-operate-close-page",
        },
      ],
      actionTypeMap: {
        "event-operate-refresh": "数据刷新",
        "event-operate-interface": "接口调用",
        "event-operate-display": "隐藏/显示",
        "event-operate-href": "页面跳转",
        "event-operate-back": "页面返回",
        "event-operate-href-reload": "页面跳转（本页面）",
        "event-operate-href-subpage": "页面跳转（子页面）",
        "event-operate-href-native": "页面跳转（Native）",
        "event-operate-form-submit": "表单提交",
        "event-operate-dialog-box": "弹出层",
        "event-operate-close-dialog": "关闭弹窗",
        "event-operate-logic-judgment": "逻辑判断",
        "event-operate-close-page": "关闭传值",
      },
      eventActiveNames: "",
      interfaceApiAll: [], // 接口数据列表
      interfaceDataConfig: {},
      componentUUIDList: [],
      formType: "",
      formKey: "",
      refreshComponentList: [],
      linearComponentList: [],
      dialogBoxComponentList: [],
      hrefPageList: [],
      newEventList: [], // 1.0.0 的actionList
    };
  },
  /**
   * TODO::: 待优化  注释watch可能会有问题
   */
  watch: {
    componentList: {
      handler(val) {
        this.initData();
      },
    },
    componentConfig: {
      handler(val) {
        this.initData();
      },
    },
  },
  created() {
    this.handlerOldConfig();
    this.initData();
  },
  beforeDestroy(){
    EventBus.$off("onChangeTableOperateConfig");
    EventBus.$off('onPageEventClick')
  },
  mounted() {
    EventBus.$off("onChangeTableOperateConfig");
    EventBus.$on("onChangeTableOperateConfig", this.onChangeTableOperateConfig);

    EventBus.$off('onPageEventClick')
    EventBus.$on('onPageEventClick', this.eventClick)
  },
  computed: {
    eventList() {
      if (this.chooseEventType == "load" || this.chooseEventType == "show") {
        return this.pageEventConfig.eventList;
      } else {
        return this.componentConfig.options.eventConfig.eventList;
      }
    },
  },
  methods: {
    onChangeTableOperateConfig(data){
      this.componentConfig = data;
      let that = this;
      this.$nextTick(()=>{
        that.eventClick('click');
      })
    },
    eventClick(type) {
      this.chooseEventType = type;
      this.eventList.forEach((eItem) => {
        if (eItem.eventType == type) {
          if (eItem.version == "1.0.0") {
            if (!this.dialogEventVisible) {
              this.dialogEventVisible = true;
            }
          } else {
            // 老版本的需要右侧框，所以这边逻辑这么处理
            this.isShowNewEventFlowChart = !this.isShowNewEventFlowChart;
            this.$emit("eventShow", this.isShowNewEventFlowChart);
          }
          this.eventItem = eItem;
          this.newEventList = eItem.actionList;
        }
      });
    },
    eventSave(nodes) {
      this.eventItem.actionList = nodes;
      console.log("eventSave+ this.eventItem", this.eventItem);
    },
    onSaveFlowChartData(data) {
      console.log("收起", data);
      this.isShowNewEventFlowChart = false;
      this.$emit("eventShow", this.isShowNewEventFlowChart);
      if (!data || !data.nodeList.length) return false;
      // data = {"name":"test999999","nodeList":[{"id":"flow-origin", name: '开始', type: 'flow-origin', left: '250px', top: '100px', actionItem: {}}, {"id":"v2q8638n7a","name":"组件隐藏/显示","type":"event-operate-display","left":"15px","top":"6px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-display","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[],"operateDisplay":[]}},{"id":"cd3plh7qgk","name":"数据刷新","type":"event-operate-refresh","left":"174px","top":"6px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-refresh","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[],"operateRefresh":[]}},{"id":"bjvw4rpfo","name":"判定","type":"event-operate-logic-judgment","left":"204px","top":"78px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-logic-judgment","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[]}},{"id":"tsn7f70omi","name":"组件隐藏/显示1","type":"event-operate-display","left":"63px","top":"136px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-display","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[],"operateDisplay":[]}},{"id":"42gjmrczk0","name":"页面跳转","type":"event-operate-href","left":"288px","top":"140px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-href","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[]}},{"id":"82y99um9ky","name":"接口调用","type":"event-operate-interface","left":"64px","top":"216px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-interface","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[]}},{"id":"50q8xcj32m","name":"判定1","type":"event-operate-logic-judgment","left":"252px","top":"210px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-logic-judgment","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[]}},{"id":"dalp2afw2","name":"表单提交","type":"event-operate-form-submit","left":"141px","top":"294px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-form-submit","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[],"operateDisplay":[]}},{"id":"6bpjvepeku","name":"弹出层","type":"event-operate-dialog-box","left":"355px","top":"293px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-dialog-box","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[]}},{"id":"2h24ibaeek","name":"数据刷新1","type":"event-operate-refresh","left":"138px","top":"367px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-refresh","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[],"operateRefresh":[]}},{"id":"zd7bpq841f","name":"判定2","type":"event-operate-logic-judgment","left":"387px","top":"396px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-logic-judgment","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[]}},{"id":"p88fc03bc","name":"弹出层1","type":"event-operate-dialog-box","left":"141px","top":"466px","ico":"el-icon-video-play","actionItem":{"actionType":"event-operate-dialog-box","interfaceDataConfig":{"paramsConfigs":[]},"statusActionList":[],"hrefPageParams":[]}},{"id":"tqw8batww","name":"弹出层2","type":"event-operate-dialog-box","left":"354px","top":"515px","ico":"el-icon-video-play","actionItem":{}}],"lineList":[{"from":"flow-origin","to":"v2q8638n7a"},{"from":"v2q8638n7a","to":"cd3plh7qgk"},{"from":"cd3plh7qgk","to":"bjvw4rpfo"},{"from":"bjvw4rpfo","to":"tsn7f70omi"},{"from":"bjvw4rpfo","to":"42gjmrczk0"},{"from":"tsn7f70omi","to":"82y99um9ky"},{"from":"82y99um9ky","to":"50q8xcj32m"},{"from":"50q8xcj32m","to":"dalp2afw2"},{"from":"50q8xcj32m","to":"6bpjvepeku"},{"from":"6bpjvepeku","to":"zd7bpq841f"},{"from":"dalp2afw2","to":"2h24ibaeek"},{"from":"2h24ibaeek","to":"p88fc03bc"},{"from":"zd7bpq841f","to":"tqw8batww"}]}
      // console.log(data)
      let actionList = [];

      if (this.chooseEventType == "load") {
        let eventList = this.pageEventConfig.eventList || [];
        eventList[0].actionList = [];
        actionList = eventList[0].actionList || [];
      } else if (this.chooseEventType == "show") {
        let eventList = this.pageEventConfig.eventList || [];
        eventList[1].actionList = [];
        actionList = eventList[1].actionList || [];
      } else {
        let eventList =
          this.componentConfig.options.eventConfig.eventList || [];
        if (this.chooseEventType == "click") {
          eventList[0].actionList = [];
          actionList = eventList[0].actionList || [];
        } else if (this.chooseEventType == "change") {
          eventList[1].actionList = [];
          actionList = eventList[1].actionList || [];
        }
      }

      let nodeList = data.nodeList || [];
      let lineList = data.lineList || [];
      // 把node数组转化为key, value的Map数据结构，提升查找效率
      let nodeListMap = {};
      // 开始节点，通过一系列处理，该节点将变成所有节点的树状根节点
      let flowOriginNode = {};
      // 如果只有一个事件，进行特殊处理
      if (nodeList.length === 1) {
        nodeList[0].actionItem.actionType &&
          actionList.push(nodeList[0].actionItem);
        return false;
      }
      // 生成节点地图，通过节点ID可以快速的查找到某个节点
      nodeList.forEach((nodeItem) => {
        nodeListMap[nodeItem.id] = nodeItem;
        // _eventFlowChartConfig为私有属性，事件执行不需要该属性，但是在事件流程图回显的时候需要
        nodeItem.actionItem._eventFlowChartConfig = {
          name: nodeItem.name,
          top: nodeItem.top,
          left: nodeItem.left,
        };
        // 查找根节点，并保存起来
        if (nodeItem.type === "flow-origin") {
          flowOriginNode = nodeItem;
        }
      });

      this.handleLogicJudgmentAction(nodeListMap, lineList);
      // console.log(flowOriginNode)
      this.packageEventAction(actionList, flowOriginNode);
      console.log("onSaveFlowChartData", actionList);
    },
    // 把事件流程图转换为可执行的事件配置
    packageEventAction(actionList, nodeData) {
      if (nodeData.type === "flow-origin" && nodeData.children) {
        // 根节点必须只有一个子节点
        this.packageEventAction(actionList, nodeData.children[0]);
      } else if (nodeData.children && nodeData.children.length === 1) {
        // 线性流程，正常转换成老配置的格式
        actionList.push(nodeData.actionItem);
        this.packageEventAction(actionList, nodeData.children[0]);
      } else if (nodeData.children && nodeData.children.length > 1) {
        // 逻辑节点，特殊处理不再深度解析
        nodeData.actionItem.logicChildren = nodeData.children;
        actionList.push(nodeData.actionItem);

        // 给逻辑节点下的所有子节点添加actionItem.logicChildren属性
        recursionNodeData(nodeData);
        function recursionNodeData(nodeData) {
          nodeData &&
            nodeData.children &&
            nodeData.children.forEach((childrenItem) => {
              if (childrenItem.children) {
                childrenItem.actionItem.logicChildren = childrenItem.children;
                recursionNodeData(childrenItem);
              }
            });
        }
      } else {
        if (!nodeData.actionItem.actionType) {
          nodeData.actionItem.actionType = nodeData.type;
          nodeData.actionItem.interfaceDataConfig = {
            paramsConfigs: [],
            statusActionList: [],
            hrefPageParams: [],
          };
          // console.log(this.selectedActionNodeData)
        }
        // 这个应该是最后一个节点，没有children
        actionList.push(nodeData.actionItem);
      }
    },
    /**
     * 注意：nodeList、lineList的数据结构及元素的排列顺序！
     *
     * 1、nodeList、lineList是一个数组但是里面的元素是根据拖拽出来的时间顺序来排列，跟流程图顺序没有关系
     * 2、所以在解析的时候要当作一个无序数组进行处理，没办法从流程图上面找规律
     *
     *
     * 数据解析的思路（异常处理）：
     * 1、解析的唯一依据就是lineList的from、to！不要在流程图的连线顺序找规律
     * 2、没在lineList的node节点说明是不在流程上的无效节点，应该删除
     * 3、当有两个及以上的流程时，需要有个开始流程
     *
     * 待优化的地方：
     * 1、如果有未连接的节点最好可以提示一下，而不是直接删除
     */
    handleLogicJudgmentAction(nodeListMap, lineList) {
      // let obj = {} // 所有的逻辑节点转为某种依赖结构存放在这个变量里，可以通过这个变量快速查询到节点
      // let logicDependNodeMapFrom = {}
      // let logicDependNodeMapTo = {}
      lineList.forEach((lineItem) => {
        let fromId = lineItem.from;
        let toId = lineItem.to;
        let fromNode = nodeListMap[fromId];
        let toNode = nodeListMap[toId];
        lineItem.label && (toNode._connectionLabel = lineItem.label);

        if (!fromNode.children) {
          fromNode.children = [];
        }
        fromNode.children.push(toNode);

        // if (fromNode.actionType === 'event-operate-logic-judgment'){
        //   if (!logicDependNodeMapFrom[fromId]) {
        //     logicDependNodeMapFrom[fromId] = []
        //   }
        //   logicDependNodeMapFrom[fromId].push(toId)
        // }
        // if (toNode.actionType === 'event-operate-logic-judgment'){
        //   if (!logicDependNodeMapTo[fromId]) {
        //     logicDependNodeMapTo[fromId] = []
        //   }
        //   logicDependNodeMapTo[fromId].push(toId)
        // }
      });
    },
    onSaveLineConfig(data) {
      this.$refs.eventFlowChart.updateFlowPanel(data);
    },
    onClickFlowChartLine(lineData) {
      this.selectedActionNodeData = lineData;
      this.selectedActionNodeData.actionType = "flow-chart-line-config";
      this.$set(
        this.selectedActionNodeData,
        "value",
        this.selectedActionNodeData.label === "真"
      );
    },
    onClickFlowChartNode(node) {
      this.selectedActionNodeData = node.actionItem || {};
      if (!this.selectedActionNodeData.actionType) {
        this.selectedActionNodeData.actionType = node.type;
        this.selectedActionNodeData.interfaceDataConfig = {
          paramsConfigs: [],
          statusActionList: [],
          hrefPageParams: [],
        };
        // console.log(this.selectedActionNodeData)
      }

      this.isReloadEventConfig = false;
      this.$nextTick(() => {
        this.isReloadEventConfig = true;
      });
    },
    onChangeEventType() {},
    handlerOldConfig() {
      // 处理老配置  TODO::: 以后找机会删掉
      console.log("handlerOldConfig", this.componentConfig);
      if (this.componentConfig.uuid == 1) return false;
      let eventList = this.componentConfig.options.eventConfig.eventList;
      if (!eventList) return false;
      console.log("准备push");
      if (eventList.length === 0) {
        eventList.push({
          eventType: "click",
          actionList: [],
        });
        eventList.push({
          eventType: "change",
          actionList: [],
        });
      }
      if (eventList.length === 1) {
        if (eventList[0].eventType === "click") {
          eventList.push({
            eventType: "change",
            actionList: [],
          });
        }
        if (eventList[0].eventType === "load") {
          eventList.push({
            eventType: "show",
            actionList: [],
          });
        }
        if (eventList[0].eventType === "change") {
          eventList.unshift({
            eventType: "click",
            actionList: [],
          });
        }
        if (eventList[0].eventType === "show") {
          eventList.unshift({
            eventType: "load",
            actionList: [],
          });
        }
      }
      // fix bug 按钮选择器 老配置问题
      if (this.componentConfig.type === "van-design-segment") {
        if (eventList.length === 2) {
          if (eventList[0] && eventList[0].eventType === "click") {
            eventList.splice(0, 1);
          }
          if (eventList[1] && eventList[1].eventType === "click") {
            eventList.splice(1, 1);
          }
        }
      }
    },
    // 拿到过滤后的 input 组件
    filterInputComment() {
      let tempArr = [];
      this.pickInputComponentList(this.componentList, tempArr);
      this.componentUUIDList = tempArr;
    },
    initData() {
      this.filterInputComment();
      // 获取扁平的组件数组
      let tempArr = [];
      this.pickComponentList(
        this.componentList,
        tempArr,
        true,
        dataRefreshComponents
      );
      this.refreshComponentList = tempArr;
      // 所有的组件
      tempArr = [];
      this.pickComponentList(this.componentList, tempArr, false);
      this.linearComponentList = tempArr;
      // 对话框组件
      // tempArr = [];
      // this.pickComponentList(this.componentList, tempArr, true,dialogBoxComponents);
      // this.dialogBoxComponentList = tempArr;
    },
    // handleAddColumnEvent() {
    //   let eventConfigList = this.componentConfig.options.eventConfig.eventList;
    //   if (!eventConfigList || !eventConfigList.push) {
    //     eventConfigList = [];
    //     this.componentConfig.options.eventConfig.eventList = eventConfigList;
    //   }
    //   eventConfigList.push({
    //     eventType: "click",
    //     actionList: [],
    //   });
    // },
    handleAddColumnAction(actionList) {
      if (!actionList) return false;
      actionList.push({
        actionType: "",
        interfaceDataConfig: {
          paramsConfigs: [],
          statusActionList: [],
          hrefPageParams: [],
        },
      });
    },
    onHandleDelActionList(index, actionList) {
      // let eventConfigList = this.componentConfig.options.eventConfig.eventList;
      if (!actionList.push) return false;
      actionList.splice(index, 1);
    },
    pickComponentList(
      componentConfigList,
      componentList,
      isPickCoverBigComponent,
      filterType
    ) {
      //filterType 过滤可操作组件标示
      componentConfigList.forEach((item) => {
        let newItem = this.componentDeepClone(item);
        // let newItem = item
        let componentObj = {};
        let type = newItem.type;
        let name = newItem.name;
        let uuid = newItem.uuid;
        let options = newItem.options;
        let optionsColumns = options && options.columns;
        if (
          coverBigComponent.indexOf(type) !== -1 &&
          optionsColumns &&
          optionsColumns.length
        ) {
          optionsColumns.forEach((columnItem) => {
            if (columnItem.componentList && columnItem.componentList.length) {
              this.pickComponentList(
                columnItem.componentList,
                componentList,
                isPickCoverBigComponent,
                filterType
              );
            }
          });
        }
        componentObj.type = type;
        componentObj.name = name;
        componentObj.uuid = uuid;
        componentObj.options = options;
        if (!isPickCoverBigComponent || filterType.indexOf(type) !== -1) {
          componentList.push(componentObj);
        }
      });
    },
    pickInputComponentList,
    // 接口查询

    componentDeepClone,
  },
};
</script>
<style scoped lang="scss">
/deep/.el-tabs__content {
  padding: 0 !important;
  margin: 0 !important;
}
.panel-del-btn {
  position: absolute;
  right: 5px;
  padding: 4px;
}

// 覆写el-label
.label-left /deep/.el-form-item__label {
  float: left;
}

.new-event-demo-wrap {
  position: fixed;
  top: 0px;
  right: 315px;
  z-index: 201;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.5);
}
.new-event-demo {
  // width: 100%;
  // height: 100%;
  width: 800px;
  height: 800px;
  position: absolute;
  right: 0;
  top: 138px;
  // position: fixed;
  // top: 0;
  // right: 0;
  // z-index: 201;
  // width: 550px;
  // height: 500px;
  // position: fixed;
  // top: 130px;
  // right: 315px;
  border-right: 1px solid #e0e0e0;
  background-color: #fff;
}
.event-div {
  display: flex;
  flex-direction: row;
  cursor: pointer;
  width: 88%;
  margin: 20px auto;
  align-items: center;
  color: #666;
  cursor: pointer;
  border: 1px solid #e5e6e8;
  border-radius: 6px;
  padding: 0 8px;
  height: 36px;
  &:hover {
    color: #409eff;
    border: 1px dashed #409eff;
  }
}
.event-icon {
  font-size: 12px;
  margin: 0 10px;
}
</style>
