<template>
  <div class="layout-template-page" v-if="options.reloadView">
    <van-form
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
      @submit="onSubmit"
    >
      <draggable
        style="height: 100%"
        v-bind="{
          group: 'people',
          ghostClass: 'ghost',
          animation: 200,
          handle: '.drag-widget',
        }"
        v-model="options.columns[0].componentList"
        :no-transition-on-drag="true"
        @add="onDragAddComponentEvent(0)"
        @start="onDragMoveStart($event, 0)"
        @end="onDragMoveEnd"
      >
        <transition-group name="fade" tag="div" style="min-height: 50px" :style="{backgroundColor: options.columns[0].componentList.length ? '' : '#f2f3f5'}">
          <div
            v-for="(item, key) in options.columns[0].componentList"
            :key="key"
          >
            <DynamicComponentLib
              v-if="options._isGenerateComponent"
              :componentConfig="item"
              :key="key"
              :elIndex="key"              
            />
            <DynamicComponent
              v-else-if="item && item.type"
              :componentConfig="item"
              :key="key"
              :elIndex="key"
              @chooseItemIndex="onChangeChooseItemIndex(key, key, item.uuid)"
              @deleteComponentItem="deleteComponentItem"
              @cloneComponentItem="cloneComponentItem"
              @addComponentItem="addComponentItem(colIndex, key, item.uuid)"
            />
          </div>
        </transition-group>
      </draggable>

      <!-- <div style="margin: 16px">
        <a-button type="primary" html-type="submit"> 提交 </a-button>
      </div> -->
    </van-form>
  </div>
</template>

<script>
// const coverBigComponent = [
//   "van-design-tabs",
//   "van-design-collapse",
//   "van-design-layout",
//   "van-design-form"
// ]; // 可嵌套组件
import { coverBigComponent } from "@/views/report/utils/common-const";
let componentTypeMap = {
  input: "van-design-field",
  select: "van-design-select",
  radio: "van-design-radio",
};
import store from "@/store";
import Draggable from "vuedraggable";
import DynamicComponent from "../../../dynamic-component.vue";
import DynamicComponentLib from "../../../../generate-component/dynamic-component.vue";
import { EventBus } from "@/util/event-bus.js";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import optionsConfig from "./options-config";
import { generateUUID } from "@/views/report/utils/index.js";
import componentsConfigs from "./module/index";
import componentsAllConfigs from "../../../../components/configs/index";
import { componentCopyConfig } from "@/views/report/utils/deal-component-data/copy-component-config";

