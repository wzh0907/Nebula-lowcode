<template>
  <div class="widget-form-container">
    <draggable
      style="height: 100%"
      v-bind="{
        group: 'people',
        ghostClass: 'ghost',
        animation: 200,
        handle: '.drag-widget',
      }"
      v-model="componentListPropsPointer"
      :no-transition-on-drag="true"
      @start="onDragMoveStart"
      @end="onDragMoveEnd($event, componentList)"
      @add="onDragMoveAdd($event, componentList)"
      tag="van-row"
      class="widget-form-list"
      :style="{
        backgroundColor: globalConfig.backgroundColor,
        opacity:
          globalConfig.backgroundOpacity &&
          Math.abs(globalConfig.backgroundOpacity - 10) / 10,
        fontSize: globalConfig.fontSize,

        backgroundImage: 'url(' + globalConfig.backgroundImage + ')',
        backgroundPosition:
          globalConfig.backgroundPositionX +
          '% ' +
          globalConfig.backgroundPositionY +
          '%',
        backgroundRepeat: globalConfig.backgroundRepeat,
        backgroundSize: 'cover',
        backgroundAttachment: globalConfig.backgroundAttachment,
        padding: `${globalConfig.topPaddingDistance || 0}px ${
          globalConfig.rightPaddingDistance || 0
        }px ${globalConfig.bottomPaddingDistance || 0}px ${
          globalConfig.leftPaddingDistance || 0
        }px`,
      }"
    >
      <DynamicComponent
        v-for="(item, key) in componentList"
        :componentConfig="item"
        :key="key"
        :elIndex="key"
        :parentNodeList="parentNodeList"
        @copyItemIndex="copyComponentItem"
        @pasteItemIndex="pasteComponentItem"
        @moveUpComponentItem="moveUpComponentItem"
        @moveDownComponentItem="moveDownComponentItem"
        @chooseItemIndex="onChangeChooseItemIndex"
        @deleteComponentItem="deleteComponentItem"
        @cloneComponentItem="cloneComponentItem"
        @moveToTopComponentItem="moveToTopComponentItem"
        @moveToBottomComponentItem="moveToBottomComponentItem"
        @moveInComponentItem="moveInComponentItem"
        @insertComponentItem="insertComponentItem"
      />
    </draggable>
  </div>
</template>

