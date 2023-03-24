<template>
  <div class="layout-template-page">
    <div v-if="options._isGenerateComponent">
      <van-row
        v-for="(renderComponentItem, key) in options.renderComponentList"
        :key="key"
      >
        <DynamicComponentLib
          v-for="(item, colIndex) in renderComponentItem.componentList"
          :componentConfig="item"
          :key="colIndex"
          :elIndex="colIndex"
          :interfaceTableDataItem="renderComponentItem.tableDataItem"
        />
      </van-row>
    </div>
    <draggable
      v-else
      style="height: 100%; min-height: 50px"
      :style="{
        backgroundColor: options.columns[0].componentList.length
          ? ''
          : '#f2f3f5',
      }"
      v-bind="{
        group: 'people',
        ghostClass: 'ghost',
        animation: 200,
        handle: '.drag-widget',
      }"
      v-model="options.columns[0].componentList"
      :no-transition-on-drag="true"
      tag="van-row"
    >
      <DynamicComponent
        v-for="(item, colIndex) in options.columns[0].componentList"
        :componentConfig="item"
        :key="colIndex"
        :elIndex="colIndex"
        :parentNodeList="parentNodeList"
        @chooseItemIndex="onChangeChooseItemIndex(0, colIndex, item.uuid)"
        @copyItemIndex="copyComponentItem(0, colIndex)"
        @pasteItemIndex="pasteComponentItem(0, colIndex)"
        @deleteComponentItem="deleteComponentItem"
        @cloneComponentItem="cloneComponentItem"
        @moveUpComponentItem="moveUpComponentItem"
        @moveDownComponentItem="moveDownComponentItem"
        @moveToTopComponentItem="moveToTopComponentItem"
        @moveToBottomComponentItem="moveToBottomComponentItem"
        @insertComponentItem="insertComponentItem"
      />
    </draggable>
  </div>
</template>