export default {
  name: "layoutTemplate",
  components: {
    Draggable,
    DynamicComponent,
    DynamicComponentLib,
  },
  data() {
    return {
      componentList: [],
      currentComponentConfigList: [],
      options: optionsConfig,
    };
  },
  watch: {
    // 'options.inputItoptionsemConfigs': {
    //   deep: true,
    //   handler(vals) {
    //     console.log(vals,"watch options.inputItoptionsemConfigs")
    //     vals && vals[0].componentList.forEach && this.initComponentConfig(vals[0].componentList)

    //   }
    // },
    "options.columns": {
      deep: true,
      handler(vals) {
        vals.forEach((parentItem) => {
          let componentList = parentItem.componentList || [];
          componentList.forEach((item, index) => {
            if (!item.uuid) {
              let newItem = this.componentDeepClone(item);
              newItem.uuid = generateUUID();
              newItem.options.commonConfigAssignSign = newItem.uuid;
              componentList[index] = newItem;
            }

          });
        });
        // this.$forceUpdate();
      },
    },
  },
  created() {
    this.options.inputItemComponentConfigs = [];
    this.initComponentConfig(this.options.columns[0].componentList);

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
    onDragAddComponentEvent(colIndex) {
      let componentList = this.options.columns[0].componentList;
      componentList.forEach((item, index) => {
        if (!item.uuid) {
          let newItem = this.componentDeepClone(item);
          newItem.uuid = generateUUID();
          newItem.options.commonConfigAssignSign = newItem.uuid;
          this.options.columns[0].componentList[index] = newItem;
        }
      });
      this.$forceUpdate();
      // store.dispatch('app/changeMobileDesignComponentUUID', uuid)
      // this.currentComponentConfigList = this.options.columns[0].componentList
      // // this.options.currentColumns = this.options.columns[colIndex]
      // let currentWidgetComponentConfig = this.currentComponentConfigList[colIndex];
      // EventBus.$emit('onChangeCurrentWidgetComponentConfig', currentWidgetComponentConfig)
    },
    /************** 通过 *************/
    onDragMoveStart(el, colIndex) {
      // this.options.fixDynamicComponentConfig.isToRender = false
      this.options.fixDynamicComponentConfig.currentDragIndex = el.oldIndex;
      this.options.fixDynamicComponentConfig.currentDragColIndex = colIndex;
    },
    onDragMoveEnd() {
      this.options.fixDynamicComponentConfig.isToRender = true;
      this.options.fixDynamicComponentConfig.currentDragIndex = 9999; // 其实重置9999并没有啥作用，只是图个心安，通过模板的三个||基本不会有问题
      this.options.fixDynamicComponentConfig.currentDragColIndex = 9999;
    },
    /************** end *************/

    onSubmit() {
      let inputComponentList = [];
      this.handleComponentConfig(
        this.options.columns[0].componentList,
        inputComponentList
      );
      let fieldList = []
      inputComponentList.forEach((item) => {
        let obj = {
          fieldName: item.options.databaseField,
          fieldValue: item.options.value
        }
        fieldList.push(obj)
      });
      let params = {
        dbConfigId: this.options.databaseId,
        tableName: this.options.dataTableName,
        fieldList
      }
      if (this.options.primaryKey) params.id = this.options.primaryKey
      if (!this.options.generateComponentsUUID) return false
      let eventHandle = new CustomEvent(`${this.options.generateComponentsUUID}-on-preload-handle-form-confirm`, {
        detail: {
          data: params
        }
      })
      window.dispatchEvent(eventHandle)
    },
    initComponentConfig(inputItemConfigs) {
      let formComponentsConfigs = componentsConfigs[0];
      // let inputItemComponentConfigs = this.options.inputItemComponentConfigs || []
      let inputItemComponentConfigs =
        this.options.columns[0].componentList || [];
      inputItemConfigs.forEach((inputItem, inputItemIndex) => {
        if (!inputItem.uuid) {
          let type = inputItem.type || "input";
          formComponentsConfigs.forEach((configItem) => {
            if (
              !inputItemComponentConfigs[inputItemIndex] ||
              inputItemComponentConfigs[inputItemIndex].type !== configItem.type
            ) {
              if (configItem.type === componentTypeMap[type]) {
                let objTemp = JSON.parse(JSON.stringify(inputItem));
                for (let key in configItem.options) {
                  if (!objTemp.hasOwnProperty(key)) {
                    objTemp[key] = configItem.options[key];
                    if (typeof configItem.options[key] === "object") {
                      objTemp[key] = JSON.parse(
                        JSON.stringify(configItem.options[key])
                      );
                    }
                  }
                }
                inputItemConfigs.splice(inputItemIndex, 1, objTemp); // 使vue侦听数据变化
                inputItem = inputItemConfigs[inputItemIndex];
                let newItem = this.componentDeepClone(configItem);
                newItem.uuid = generateUUID();
                newItem.options = inputItem;
                newItem.options.commonConfigAssignSign = newItem.uuid;
                newItem.options.commonConfigAssignName = newItem.name;
                inputItemComponentConfigs[inputItemIndex] = newItem;
                this.options.reloadView = false;
                this.$nextTick(() => {
                  this.options.reloadView = true;
                });
              }
            } else if (
              inputItemComponentConfigs[inputItemIndex] &&
              inputItemComponentConfigs[inputItemIndex].options
            ) {
              inputItemComponentConfigs[inputItemIndex].options = inputItem;
            }
          });
        }
      });
    },
    addComponentItem(colIndex, index) {},
    cloneComponentItem(index) {
      let el = this.options.columns[0].componentList[index];
      let newEl = this.componentCopyConfig(
        componentsAllConfigs,
        el.type,
        el.options
      );
      newEl.uuid = generateUUID();
      newEl.options.commonConfigAssignSign = newEl.uuid;
      this.options.columns[0].componentList.splice(index + 1, 0, newEl);
      // 选中当前复制的组件
      store.dispatch('app/changeMobileDesignComponentUUID', newEl.uuid)
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', newEl)
    },
    /************** end *************/
    onChangeChooseItemIndex(colIndex, index, uuid) {
      store.dispatch("app/changeMobileDesignComponentUUID", uuid);
      // let currentWidgetComponentConfig = this.options.inputItemComponentConfigs[colIndex]
      let currentWidgetComponentConfig = this.options.columns[0].componentList[
        index
      ];
      EventBus.$emit(
        "onChangeCurrentWidgetComponentConfig",
        currentWidgetComponentConfig
      );
    },
    deleteComponentItem(index) {
      this.options.columns[0].componentList.splice(index, 1);
    },
    handleComponentConfig(
      componentConfigList,
      componentList,
      isResetUUID = false
    ) {
      componentConfigList.forEach((item) => {
        let type = item.type;
        if (
          coverBigComponent.indexOf(type) !== -1 &&
          item.options.columns &&
          item.options.columns.length
        ) {
          item.options.columns.forEach((columns) => {
            if (columns.componentList && columns.componentList.length) {
              // let tempComponentList = [];
              this.handleComponentConfig(
                columns.componentList,
                componentList,
                isResetUUID
              );
              // columns.componentList = tempComponentList;
            }
          });
        }
        if (
          item.type == "van-design-field" ||
          item.type == "van-design-select" ||
          item.type == "van-design-radio"
        ) {
          componentList.push(item);
        }
      });
    },
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