<script>
import { EventBus } from "@/util/event-bus.js";
import store from "@/store";
import Draggable from "vuedraggable";
import DynamicComponent from "./dynamic-component.vue";
import { generateUUID } from "@/views/report/utils/index.js";
import componentsConfigs from "../components/configs/index";
import { componentCopyConfig } from "@/views/report/utils/deal-component-data/copy-component-config";
import { ComponentDataSourceApiQuery } from "@/views/report/utils/deal-component-data-source/index";
import { transformComponentConfigSimpleToFull } from "@/views/report/utils/deal-component-data/transform-component-config";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default {
  name: "WidgetForm",
  components: {
    Draggable,
    DynamicComponent,
  },
  props: {
    componentList: Array,
    globalConfig: Object,
    parentNodeList: Array,
  },
  data() {
    return {
      componentsConfigs,
      componentListPropsPointer: this.componentList,
      componentDragMoveStart: false,
    };
  },
  watch: {
    componentList(val) {
      this.componentListPropsPointer = val;
    },
    componentListPropsPointer: {
      deep: true,
      handler(val) {
        this.$emit("onChangeComponentList", val);
      },
    },
  },
  created() {
    this.initApiQuery();
  },
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
    initApiQuery() {
      let that = this;
      setTimeout(() => {
        let dataSourceApiQuery = new ComponentDataSourceApiQuery(
          [],
          that.componentList,
          that.$pageDataModelEngine
        ); // 集中处理页面直接的数据获取
        dataSourceApiQuery.init();
      }, 100);
    },
    /************** 通过 *************/
    onDragMoveStart(el) {
      this.componentDragMoveStart = true;
    },
    onDragMoveEnd(el, componentList) {
      console.log("onDragMoveEnd", el, componentList);
      // 保存操作记录（移动）
      if (this.componentDragMoveStart) {
        let oldIndex = el.oldIndex;
        let newIndex = el.newIndex;
        let componentConfigItem = componentList[newIndex] || {};
        if (componentConfigItem) {
          let stackItem = {
            uuid: componentConfigItem.uuid,
            componentConfig: componentConfigItem,
            newComponentList: componentList,
            oldComponentList: componentList,
            oldComponentIndex: oldIndex,
            isMove: true,
            moveType: "page",
          };
          this.$globalData.operateStack.push(stackItem);
        }
        this.componentDragMoveStart = false;
      } else {
        // let stackItem = this.$globalData.operateStack[this.$globalData.operateStack.length - 1]
        // stackItem.oldComponentList = this.componentList
        // stackItem.oldComponentIndex = el.oldIndex
      }
    },
    onDragMoveAdd(el, componentList) {
      // pullMode等于true时代表有组件从其他地方拖入当前组件内（非新组件）
      if (el.pullMode === true) {
        // 为什么使用延时器，因为需要在其他一切数据准备完毕之后再来进行下面的操作
        setTimeout(() => {
          let operateStackItem =
            this.$globalData.operateStack[
              this.$globalData.operateStack.length - 1
            ];
          if (operateStackItem) {
            let newIndex = el.newIndex;
            let componentConfigItem = componentList[newIndex] || {};
            operateStackItem.uuid = componentConfigItem.uuid;
            operateStackItem.newComponentList = componentList;
            operateStackItem.componentConfig = componentConfigItem;
            // operateStackItem.moveType = 'page'
            // console.log(operateStackItem, this.$globalData.operateStack)
          }
        }, 0);
      }
      // if (!this.componentDragMoveStart) return false;
      // console.log('xxx-add', componentList, el.oldIndex)
      // let componentConfigItem = componentList[el.oldIndex]
      // let stackItem = {
      //   uuid: componentConfigItem.uuid,
      //   componentConfig: componentConfigItem,
      //   newComponentList: componentList,
      //   isMove: true
      // }
      // this.$globalData.operateStack.push(stackItem)
      // setTimeout(() => {
      //   // 在
      //   if (!stackItem.oldComponentList) {
      //     this.$globalData.operateStack.pop()
      //   }
      //   console.log('xxx', stackItem)
      // }, 0)
    },
    /************** end *************/
    copyComponentItem(index) {
      let el = this.componentList[index];

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
      this.componentList.splice(index + 1, 0, newEl);
    },
    onChangeChooseItemIndex(index, uuid) {
      store.dispatch("app/changeMobileDesignComponentUUID", uuid);
      this.$emit("onChangeChooseItemIndex", this.componentList, index);
    },
    deleteComponentItem(index) {
      let arr = this.componentList.splice(index, 1);
      let componentConfigItem = arr[0] || {};
      // 保存操作记录（删除）
      this.$globalData.operateStack.push({
        uuid: componentConfigItem.uuid,
        componentConfig: componentConfigItem,
        componentList: this.componentList,
        componentIndex: index,
        isDelete: true,
      });
    },
    cloneComponentItem(index) {
      // TODO::: 可优化，数组的splice方法可直接在原数组上添加元素
      let el = this.componentList[index];
      let tempTailArr = this.componentList.slice(index + 1);
      let tempHeadArr = this.componentList.slice(0, index + 1);
      let tempArr = [];
      let newEl = this.componentCopyConfig(
        componentsConfigs,
        el.type,
        el.options
      );
      newEl.uuid = generateUUID();
      newEl.options.commonConfigAssignSign = newEl.uuid;
      tempHeadArr.push(newEl);
      tempArr = tempHeadArr.concat(tempTailArr);
      this.$emit("onChangeComponentList", tempArr);
      // 选中当前复制的组件
      store.dispatch("app/changeMobileDesignComponentUUID", newEl.uuid);
      EventBus.$emit("onChangeCurrentWidgetComponentConfig", newEl);
      // 保存操作记录（添加）
      this.$globalData.operateStack.push({
        uuid: newEl.uuid,
        componentList: this.componentList,
        isAdd: true,
      });
    },
    moveUpComponentItem(index) {
      if (index - 1 >= 0) {
        this.swapArray(index, index - 1);
      }
    },
    moveDownComponentItem(index) {
      if (index + 1 != this.componentList.length) {
        this.swapArray(index, index + 1);
      }
    },
    moveToTopComponentItem(index) {
      this.swapArray(index, -1);
    },
    moveToBottomComponentItem(index) {
      this.swapArray(index, this.componentList.length);
    },
    moveInComponentItem(index) {
      //判断上一个组件是否是栅格，若是，则移入
      if (index < 1) {
        return;
      }
      let compCurrent = this.componentList[index];
      let compTarget = this.componentList[index - 1];
      if (
        compTarget.type !== "van-design-layout" &&
        compTarget.type !== "van-design-tabs" &&
        compTarget.type !== "van-design-list" &&
        compTarget.type !== "van-design-collapse"
      ) {
        return;
      }
      compTarget.options.columns[0].componentList.push(compCurrent);
      this.componentList.splice(index, 1);
    },
    insertComponentItem(index, comp) {
      this.componentList.splice(index + 1, 0, comp);
    },
    swapArray(index1, index2) {
      if (index2 < 0) {
        this.componentList.unshift(this.componentList[index1]);
        this.componentList.splice(index1 + 1, 1);
      } else if (index2 >= this.componentList.length) {
        this.componentList.push(this.componentList[index1]);
        this.componentList.splice(index1, 1);
      } else {
        this.componentList[index1] = this.componentList.splice(
          index2,
          1,
          this.componentList[index1]
        )[0];
      }
    },
    componentCopyConfig,
    transformComponentConfigSimpleToFull,
  },
};
</script>

<style lang="scss" scoped>
.widget-form-container .widget-form-list {
  border: 0 !important;
  margin: 0 !important;
}
.widget-form-container {
  height: 667px;
  perspective: 100px; // TODO: 解决fixed定位问题
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
