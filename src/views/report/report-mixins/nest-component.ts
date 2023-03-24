import store from '@/store'
import { EventBus } from "@/util/event-bus.js";
import { generateUUID } from "@/views/report/utils/index.js";
import {getStorage,setStorage} from "@/util/storageUtil.js";
let nestComponentBasicsMethods = {
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
    onDragMoveStart(el, colIndex) {
      this.options.fixDynamicComponentConfig.isToRender = false
      this.options.fixDynamicComponentConfig.currentDragIndex = el.oldIndex
      this.options.fixDynamicComponentConfig.currentDragColIndex = colIndex

      this.componentDragMoveStart = true
    },
    onDragMoveEnd(el, componentList) {
      this.options.fixDynamicComponentConfig.isToRender = true
      this.options.fixDynamicComponentConfig.currentDragIndex = 9999 // 其实重置9999并没有啥作用，只是图个心安，通过模板的三个||基本不会有问题
      this.options.fixDynamicComponentConfig.currentDragColIndex = 9999

      // 保存操作记录（移动）
      if (this.componentDragMoveStart) {
        let oldIndex = el.oldIndex
        let newIndex = el.newIndex
        let componentConfigItem = componentList[newIndex] || {}
        if (componentConfigItem) {
          let stackItem = {
            uuid: componentConfigItem.uuid,
            componentConfig: componentConfigItem,
            newComponentList: componentList,
            oldComponentList: componentList,
            oldComponentIndex: oldIndex,
            isMove: true,
            moveType: 'layout'
          }
          this.$globalData.operateStack.push(stackItem)
        }
        this.componentDragMoveStart = false
      } else {
        // let stackItem = this.$globalData.operateStack[this.$globalData.operateStack.length - 1]
        // stackItem.oldComponentList = this.componentList
        // stackItem.oldComponentIndex = el.oldIndex
      }
    },
    onDragMoveAdd(el, componentList) {
      // console.log('xxxx', el, componentList)
      // pullMode等于true时代表有组件从其他地方拖入当前组件内（非新组件）
      if (el.pullMode === true) {
        // 为什么使用延时器，因为需要在其他一切数据准备完毕之后再来进行下面的操作
        setTimeout(() => {
          let operateStackItem = this.$globalData.operateStack[this.$globalData.operateStack.length - 1]
          if (operateStackItem) {
            let newIndex = el.newIndex
            let componentConfigItem = componentList[newIndex] || {}
            operateStackItem.uuid = componentConfigItem.uuid
            operateStackItem.newComponentList = componentList
            operateStackItem.componentConfig = componentConfigItem
            // operateStackItem.moveType = 'layout'
            // console.log(operateStackItem, this.$globalData.operateStack)
          }
        }, 0)
      }
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
      // }, 0)
    },
    /************** end *************/
    copyComponentItem(colIndex, index) {
      this.currentComponentConfigList = this.options.columns[colIndex].componentList
      // this.options.currentColumns = this.options.columns[colIndex]
      let currentWidgetComponentConfig = this.currentComponentConfigList[index];
      // 直接把 这个le 放到storage里面
      setStorage("clipboard", JSON.stringify(currentWidgetComponentConfig))
    },
    pasteComponentItem(colIndex, index) {
      let clipboard = getStorage("clipboard") || "";
      let parseInfo = JSON.parse(clipboard);
      let newEl = this.componentCopyConfig(this.componentsConfigs, parseInfo.type, parseInfo.options)
      newEl.uuid = generateUUID()
      newEl.options.commonConfigAssignSign = newEl.uuid
      this.currentComponentConfigList = this.options.columns[colIndex].componentList
      this.currentComponentConfigList.splice(index + 1, 0, newEl)
    },
    onChangeChooseItemIndex(colIndex, index, uuid) {

      store.dispatch('app/changeMobileDesignComponentUUID', uuid)
      this.currentComponentConfigList = this.options.columns[colIndex].componentList
      // this.options.currentColumns = this.options.columns[colIndex]
      let currentWidgetComponentConfig = this.currentComponentConfigList[index];
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', currentWidgetComponentConfig)
    },
    deleteComponentItem(index) {
      this.currentComponentConfigList.splice(index, 1);
    },
    cloneComponentItem(index) {
      let el = this.currentComponentConfigList[index];
      let newEl = this.componentCopyConfig(this.componentsConfigs, el.type, el.options)
      newEl.uuid = generateUUID()
      newEl.options.commonConfigAssignSign = newEl.uuid
      this.currentComponentConfigList.splice(index + 1, 0, newEl);
      // 选中当前复制的组件
      store.dispatch('app/changeMobileDesignComponentUUID', newEl.uuid)
      EventBus.$emit('onChangeCurrentWidgetComponentConfig', newEl)
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
      this.swapArray(index, -1)
    },
    moveToBottomComponentItem(index) {
      this.swapArray(index, this.currentComponentConfigList.length)
    },
    // moveOutComponentItem(index) {
    //   let currentComp = this.currentComponentConfigList[index]
    //   EventBus.$emit('moveOutComponentItem', currentComp)
    //   // this.$emit('moveOutComponentItem', this.elIndex, currentComp)
    // },
    moveInComponentItem(index) {
      //判断上一个组件是否是栅格，若是，则移入
      if (index < 1) {
        return
      }
      let compCurrent = this.currentComponentConfigList[index];
      let compTarget = this.currentComponentConfigList[index - 1]
      if (compTarget.type !== 'van-design-layout'
        && compTarget.type !== 'van-design-tabs'
        && compTarget.type !== 'van-design-list'
        && compTarget.type !== 'van-design-collapse') {
        return;
      }
      compTarget.options.columns[0].currentComponentConfigList.push(compCurrent)
      this.currentComponentConfigList.splice(index, 1)
    },
    insertComponentItem(index, comp) {
      console.log('insertComponentIteminsertComponentItem');
      this.currentComponentConfigList.splice(index + 1, 0, comp)
    },
    swapArray(index1, index2) {
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
  }
}

export {
  nestComponentBasicsMethods
}
