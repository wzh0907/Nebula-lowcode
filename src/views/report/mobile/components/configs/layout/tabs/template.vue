<template>
  <div :class="['layout-template-page',options.position==='bottom'?'tab_bottom_postion':options.position==='left'?'tab_left_postion':options.position==='right'?'tab_right_postion':'']">
    <van-tabs
      v-model="options.active"
      :type="options.type"
      :scrollspy="options.scrollspy"
    >
      <van-tab :title="col.value" v-for="(col, colIndex) in options.columns" :key="colIndex"
      >
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
      </van-tab>
    </van-tabs>
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
import { transformComponentConfigSimpleToFullV2 } from '@/views/report/utils/deal-component-data/transform-component-config-2.0'
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
            if (item.type === "van-design-group-component") {
              return this.handleGroupComponentUUID(item, componentList, index);
            }
            if (!item.uuid) {
              let newItem = this.componentDeepClone(item);
              newItem.uuid = generateUUID()
              newItem.options.commonConfigAssignSign = newItem.uuid
              componentList[index] = newItem
                // 保存操作记录
              this.$globalData.operateStack.push({
                uuid: newItem.uuid,
                componentList,
                isAdd: true,
              });
            }else {

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
          })
        })
      },
    },
  },
  // watch: {
  //   'options.columns'(val){
  //     console.log('==============')
  //     this.options.isTest = false
  //     this.$nextTick(() => {
  //       setTimeout(() => {
  //         this.options.isTest = true
  //       }, 1000)
  //     })
  //   }
  // },
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
    // 监听事件
    // EventBus.$on('onAddChildrenComponentConfig', data => {
    //   if (this.options.isChangeComponentConfig) {
    //     this.options.isChangeComponentConfig = false
    //     this.addComponentConfig(data)
    //   }
    // })
  },
  methods: {
    changeTabs(e) {
      this.options.selectIndex = e
    },
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
    handleGroupComponentUUID(itemTemp, mainComponentList, mainIndex) {
      if (itemTemp.uuid) return false;
      let groupComponentItem = this.componentDeepClone(itemTemp);
      let componentList = [];
      groupComponentItem.uuid = generateUUID();
      groupComponentItem.options.commonConfigAssignSign = groupComponentItem.uuid;
      let componentConfigList = groupComponentItem.options.componentList;
      this.transformComponentConfigSimpleToFullV2(componentConfigList, componentList, this.componentsConfigs, true);
      groupComponentItem.options.componentList = componentList;
      mainComponentList[mainIndex] = groupComponentItem;
    },
    transformComponentConfigSimpleToFullV2,
    componentCopyConfig,
    componentDeepClone
  },
};
</script>

<style lang="scss" scoped>
// 设置背景色为透明
/deep/.van-tabs__nav {
  background-color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/deep/.van-tab{
  // padding: 4px;
  padding: 12px 4px;
}
/deep/.van-tabs__line{
  display: none;
}
 /deep/.van-tab--active{
  border-bottom: 2px solid #ee0a24 ;
}
// 左
.tab_left_postion{
  /deep/.van-tabs--line .van-tabs__wrap{
    height: 100%;
    flex-shrink: 0;
  }
  /deep/.van-tabs__nav{
      flex-direction: column;
  }
  /deep/.van-tabs{
    display: flex;
  }
  /deep/.van-tabs__wrap {
    overflow: hidden;
    flex-direction: column;
  }
  /deep/.van-tabs__content {
    width: 100%;
  }
}
//右
.tab_right_postion{
  /deep/.van-tabs--line .van-tabs__wrap{
    height: 100%;
  }
  /deep/.van-tabs__nav{
      flex-direction: column;
  }
  /deep/.van-tabs{
    display: flex;
    flex-direction: row-reverse;
  }
}
// 下
.tab_bottom_postion{
  /deep/.van-tabs {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
  }
}
</style>
