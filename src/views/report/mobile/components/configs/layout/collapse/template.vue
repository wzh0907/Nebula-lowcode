<template>
  <div class="layout-template-page">
    <van-collapse v-model="options.active" :accordion="options.accordion">
      <van-collapse-item
        v-for="(col, colIndex) in options.columns"
        :key="colIndex"
        :title="col.title"
        :name="colIndex.toString()"
      >
        <span slot="title">{{ col.title }}</span>
        <draggable
          style="height: 100%"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          v-model="col.componentList"
          :no-transition-on-drag="true"
          @add="onDragAddComponentEvent(colIndex)"
          @start="onDragMoveStart($event, colIndex)"
          @end="onDragMoveEnd"
        >
          <transition-group name="fade" tag="div" style="min-height: 50px">
            <div v-for="(item, key) in col.componentList" :key="key">
              <div
                v-if="
                  options.fixDynamicComponentConfig.isToRender ||
                  options.fixDynamicComponentConfig.currentDragColIndex !==
                    colIndex ||
                  options.fixDynamicComponentConfig.currentDragIndex !== key ||
                  options.coverBigComponent.indexOf(item.type) !== -1
                "
              >
                <DynamicComponentLib
                  v-if="options._isGenerateComponent"
                  :componentConfig="item"
                  :key="key"
                  :elIndex="key"
                />
                <DynamicComponent
                  v-else
                  :componentConfig="item"
                  :key="key"
                  :elIndex="key"
                  :parentNodeList="parentNodeList"
                  @copyItemIndex="copyComponentItem"
                  @pasteItemIndex="pasteComponentItem"
                  @chooseItemIndex="
                    onChangeChooseItemIndex(colIndex, key, item.uuid)
                  "
                  @deleteComponentItem="deleteComponentItem"
                  @cloneComponentItem="cloneComponentItem"
                  @addComponentItem="addComponentItem(colIndex, key, item.uuid)"
                  @moveUpComponentItem="moveUpComponentItem"
                  @moveDownComponentItem="moveDownComponentItem"
                  @moveToTopComponentItem="moveToTopComponentItem"
                  @moveToBottomComponentItem="moveToBottomComponentItem"
                  @moveInComponentItem="moveInComponentItem"
                  @insertComponentItem="insertComponentItem"
                />
              </div>
            </div>
          </transition-group>
          <!-- <div style="height: 50px;" v-if="!col.componentList.length"></div> -->
        </draggable>
      </van-collapse-item>
    </van-collapse>
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
import { transformComponentConfigSimpleToFullV2 } from "@/views/report/utils/deal-component-data/transform-component-config-2.0";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "tabsTemplate",
  components: {
    Draggable,
    DynamicComponent,
    DynamicComponentLib,
  },
  props: {
    parentNodeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      options: optionsConfig,
      currentComponentConfigList: [],
    };
  },
  watch: {
    "options.columns": {
      deep: true,
      handler(val) {
        val.forEach((parentItem) => {
          let componentList = parentItem.componentList || [];
          componentList.forEach((item, index) => {
            if (item.type === "van-design-group-component") {
              return this.handleGroupComponentUUID(item, componentList, index);
            }
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
              let stackItem =
                this.$globalData.operateStack[
                  this.$globalData.operateStack.length - 1
                ];
              if (item && stackItem && item.uuid === stackItem.uuid) {
                stackItem.componentList = componentList;
                if (stackItem.isMove) {
                  if (stackItem.moveType === "layout") {
                    stackItem.newComponentList = componentList;
                  } else {
                    stackItem.oldComponentList = componentList;
                    stackItem.newComponentList = componentList;
                  }
                }
              }
            }
          });
        });
      },
    },
  },
  created() {},
  mounted() {
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
    /************** 通过 *************/
    onDragMoveStart(el, colIndex) {
      this.options.fixDynamicComponentConfig.isToRender = false;
      this.options.fixDynamicComponentConfig.currentDragIndex = el.oldIndex;
      this.options.fixDynamicComponentConfig.currentDragColIndex = colIndex;
    },
    onDragMoveEnd() {
      this.options.fixDynamicComponentConfig.isToRender = true;
      this.options.fixDynamicComponentConfig.currentDragIndex = 9999; // 其实重置9999并没有啥作用，只是图个心安，通过模板的三个||基本不会有问题
      this.options.fixDynamicComponentConfig.currentDragColIndex = 9999;
    },
    /************** end *************/
    onChangeChooseItemIndex(colIndex, index, uuid) {
      store.dispatch("app/changeMobileDesignComponentUUID", uuid);
      this.currentComponentConfigList =
        this.options.columns[colIndex].componentList;
      let currentWidgetComponentConfig = this.currentComponentConfigList[index];
      EventBus.$emit(
        "onChangeCurrentWidgetComponentConfig",
        currentWidgetComponentConfig
      );
    },
    onDragAddComponentEvent(colIndex) {},
    copyComponentItem(index) {
      let el = this.currentComponentConfigList[index];
      // 直接把 这个le 放到storage里面
      setStorage("clipboard", JSON.stringify(el));
    },
    pasteComponentItem(index) {
      let parseInfo = JSON.parse(getStorage("clipboard"));
      let newEl = this.componentCopyConfig(
        componentsConfigs,
        parseInfo.type,
        parseInfo.options
      );
      newEl.uuid = generateUUID();
      newEl.options.commonConfigAssignSign = newEl.uuid;
      this.currentComponentConfigList.splice(index + 1, 0, newEl);
    },
    addComponentItem(colIndex, index) {},
    deleteComponentItem(index) {
      this.currentComponentConfigList.splice(index, 1);
    },
    cloneComponentItem(index) {
      let el = this.currentComponentConfigList[index];
      let newEl = this.componentCopyConfig(
        componentsConfigs,
        el.type,
        el.options
      );
      newEl.uuid = generateUUID();
      newEl.options.commonConfigAssignSign = newEl.uuid;
      this.currentComponentConfigList.splice(index + 1, 0, newEl);
    },
    moveUpComponentItem(index) {
      if (index - 1 >= 0) {
        this.swapArray(index, index - 1);
      }
    },
    moveDownComponentItem(index) {
      if (index + 1 != this.currentComponentConfigList.length) {
        this.swapArray(index, index + 1);
      }
    },
    moveToTopComponentItem(index) {
      this.swapArray(index, -1);
    },
    moveToBottomComponentItem(index) {
      this.swapArray(index, this.currentComponentConfigList.length);
    },
    moveInComponentItem(index) {
      //判断上一个组件是否是栅格或标签，若是，则移入
      if (index < 1) {
        return;
      }
      let compCurrent = this.currentComponentConfigList[index];
      let compTarget = this.currentComponentConfigList[index - 1];
      if (
        compTarget.type !== "van-design-layout" &&
        compTarget.type !== "van-design-tabs" &&
        compTarget.type !== "van-design-list" &&
        compTarget.type !== "van-design-collapse"
      ) {
        return;
      }
      compTarget.options.columns[0].componentList.push(compCurrent);
      this.currentComponentConfigList.splice(index, 1);
    },
    insertComponentItem(index, comp) {
      this.currentComponentConfigList.splice(index + 1, 0, comp);
    },
    handleGroupComponentUUID(itemTemp, mainComponentList, mainIndex) {
      if (itemTemp.uuid) return false;
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
        true
      );
      groupComponentItem.options.componentList = componentList;
      mainComponentList[mainIndex] = groupComponentItem;
    },
    swapArray(index1, index2) {
      if (index2 < 0) {
        this.currentComponentConfigList.unshift(
          this.currentComponentConfigList[index1]
        );
        this.currentComponentConfigList.splice(index1 + 1, 1);
      } else if (index2 >= this.currentComponentConfigList.length) {
        this.currentComponentConfigList.push(
          this.currentComponentConfigList[index1]
        );
        this.currentComponentConfigList.splice(index1, 1);
      } else {
        this.currentComponentConfigList[index1] =
          this.currentComponentConfigList.splice(
            index2,
            1,
            this.currentComponentConfigList[index1]
          )[0];
      }
    },
    transformComponentConfigSimpleToFullV2,
    componentCopyConfig,
    componentDeepClone,
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
