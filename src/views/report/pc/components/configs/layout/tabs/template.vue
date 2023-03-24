<template>
  <div class="layout-template-page">
    <a-tabs
      v-model="options.active"
      :type="options.type"
      :tabPosition="options.tabPosition"
    >
      <a-tab-pane :tab="col.value" v-for="(col, colIndex) in options.columns" :key="colIndex">
        <draggable
          style="height: 100%"
          v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          v-model="col.componentList"
          :no-transition-on-drag="true"
          @add="onDragAddComponentEvent(colIndex)"
          @start="onDragMoveStart($event, colIndex)"
          @end="onDragMoveEnd"
        >
          <transition-group name="fade" tag="div" style="min-height: 50px;">
            <div v-for="(item, key) in col.componentList" :key="key">
              <div
                v-if="options.fixDynamicComponentConfig.isToRender
                || options.fixDynamicComponentConfig.currentDragColIndex !== colIndex
                || options.fixDynamicComponentConfig.currentDragIndex !== key
                || options.coverBigComponent.indexOf(item.type) !== -1"
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
                  @chooseItemIndex="onChangeChooseItemIndex(colIndex, key, item.uuid)"
                  @deleteComponentItem="deleteComponentItem"
                  @cloneComponentItem="cloneComponentItem"
                  @addComponentItem="addComponentItem(colIndex, key, item.uuid)"
                  @moveUpComponentItem="moveUpComponentItem"
                  @moveDownComponentItem="moveDownComponentItem"
                  @moveToTopComponentItem="moveToTopComponentItem"
                  @moveToBottomComponentItem="moveToBottomComponentItem"
                  @insertComponentItem="insertComponentItem"
                />
              </div>
            </div>
          </transition-group>
          <!-- <div style="height: 50px;" v-if="!col.componentList.length"></div> -->
        </draggable>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import store from '@/store'
import Draggable from "vuedraggable";
import DynamicComponent from "../../../dynamic-component.vue";
import DynamicComponentLib from "../../../../generate-component/dynamic-component.vue";
import { EventBus } from "@/util/event-bus.js";
import { componentDeepClone } from '@/views/report/utils/deal-component-data/deep-clone-component-config'
import optionsConfig from './options-config'
import { generateUUID } from "@/views/report/utils/index.js";
import componentsConfigs from "../../../../components/configs/index";
import { componentCopyConfig } from '@/views/report/utils/deal-component-data/copy-component-config'

export default {
  name: "tabsTemplate",
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
      currentComponentConfigList: []
    };
  },
  watch: {
    'options.columns': {
      deep: true,
      handler(val) {
        val.forEach(parentItem => {
          let componentList = parentItem.componentList || []
          componentList.forEach((item, index) => {
            if (!item.uuid) {
              let newItem = this.componentDeepClone(item);
              newItem.uuid = generateUUID()
              newItem.options.commonConfigAssignSign = newItem.uuid
              componentList[index] = newItem
            }
          })
        })
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
    onDragMoveStart(el, colIndex){
      this.options.fixDynamicComponentConfig.isToRender = false
      this.options.fixDynamicComponentConfig.currentDragIndex = el.oldIndex
      this.options.fixDynamicComponentConfig.currentDragColIndex = colIndex
    },
    onDragMoveEnd(){
      this.options.fixDynamicComponentConfig.isToRender = true
      this.options.fixDynamicComponentConfig.currentDragIndex = 9999 // 其实重置9999并没有啥作用，只是图个心安，通过模板的三个||基本不会有问题
      this.options.fixDynamicComponentConfig.currentDragColIndex = 9999
    },
    /************** end *************/
    onChangeChooseItemIndex(colIndex, index, uuid) {
      store.dispatch('app/changeMobileDesignComponentUUID', uuid)
      this.currentComponentConfigList = this.options.columns[colIndex].componentList
      let currentWidgetComponentConfig = this.currentComponentConfigList[index];
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', currentWidgetComponentConfig)
    },
    onDragAddComponentEvent(colIndex){
    },
    addComponentItem(colIndex, index) {
    },
    deleteComponentItem(index) {
      this.currentComponentConfigList.splice(index, 1);
    },
    moveUpComponentItem(index){
      if(index-1>=0 ){
        this.swapArray(index, index-1);
      }
    },
    moveDownComponentItem(index){
      if(index+1!= this.currentComponentConfigList.length ){
        this.swapArray(index, index+1);
      }

    },
    moveToTopComponentItem(index) {
      this.swapArray(index, -1)
    },
    moveToBottomComponentItem(index) {
      this.swapArray(index, this.currentComponentConfigList.length)
    },
    insertComponentItem(index, comp) {
      this.currentComponentConfigList.splice(index + 1, 0, comp)
    },
    cloneComponentItem(index) {
      let el = this.currentComponentConfigList[index];
      let newEl = this.componentCopyConfig(componentsConfigs, el.type, el.options)
      newEl.uuid = generateUUID()
      newEl.options.commonConfigAssignSign = newEl.uuid
      this.currentComponentConfigList.splice(index + 1, 0, newEl);
      // 选中当前复制的组件
      store.dispatch('app/changeMobileDesignComponentUUID', newEl.uuid)
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', newEl)
    },
    swapArray( index1, index2) {
      if (index2 < 0) {
        this.currentComponentConfigList.unshift(this.currentComponentConfigList[index1])
        this.currentComponentConfigList.splice(index1 + 1, 1)
      } else if (index2 >= this.currentComponentConfigList.length) {
        this.currentComponentConfigList.push(this.currentComponentConfigList[index1])
        this.currentComponentConfigList.splice(index1, 1)
      } else {
        this.currentComponentConfigList[index1] = this.currentComponentConfigList.splice(index2, 1, this.currentComponentConfigList[index1])[0];
      }
    },
    componentCopyConfig,
    componentDeepClone
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
