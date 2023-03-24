<template>
  <div
    class="layout-template-page"
    :style="{
      textAlign: options.labelAlign,
      backgroundColor: hexToRgba(options.backgroundColor,(options.backgroundOpacity/100)),
      backgroundImage: 'url(' + options.backgroundImage + ')',
      backgroundPosition:
        options.backgroundPositionX + '% ' + options.backgroundPositionY + '%',
      backgroundRepeat: options.backgroundRepeat,
      backgroundSize:
        options.backgroundSize ||
        options.backgroundSizeWidth + '% ' + options.backgroundSizeHeight + '%',
      backgroundAttachment: options.backgroundAttachment,
    }"
  >
    <!-- :style="{backgroundColor: options.backgroundColor}" -->
    <van-row
      :type="options.type ? 'flex' : ''"
      :justify="options.justify"
      :align="options.align"
      :gutter="options.gutter"
      :style="{
        display: 'flex',
        alignItems: options.labelVerticalAlign
      }"
    >
      <van-col
        :span="col.value"
        v-for="(col, colIndex) in options.columns"
        :key="colIndex"
        :style="{
          border:
            options._isGenerateComponent || col.componentList.length
              ? ''
              : '1px dashed #ccc'
        }"
        :class="{ 'layout-col': !options._isGenerateComponent }"
      >
        <draggable
          style="height: 100%"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget'
          }"
          v-model="col.componentList"
          :no-transition-on-drag="true"
          @start="onDragMoveStart($event, colIndex)"
          @end="onDragMoveEnd($event, col.componentList)"
          @add="onDragMoveAdd($event, col.componentList)"
        >
          <transition-group
            name="fade"
            tag="div"
            :style="{
              backgroundColor:
                options._isGenerateComponent || col.componentList.length
                  ? ''
                  : '#f2f3f5',
                  minHeight: options.layoutHeight + 'px'
            }"
          >
            <span v-for="(item, key) in col.componentList" :key="key">
              <span
                v-if="
                  options.fixDynamicComponentConfig.isToRender ||
                    options.fixDynamicComponentConfig.currentDragColIndex !==
                      colIndex ||
                    options.fixDynamicComponentConfig.currentDragIndex !==
                      key ||
                    options.coverBigComponent.indexOf(item.type) !== -1
                "
              >
                <DynamicComponentLib
                  v-if="options._isGenerateComponent"
                  :componentConfig="item"
                  :key="key"
                  :elIndex="key"
                  :interfaceTableDataItem="options._interfaceTableDataItem"
                />
                <DynamicComponent
                  v-else
                  :componentConfig="item"
                  :key="key"
                  :elIndex="key"
                  :parentNodeList="parentNodeList"
                  @chooseItemIndex="
                    onChangeChooseItemIndex(colIndex, key, item.uuid)
                  "
                  @copyItemIndex="copyComponentItem(colIndex, key)"
                  @pasteItemIndex="pasteComponentItem(colIndex, key)"
                  @deleteComponentItem="deleteComponentItem"
                  @cloneComponentItem="cloneComponentItem"
                  @moveUpComponentItem="moveUpComponentItem"
                  @moveDownComponentItem="moveDownComponentItem"
                  @moveToTopComponentItem="moveToTopComponentItem"
                  @moveToBottomComponentItem="moveToBottomComponentItem"
                  @insertComponentItem="insertComponentItem"
                />
              </span>
            </span>
          </transition-group>
          <!-- <div style="height: 50px;" v-if="!col.componentList.length"></div> -->
        </draggable>
      </van-col>
    </van-row>
  </div>
</template>

