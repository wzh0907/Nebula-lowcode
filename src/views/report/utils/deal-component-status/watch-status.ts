import {saveVariable,getVariable} from '@/views/report/utils/deal-global-variable/globalUtils'
export default class WatchStatus {
    vm: any
    backItem: any
    constructor(vm, backItem) {
        // super()
        this.vm = vm
        this.backItem = backItem
      }

      init(statusEventList) {
        this.handleNewEventFunc(statusEventList)
      }
      handleNewEventFunc(statusEventList) {
        statusEventList&&statusEventList.every((node, index) => {
          // 找到开始节点
          if (node.type === 'start') {
            // 执行方法 并找到next 节点执行
            this.nextEvent(node, statusEventList)
          }
        });
      }
      /**
   * 跳转控制器，
   * @param currenNode
   * @param actionList
   * @param judgment
   */
  nextEvent(currenNode, actionList, judgment?: Boolean) {
    //遍历出下一个事件执行节点
    actionList && actionList.forEach(node => {
      if (typeof judgment == 'undefined') {
        if (currenNode.outputs[0].next == node.id) {
          this.execNewEventAction(node, actionList)
        }
      } else if (judgment) {
        currenNode.outputs.forEach(oItem => {
          if (oItem.title == 'True' && oItem.next == node.id) {
            this.execNewEventAction(node, actionList)
          }
        });
      } else {
        currenNode.outputs.forEach(oItem => {
          if (oItem.title == 'False' && oItem.next == node.id) {
            this.execNewEventAction(node, actionList)
          }
        });
      }

    })
  }

  execNewEventAction(node, actionList) {
    let actionItem = node.properties;
    let isPause = false;
    console.log("execNewEventAction", actionItem);
    isPause = true;
    let operateStatusType = actionItem.actionType;
    if (operateStatusType === "status-operate-if") {
        this.handleLogicJudgment(node, actionList)
    }else if(operateStatusType === "status-operate-set"){

    }else if(operateStatusType === "status-operate-show"){

    }else if(operateStatusType === "status-operate-color"){
        this.backItem.textColor=actionItem.textColor;
        this.backItem.textBgColor=actionItem.textBgColor;
    }
    if (!isPause) {
        this.nextEvent(node, actionList)
      }
  }

  handleLogicJudgment(node, actionList){
    let actionItem = node.properties;
    if (judgmentAction(actionItem, this)) {
      this.nextEvent(node, actionList, true)
    } else {
      this.nextEvent(node, actionList, false)
    }

    // 逻辑判断方法
    function judgmentAction(actionItem, vm) {
      let logicValue = actionItem.logicValue
      let logicOperator = actionItem.logicOperator
      let judgmentValue

      if (actionItem.param_value_type === 'T') {
        let relevanceComponentUuid = actionItem.relevanceComponentUuid
        let componentItem
        vm.uuidComponentList.forEach(uuidComponent => {
          if (uuidComponent.uuid === relevanceComponentUuid) {
            componentItem = uuidComponent
          }
        })
        if (componentItem) {
          judgmentValue = componentItem.options.value
        }
      } else if (actionItem.param_value_type === 'V') {
        let param_v_key = actionItem.param_v_key
        // 动态值
        if (actionItem.type == "customInterface") {
          let customInterfaceData = vm.vm.$pageDataModelEngine.getCustomInterfaceData(actionItem.operateApiId);
          if (customInterfaceData) {
            judgmentValue = customInterfaceData.value.data[actionItem.param_v_key];
          } else {
            judgmentValue = actionItem.param_value;
          }
        } else {
          // judgmentValue = getLocalDataByKey(param_v_key)
          judgmentValue = vm.vm.$pageDataModelEngine.getCustomData(param_v_key)
        }
      } else if (actionItem.param_value_type === 'B') {
        judgmentValue = vm.backItem.tableRowData[actionItem.param_v_key]
      } else if(actionItem.param_value_type === 'G'){
        judgmentValue = getVariable(actionItem.middle,actionItem.param_v_key)
      }
      if (logicOperator === '=') {
        // 使用弱等于因为从输入框拿到的都是字符串类型
        return judgmentValue == logicValue
      } else if (logicOperator === '!=') {
        return judgmentValue != logicValue
      } else if (logicOperator === '>') {
        return judgmentValue > logicValue
      } else if (logicOperator === '>=') {
        return judgmentValue >= logicValue
      } else if (logicOperator === '<') {
        return judgmentValue < logicValue
      } else if (logicOperator === '<=') {
        return judgmentValue <= logicValue
      } else if (logicOperator === 'isNull') {
        return !judgmentValue
      } else if (logicOperator === 'isNotNull') {
        return judgmentValue
      }
    }
  }
}