<script>
import store from "@/store";
import Draggable from "vuedraggable";
import DynamicComponent from "../../../dynamic-component.vue";
import DynamicComponentLib from "../../../../generate-component/dynamic-component.vue";
import { EventBus } from "@/util/event-bus.js";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import optionsConfig from "./options-config";
import { generateUUID } from "@/views/report/utils/index.js";
import componentsConfigs from "../../../../components/configs/index";
import { componentCopyConfig } from "@/views/report/utils/deal-component-data/copy-component-config";
import { nestComponentBasicsMethods } from "@/views/report/report-mixins/nest-component";
import { transformComponentConfigSimpleToFullV2 } from "@/views/report/utils/deal-component-data/transform-component-config-2.0";
import { transformComponentListTreeToPlan } from "@/views/report/utils/deal-component-data/transform-component-list";
export default {
  name: "listTemplate",
  mixins: [nestComponentBasicsMethods],
  components: {
    Draggable,
    DynamicComponent,
    DynamicComponentLib,
  },
  props: {
    currentDeepParentNodeList: {
      type: Array,
      default: () => []
    },
    parentNodeList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      options: optionsConfig,
      componentsConfigs: {},
      currentComponentConfigList: [],
    };
  },
  watch: {
    "options.columns": {
      deep: true,
      handler(vals) {
        vals.forEach((parentItem) => {
          let componentList = parentItem.componentList || [];
          componentList.forEach((item, index) => {
            if (item.type === "van-design-group-component") {
              return this.handleGroupComponentUUID(item, componentList, index);
            }
            if (!item.uuid) {
              let newItem = this.componentDeepClone(item);
              newItem.uuid = generateUUID();
              newItem.options.commonConfigAssignSign = newItem.uuid;
              newItem.options._data_origin_component_uuid =
                this.options.commonConfigAssignSign;
              componentList[index] = newItem;
              // 保存操作记录
              this.$globalData.operateStack.push({
                uuid: newItem.uuid,
                componentList,
                isAdd: true,
              });
            }
          });
        });
      },
    },
    "options.interfaceDataConfig.tableData": {
      deep: true,
      immediate: true,
      handler(vals) {
        if (this.options._isGenerateComponent) {
          let renderComponentList = [];
          let componentList = this.options.columns[0].componentList;
          let tableData = this.options.interfaceDataConfig.tableData;
          this.giveComponent(renderComponentList, componentList, tableData);
          this.$set(this.options, "renderComponentList", renderComponentList);
        }
      },
    },
    "options.configPageSize": {
      deep: true,
      immediate: true,
      handler(vals) {
        console.log("watch configPageSize", vals, this.options);
        this.options.interfaceDataConfig.pagination.pageSize = vals;
        this.$pageDataModelEngine.setPagination(
          this.options.interfaceDataConfig
        );
      },
    },
  },
  created() {
    this.componentsConfigs = componentsConfigs;
  },
  mounted() {},
  methods: {
    giveComponent(renderComponentList, componentList, tableData) {
      tableData.forEach((tableDataItem) => {
        let componentListTemp = [];
        componentList.forEach((componentItem) => {
          if (componentItem.type === "van-design-group-component") {
            this.giveGroupComponent(
              renderComponentList,
              componentItem.options.componentList,
              tableDataItem
            );
          } else {
            let nComponent = this.componentDeepClone(componentItem);
            let listTemp = [];
            //这边这样处理是为了防止嵌套干脆 把列表里所有组件拉平，但是测试下来有点影响性能
            this.transformComponentListTreeToPlan([nComponent], listTemp);
            listTemp.forEach((cItem) => {
              this.handleEvent(cItem, tableDataItem);
            });
            // this.handleEvent(nComponent,tableDataItem)
            componentListTemp.push(nComponent);
          }
        });
        renderComponentList.push({
          tableDataItem,
          componentList: componentListTemp,
        });
      });
    },
    handleEvent(nComponent, tableDataItem) {
      // 遍历是不是有event 如果有 则判断是不是有paramConfig
      let clickEvent = nComponent.options.eventConfig.eventList[0];
      let actionList = clickEvent.actionList;
      actionList &&
        actionList.forEach((actionItem) => {
          if (actionItem.type == "event-operate-set") {
            let getInfo = actionItem.properties.actionSet.getInfo;
            getInfo.param_value = tableDataItem[getInfo.param_v_key];
          } else {
            let pinterfaceDataConfig =
              actionItem.properties.interfaceDataConfig;
            if (pinterfaceDataConfig) {
              let hrefPageParams = pinterfaceDataConfig.hrefPageParams;
              // 要适配 parampage
              hrefPageParams &&
                hrefPageParams.forEach((hItem) => {
                  if (hItem.param_value_type == "B") {
                    hItem.param_value = tableDataItem[hItem.param_v_key];
                  }
                });

              let paramsConfigs = pinterfaceDataConfig.paramsConfigs;

              // 要适配 parampage
              paramsConfigs &&
                paramsConfigs.forEach((pItem) => {
                  if (pItem.param_value_type == "B") {
                    pItem.param_value = "";
                    pItem.param_value = tableDataItem[pItem.param_v_key];
                  }
                });
            }
          }
        });
    },
    giveGroupComponent(renderComponentList, componentList, tableDataItem) {
      let componentListTemp = [];
      componentList.forEach((componentItem) => {
        if (componentItem.type === "van-design-group-component") {
          this.giveGroupComponent(
            renderComponentList,
            componentItem.options.componentList,
            tableDataItem
          );
        } else {
          componentListTemp.push(this.componentDeepClone(componentItem));
        }
      });
      renderComponentList.push({
        tableDataItem,
        componentList: componentListTemp,
      });
    },
    handleGroupComponentUUID(itemTemp, mainComponentList, mainIndex) {
      let groupComponentItem = this.componentDeepClone(itemTemp);

      let componentList = [];
      groupComponentItem.uuid = generateUUID();
      groupComponentItem.options.commonConfigAssignSign =
        groupComponentItem.uuid;
      let componentConfigList = groupComponentItem.options.componentList;
      this.transformComponentConfigSimpleToFullV2(
        componentConfigList,
        componentList,
        this.componentsConfigs,
        true,
        this.options.commonConfigAssignSign
      );
      groupComponentItem.options._data_origin_component_uuid =
        this.options.commonConfigAssignSign;
      // 这里有个列表的特殊处理 由于复合组件内部 没绑定到列表上，这边需要做个 初步处理 循环componentList
      // componentList.forEach(cItem=>{
      //   cItem.options._data_origin_component_uuid = this.options.commonConfigAssignSign;
      // });
      groupComponentItem.options.componentList = componentList;

      mainComponentList[mainIndex] = groupComponentItem;
    },
    transformComponentConfigSimpleToFullV2,
    componentCopyConfig,
    componentDeepClone,
    transformComponentListTreeToPlan,
  },
};
</script>

<style lang="scss" scoped>
</style>