<script>
// import store from '@/store'
import Draggable from "vuedraggable";
import DynamicComponent from "../../../dynamic-component.vue";
import DynamicComponentLib from "../../../../generate-component/dynamic-component.vue";
// import { EventBus } from "@/util/event-bus.js";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import optionsConfig from "./options-config";
import { generateUUID } from "@/views/report/utils/index.js";
import componentsConfigs from "../../../../components/configs/index";
import { componentCopyConfig } from "@/views/report/utils/deal-component-data/copy-component-config";
import { nestComponentBasicsMethods } from "@/views/report/report-mixins/nest-component";
import { transformComponentConfigSimpleToFullV2 } from "@/views/report/utils/deal-component-data/transform-component-config-2.0";
export default {
  name: "layoutTemplate",
  mixins: [nestComponentBasicsMethods],
  components: {
    Draggable,
    DynamicComponent,
    DynamicComponentLib
  },
  props: {
    parentNodeList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      options: optionsConfig,
      currentComponentConfigList: [],
      componentsConfigs: {},
      componentDragMoveStart: false
    };
  },
  watch: {
    "options.columns": {
      deep: true,
      handler(vals) {
        vals.forEach(parentItem => {
          let componentList = parentItem.componentList || [];
          componentList.forEach((item, index) => {
            if (item.type === "van-design-group-component") {
              return this.handleGroupComponentUUID(item, componentList, index);
            }

            if (!item.uuid) {
              let newItem = this.componentDeepClone(item);
              newItem.uuid = generateUUID();
              newItem.options.commonConfigAssignSign = newItem.uuid;
              //2021-08-13 这里判断是为了 列表 组件服务的，将绑定的列表组件值传递到嵌套内容里
              if (this.options._data_origin_component_uuid) {
                newItem.options._data_origin_component_uuid = this.options._data_origin_component_uuid;
              }
              componentList[index] = newItem;
              // 保存操作记录
              this.$globalData.operateStack.push({
                uuid: newItem.uuid,
                componentList,
                isAdd: true
              });
            } else {
              /**
               * 更新操作记录中引用的组件容器列表
               * 如果不更新的话，会导致进行撤销重做时不能更新页面
               * 为什么会导致这个问题：因为每次组件改变时都会生成新的componentList，之前引用的就没用了
               *
               * TODO::: 待优化（每次页面中的组件改变都要遍历一下，严重影响性能）
               *
               */
              let stackItem = this.$globalData.operateStack[
                this.$globalData.operateStack.length - 1
              ];
              if (item && stackItem && item.uuid === stackItem.uuid) {
                stackItem.componentList = componentList;
                if (stackItem.isMove) {
                  // console.log('xxxx', stackItem)
                  // stackItem.newComponentList = componentList
                  // stackItem.oldComponentList = componentList
                  if (stackItem.moveType === "layout") {
                    stackItem.newComponentList = componentList;
                  } else {
                    stackItem.oldComponentList = componentList;
                    stackItem.newComponentList = componentList;
                  }
                }
              }
              // this.$globalData.operateStack.forEach(stackItem => {})
            }
          });
        });
      }
    }
  },
  created() {
    this.componentsConfigs = componentsConfigs;
  },
  // mounted() {
  //   document.body.ondrop = function (event) {
  //     const isFirefox =
  //       navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  //     if (isFirefox) {
  //       event.preventDefault();
  //       event.stopPropagation();
  //     }
  //   };
  // },
  methods: {
    /************** 通过 *************/
    // onDragMoveStart(el, colIndex){
    //   this.options.fixDynamicComponentConfig.isToRender = false
    //   this.options.fixDynamicComponentConfig.currentDragIndex = el.oldIndex
    //   this.options.fixDynamicComponentConfig.currentDragColIndex = colIndex
    // },
    // onDragMoveEnd(){
    //   this.options.fixDynamicComponentConfig.isToRender = true
    //   this.options.fixDynamicComponentConfig.currentDragIndex = 9999 // 其实重置9999并没有啥作用，只是图个心安，通过模板的三个||基本不会有问题
    //   this.options.fixDynamicComponentConfig.currentDragColIndex = 9999
    // },
    // onDragMoveAdd(el, componentList){
    //   // let componentConfigItem = componentList[el.oldIndex]
    //   // let stackItem = {
    //   //   uuid: componentConfigItem.uuid,
    //   //   componentConfig: componentConfigItem,
    //   //   newComponentList: componentList,
    //   //   isMove: true
    //   // }
    //   // this.$globalData.operateStack.push(stackItem)
    //   // setTimeout(() => {
    //   //   // 在
    //   //   if (!stackItem.oldComponentList) {
    //   //     this.$globalData.operateStack.pop()
    //   //   }
    //   // }, 0)
    // },
    // /************** end *************/
    // onChangeChooseItemIndex(colIndex, index, uuid) {
    //   store.dispatch('app/changeMobileDesignComponentUUID', uuid)
    //   this.currentComponentConfigList = this.options.columns[colIndex].componentList
    //   // this.options.currentColumns = this.options.columns[colIndex]
    //   let currentWidgetComponentConfig = this.currentComponentConfigList[index];
    //   EventBus.$emit('onChangeCurrentWidgetComponentConfig', currentWidgetComponentConfig)
    // },
    // deleteComponentItem(index) {
    //   this.currentComponentConfigList.splice(index, 1);
    // },
    // cloneComponentItem(index) {
    //   let el = this.currentComponentConfigList[index];
    //   let newEl = this.componentCopyConfig(componentsConfigs, el.type, el.options)
    //   newEl.uuid = generateUUID()
    //   newEl.options.commonConfigAssignSign = newEl.uuid
    //   this.currentComponentConfigList.splice(index + 1, 0, newEl);
    //   // 选中当前复制的组件
    //   store.dispatch('app/changeMobileDesignComponentUUID', newEl.uuid)
    //   EventBus.$emit('onChangeCurrentWidgetComponentConfig', newEl)
    // },
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
    hexToRgba (hex, opacity, output="string") {
      let red = parseInt("0x" + hex.slice(1, 3));
      let green = parseInt("0x" + hex.slice(3, 5));
      let blue = parseInt("0x" + hex.slice(5, 7));
      if (output === "string") {
        return `rgba(${red},${green},${blue},${opacity})`
      } else {
        return { red, green, blue, alpha: opacity * 255 }
      }
    },
    transformComponentConfigSimpleToFullV2,
    componentCopyConfig,
    componentDeepClone
  }
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
.layout-col {
  &:hover {
    border: 1px dashed #ccc !important;
  }
}
</style>
