// import Vue from 'vue'
import { removeLocalData, saveAndUpdateLocalData } from '@/views/report/utils/deal-data-cache/index'
import { generateUUID } from "@/views/report/utils/index.js";
import { coverBigComponent } from "@/views/report/utils/common-const";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import { getReportDetail } from "@/api/chartsData.js";
import {
  getProcesseDataList,
  getOpenDatasetResult,
  getOpenDataTableResult,
} from "@/api/chartsData.js";
import { dataSaveV4Service } from "@/api/database";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default class WatchPageEvent {
  vm: any
  componentsConfigs: any
  subpageList: any
  uuidComponentList: any
  popupConfig: any
  deviceType: string
  // popupSubPageConfigList: any

  constructor(vm, componentsConfigs, subpageList, uuidComponentList, popupConfig, deviceType) {
    // super()
    this.vm = vm
    this.componentsConfigs = componentsConfigs
    this.subpageList = subpageList
    this.uuidComponentList = uuidComponentList
    this.popupConfig = popupConfig
    this.deviceType = deviceType
    // this.popupSubPageConfigList = popupSubPageConfigList
    // console.log(this.popupConfig)
  }

  componentDeepClone = componentDeepClone

  init(resData) {
    this.handleEventFunc(resData)
  }

  handleEventFunc(resData) {
    let execControl = {
      isPause: false,
      nextAction: [],
    }
    let eventDataPackage = resData.detail.data;
    let actionList = eventDataPackage.actionList || [];
    actionList.every((actionItem, index) => {
      // 2022-02-10 这一步 是为了阻塞 后方便回调 处理的逻辑，把action 切割开，然后继续执行
      let tempActionList = eventDataPackage.actionList;
      let nextAction = tempActionList.slice(index + 1, tempActionList.length);
      execControl.nextAction = nextAction
      if (execControl.isPause) {
        delayExecEventAction(this, actionItem, execControl)
      } else {
        return this.execEventAction(actionItem, execControl)
      }
      return true;


      // delayExecEventAction
      function delayExecEventAction(vm, actionItem, execControl) {
        setTimeout(() => {
          if (execControl.isPause) {
            return delayExecEventAction(vm, actionItem, execControl)
          }
          vm.execEventAction(actionItem, execControl)
        }, 1000)
      }
    });
  }
  execEventAction(actionItem, execControl) {
    console.log("execEventAction", actionItem);
    let operateEventType = actionItem.actionType;
    let operateHrefPageId = actionItem.operateHrefPageId;
    let operateRefresh = actionItem.operateRefresh;
    let operateApiId = actionItem.operateApiId;
    let operateDisplay = actionItem.operateDisplay;
    let displayAction = actionItem.displayAction;
    let statusActionList = actionItem.statusActionList;
    if (operateEventType === "event-operate-href" || operateEventType === 'event-operate-close-page') {
      setTimeout(() => {
        let hrefPageParams = actionItem.interfaceDataConfig.hrefPageParams || []
        this.uuidComponentList.forEach((uuidComponent) => {
          hrefPageParams.forEach(paramsItem => {
            let operateHrefPageParamType = paramsItem.param_value_type
            let relevanceComponentUuid = paramsItem.relevanceComponentUuid
            //
            if (operateHrefPageParamType === 'T') {
              if (relevanceComponentUuid === uuidComponent.uuid) {
                paramsItem.operateHrefPageParamValue = uuidComponent.options.value
              }
            } else if (operateHrefPageParamType === 'B') {
              // 绑定值
              paramsItem.operateHrefPageParamValue = paramsItem.param_value
            } else if (operateHrefPageParamType === 'V') {
              let param_v_key = paramsItem.param_v_key
              // judgmentValue = getLocalDataByKey(param_v_key)
              paramsItem.operateHrefPageParamValue = this.vm.$pageDataModelEngine.getCustomData(param_v_key)
            }
          })
        })
        this.savePageParamsLocalData(hrefPageParams)

        // if (this.deviceType === 'PC') {
        //   let url = location.href.replace(
        //     /\?id=.+/,
        //     `?id=${operateHrefPageId}`
        //   );
        //   if (!location.href.match(/\?id=.+/)) {
        //     url += `?id=${operateHrefPageId}`;
        //   }
        //   location.href = url;
        // } else {
        //   location.href = `${location.origin}/#/other?id=${operateHrefPageId}`
        //   location.reload()
        // }
        const param = {
          reportId: operateHrefPageId,
        };
        getReportDetail(param).then(res => {
          let data = res.data || {};
          let configJson = JSON.parse(data.configJson || "{}");
          if (!configJson) return false;
          let componentConfigList = configJson.list || [];
          let componentListTemp = [];
          this.handleInitComponentConfig(componentConfigList, componentListTemp);
          // let hrefPageParams = actionItem.hrefPageParams || []
          // this.savePageParamsLocalData(hrefPageParams)
          // this.vm.$emit("onChangeComponentList", componentListTemp);
          this.vm.$emit("onChangeComponentList", configJson); // TODO::: 0329 yuqing,lu修改，可能会导致一些问题
        });
      }, 100)

    } else if (operateEventType === "event-operate-href-reload") {
      // TODO
      // location.href = `${location.origin}/#/other?id=${operateHrefPageId}`
      const param = {
        reportId: operateHrefPageId,
      };
      getReportDetail(param).then(res => {
        let data = res.data || {};
        let configJson = JSON.parse(data.configJson || "{}");
        if (!configJson) return false;
        let componentConfigList = configJson.list || [];
        let componentListTemp = [];
        this.handleInitComponentConfig(componentConfigList, componentListTemp);
        let hrefPageParams = actionItem.hrefPageParams || []
        this.savePageParamsLocalData(hrefPageParams)
        // this.vm.$emit("onChangeComponentList", componentListTemp);
        this.vm.$emit("onChangeComponentList", configJson); // TODO::: 0329 yuqing,lu修改，可能会导致一些问题
      });
    } else if (operateEventType === "event-operate-href-subpage") {
      // console.log('xxxxxxxxx 子页面跳转 xxxxxxxxxxx', actionItem)
      let subpageIndex = actionItem.subpageIndex;
      let subpageItem = this.subpageList[subpageIndex];
      if (!subpageItem) return false;
      let hrefPageParams = actionItem.hrefPageParams || []
      this.uuidComponentList.forEach((uuidComponent) => {
        hrefPageParams.forEach(paramsItem => {
          let operateHrefPageParamType = paramsItem.operateHrefPageParamType
          let relevanceComponentUuid = paramsItem.relevanceComponentUuid
          if (operateHrefPageParamType === 'T') {
            if (relevanceComponentUuid === uuidComponent.uuid) {
              paramsItem.operateHrefPageParamValue = uuidComponent.options.value
            }
          }
        })
      })
      this.savePageParamsLocalData(hrefPageParams)
      // 2021-07-15 这里需要有一步操作 ，把入参塞到 pageParamsList 的对应值里面
      this.vm.$emit("onChangeComponentList", subpageItem);
    } else if (operateEventType === "event-operate-refresh") {
      this.refreshComponentData(operateRefresh);
    } else if (operateEventType === "event-operate-interface") {
      execControl.isPause = true
      setTimeout(() => { // 解决本地存储异步问题
        // let varDataObj = getLocalData()
        // @ts-ignore
        let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
        let params = {};
        let paramsConfigs = actionItem.interfaceDataConfig.paramsConfigs || [];
        paramsConfigs.forEach((paramsConfig) => {
          let paramValue = this.getActionValue(paramsConfig, varDataObj, this);
          params[paramsConfig.param_name] = paramValue; // TODO::: 待优化，要通过uuid遍历实时获取
        });
        const data = {
          dataApiId: operateApiId,
          params,
        };
        getProcesseDataList(data).then((res) => {
          if (res.code === 0) {
            // 接口调用的状态处理
            this.handleInterfaceStatus(statusActionList, res.data);
            // 2021-12-18 按照新逻辑 存取
            let interfaceName;

            let obj = {
              label: interfaceName, // 依次判断数据接口、数据表、数据集
              value: {
                type: "customInterface",
                id: operateApiId,
                data: res.data
              },
            };
            this.vm.$pageDataModelEngine.saveCustomInterfaceData(operateApiId, obj);
          }
          execControl.isPause = false
        }).catch(() => {
          execControl.isPause = false
        })
      }, 0)
    } else if (operateEventType === "event-operate-display") {
      let componentIds = operateDisplay;
      this.uuidComponentList.forEach((uuidComponent) => {
        if (componentIds.indexOf(uuidComponent.uuid) !== -1) {
          if (displayAction == 'display') {
            uuidComponent.options.commonConfig.displayHide = false
          } else if (displayAction == 'hide') {
            uuidComponent.options.commonConfig.displayHide = true
          } else {
            uuidComponent.options.commonConfig.displayHide = !uuidComponent
              .options.commonConfig.displayHide;
          }
        }
      });
    } else if (operateEventType === "event-operate-form-submit") {
      let componentIds = operateDisplay;
      this.uuidComponentList.forEach((uuidComponent) => {
        if (componentIds.indexOf(uuidComponent.uuid) !== -1) {
          this.onSubmit(uuidComponent);
        }
      });
    } else if (operateEventType === "event-operate-dialog-box") {
      // 这边加的延时是为了让传参不至于出错（容易出现上一个参数的问题）
      setTimeout(() => {
        let width = actionItem.popupWidth || 50;
        let height = actionItem.popupHeight || 50;
        let position = actionItem.popupPosition;
        let title = actionItem.popupTitle;
        // console.log(this.vm, this.popupConfig)
        this.popupConfig.position = position;
        if (["left", "right"].indexOf(position) !== -1) {
          height = 100;
          title = "";
        } else if (["top", "bottom"].indexOf(position) !== -1) {
          width = 100;
          title = "";
        } else {
        }
        this.popupConfig.widthHeightConfig = {
          width: width + "%",
          height: height,
        };
        this.popupConfig.title = title;
        // this.vm.popupSubPageConfigList = this.subpageList[subPageConfigIndex].list || [];
        // 处理弹窗的入参
        let hrefPageParams = actionItem.interfaceDataConfig.hrefPageParams || []
        console.log("event-operate-dialog-box", actionItem)
        this.uuidComponentList.forEach((uuidComponent) => {
          hrefPageParams.forEach(paramsItem => {
            let operateHrefPageParamType = paramsItem.param_value_type
            let relevanceComponentUuid = paramsItem.relevanceComponentUuid
            //
            if (operateHrefPageParamType === 'T') {
              if (relevanceComponentUuid === uuidComponent.uuid) {
                paramsItem.operateHrefPageParamValue = uuidComponent.options.value
              }
            } else if (operateHrefPageParamType === 'B') {
              // 绑定值
              paramsItem.operateHrefPageParamValue = paramsItem.param_value
            } else if (operateHrefPageParamType === 'V') {
              let param_v_key = paramsItem.param_v_key
              // judgmentValue = getLocalDataByKey(param_v_key)
              paramsItem.operateHrefPageParamValue = this.vm.$pageDataModelEngine.getCustomData(param_v_key)
            }
          })
        })
        const param = {
          reportId: operateHrefPageId,
        };
        getReportDetail(param).then(res => {
          let data = res.data || {};
          let configJson = JSON.parse(data.configJson || "{}");
          if (!configJson) return false;
          let componentConfigList = configJson.list || [];

          this.vm.popupSubPageConfigList = componentConfigList || [];
          this.vm.isShowPopup = true;
          if (position === "center") {
            this.vm.isShowPopupDialog = true
          } else {
            this.vm.isShowPopupDrawer = true;
          }
          this.vm.globalConfig = configJson.config || {};
          this.vm.pageEventConfig = configJson.eventConfig || {};
          this.vm.onOpenDialogSubComponentList(componentConfigList, hrefPageParams);
        });
      }, 50)


    } else if (operateEventType === "event-operate-close-dialog") {
      this.vm.isShowPopupDialog = false;
      this.vm.isShowPopupDrawer = false;
      this.vm.isShowPopup = false;
      this.vm.afterClose();
    } else if (operateEventType === "event-operate-logic-judgment") {
      this.handleLogicJudgment(actionItem)
    } else if (operateEventType === "event-operate-dialog-box-msg") {
      this.vm.$antdMessage.success(actionItem.popupBody)
    } else if (operateEventType === "event-operate-set") {
      console.log("event-operate-set", actionItem)
      //组件设值  1、取值  2赋值
      let value = "";
      let actionSet = actionItem.actionSet;
      if (actionSet.valueType == 'custom') {
        // 动态值
        if (actionSet.getInfo.param_value_type == 'V' && actionSet.getInfo.type == "customInterface") {
          let customInterfaceData = this.vm.$pageDataModelEngine.getCustomInterfaceData(actionSet.getInfo.operateApiId);
          if (customInterfaceData) {
            value = customInterfaceData.value.data[actionSet.getInfo.param_v_key];
          } else {
            value = actionSet.getInfo.param_value;
          }
        }
      } else if (actionSet.valueType == 'constant') {
        value = actionSet.value;
      }
      // 设值 要么是页面入参，要么是组件
      let setInfo = actionSet.setInfo;
      if (setInfo.param_value_type == 'V') {
        let hrefPageParam = {
          operateHrefPageParamName: setInfo.param_v_key,
          operateHrefPageParamValue: value
        }
        let hrefPageParams = [] as any;
        hrefPageParams.push(hrefPageParam);
        this.savePageParamsLocalData(hrefPageParams)
      }

    } else if (operateEventType === "event-operate-dialog-box-confirm") {
      let _this = this;
      this.vm.$antdConfirm({
        title: actionItem.popupBody || '确认删除?',
        onOk() {
          let obj = {
            detail: {
              data: {
                actionList: execControl.nextAction
              },
            },
          };
          execControl.nextAction.length && _this.handleEventFunc(obj);
        },
        onCancel() {

        },
      });
      return false;
    } else if (operateEventType === "event-operate-form-validate") {
      let _this = this;
      this.uuidComponentList && this.uuidComponentList.forEach(item => {
        if (item.options.required) {

          let paramValue = item.options.value;

          if (paramValue) {
            let obj = {
              detail: {
                data: {
                  actionList: execControl.nextAction
                },
              },
            };
            execControl.nextAction.length && _this.handleEventFunc(obj);
          } else {
            this.vm.$antdMessage.error(item.options.requiredMsg)
          }
        }
      })
      return false;
    } else if (operateEventType === "event-operate-main-menu-href") {
      // setStorage("fullName");
      // setStorage("token")
      let varDataObj = this.vm.$pageDataModelEngine.getCustomData()

      let paramUserValue = this.getActionValue(actionItem.paramUser, varDataObj, this);
      let paramTokenValue = this.getActionValue(actionItem.paramToken, varDataObj, this);

      // console.log("------paramUser", actionItem.paramUser, paramUserValue);
      // console.log("------paramToken", actionItem.paramToken, paramTokenValue);
      // console.log("------paramAuth", actionItem.paramAuth);
      let url = location.href;
      setStorage("token", paramTokenValue);
      setStorage("fullName", paramUserValue);
      if (url.indexOf("/#/") > -1) {
        let baseUrl = url.split("/#/")[0];
        location.href = baseUrl;
      } else {
        let baseUrl = url.split("#/")[0];
        location.href = baseUrl;
      }
    }

    return true;
  }
  /**
   * 获取行为中
   * @param paramsConfig
   * @param varDataObj
   */
  getActionValue(paramsConfig, varDataObj, vm) {
    let paramValue = "";
    let relevanceComponentUuid = paramsConfig.relevanceComponentUuid;
    let param_value_type = paramsConfig.param_value_type;
    if (param_value_type === "V") {

      if (paramsConfig.type == "customInterface") {
        let customInterfaceData = vm.vm.$pageDataModelEngine.getCustomInterfaceData(paramsConfig.operateApiId);

        if (customInterfaceData) {
          paramValue = customInterfaceData.value.data[paramsConfig.param_v_key];
        } else {
          paramValue = paramsConfig.param_value;
        }
      } else if (paramsConfig.param_v_key) {
        // 默认使用param_value
        paramValue = varDataObj[paramsConfig.param_v_key]
      }
    } else if (param_value_type === 'B') {
      // 绑定值

    } else {
      this.uuidComponentList.forEach((uuidComponent) => {
        if (uuidComponent.uuid === relevanceComponentUuid) {
          paramValue = uuidComponent.options.value;
          // 2021-02-20 临时特殊处理
          if (uuidComponent.type == "van-design-field") {
            // 这里由于 输入框 需要从接口获取值，然后修改后作为参数 传入接口，这边的处理方式就会有问题，临时先注释了
            // paramsConfig.param_value =
            //   uuidComponent.options.contentDataSource ===
            //     "radio-button-default"
            //     ? uuidComponent.options.value
            //     : uuidComponent.options.interfaceDataConfig.value;
          } else if (uuidComponent.type === "van-design-checkbox") {
            let valueStr = "";
            uuidComponent.options.value.forEach((checkValue) => {
              valueStr += checkValue + ",";
            });
            if (valueStr.length > 0) {
              valueStr = valueStr.substring(0, valueStr.length - 1);
            }
            paramValue = valueStr;
          } else if (uuidComponent.type === "van-design-upload-img") {
            let valueStr = "";
            uuidComponent.options.fileList.forEach(fileItem => {
              let response = fileItem.response;
              if (response.code == 0) {
                valueStr += response.data.fileId + ","
              }
            });
            if (valueStr.length > 0) {
              valueStr = valueStr.substring(0, valueStr.length - 1);
            }
            paramValue = valueStr;
          } else if (uuidComponent.type === "van-design-datetime-picker") {
            let dateValue = this.formatDate(new Date(uuidComponent.options.value), uuidComponent.options.format);
            paramValue = dateValue;
          } else if (uuidComponent.type === "van-design-checkbox-auth") {
            let valueStr = "";
            uuidComponent.options.values.forEach((checkValue) => {
              valueStr += checkValue + ",";
            });
            if (valueStr.length > 0) {
              valueStr = valueStr.substring(0, valueStr.length - 1);
            }
            paramValue = valueStr;
            console.log("--------van-design-checkbox-auth", valueStr)
          }
        }
      });
    }
    return paramValue;
  }
  matchComponent(uuidComponentList, relevanceComponentUuid, paramsConfig) {
    uuidComponentList.forEach((uuidComponent) => {

      if (uuidComponent.uuid === relevanceComponentUuid) {
        paramsConfig.param_value = uuidComponent.options.value;
        // 2021-02-20 临时特殊处理
        if (uuidComponent.type == "van-design-field") {
          paramsConfig.param_value = uuidComponent.options.value
        } else if (uuidComponent.type === "van-design-checkbox") {
          let valueStr = "";
          uuidComponent.options.value.forEach((checkValue) => {
            valueStr += checkValue + ",";
          });
          if (valueStr.length > 0) {
            valueStr = valueStr.substring(0, valueStr.length - 1);
          }
          paramsConfig.param_value = valueStr;
        } else if (uuidComponent.type === "van-design-upload-img") {
          let valueStr = "";
          uuidComponent.options.fileList.forEach(fileItem => {
            let response = fileItem.response;
            if (response.code == 0) {
              valueStr += response.data.fileId + ","
            }
          });
          if (valueStr.length > 0) {
            valueStr = valueStr.substring(0, valueStr.length - 1);
          }
          paramsConfig.param_value = valueStr;
        } else if (uuidComponent.type === "van-design-datetime-picker" || uuidComponent.type === "van-design-calendar") {
          let format = "YYYY-MM-DD";
          if (uuidComponent.options.format) {
            format = uuidComponent.options.format;
          }
          let dateValue = this.formatDate(new Date(uuidComponent.options.value), format);
          paramsConfig.param_value = dateValue;
        }
      }
    });
  }
  formatDate(date, fmt) {
    if (/(Y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str))
      }
    }
    return fmt
  }

  padLeftZero(str) {
    return ('00' + str).substr(str.length)
  }
  savePageParamsLocalData(hrefPageParams) {
    if (!hrefPageParams || !hrefPageParams.length) return false
    let objTemp = {}
    hrefPageParams.forEach(hrefPageParamItem => {
      let operateHrefPageParamName = hrefPageParamItem.operateHrefPageParamName || ''
      let operateHrefPageParamValue = hrefPageParamItem.operateHrefPageParamValue || ''
      objTemp[operateHrefPageParamName] = operateHrefPageParamValue
      this.vm.$pageDataModelEngine.saveCustomData(operateHrefPageParamName, operateHrefPageParamValue)
    })
    // 这两个需要保留，页面跳转需要使用
    removeLocalData()
    saveAndUpdateLocalData('hrefPageParams', objTemp)

  }

  handleInitComponentConfig(
    componentConfigList,
    componentList,
    isResetUUID = false
  ) {
    componentConfigList.forEach((item) => {
      let groupComponentOriginUUID = "";
      if (isResetUUID) {
        groupComponentOriginUUID = item.uuid;
        item.uuid = generateUUID();
        item.options && (item.options.commonConfigAssignSign = item.uuid)
      }
      if (item.groupComponentOriginUUID) groupComponentOriginUUID = item.groupComponentOriginUUID
      let componentObj = {} as any;
      let type = item.type;
      let uuid = item.uuid;
      let componentOptions = item.options;
      if (
        coverBigComponent.indexOf(type) !== -1 &&
        item.options.columns &&
        item.options.columns.length
      ) {
        item.options.columns.forEach((columns) => {
          if (columns.componentList && columns.componentList.length) {
            let tempComponentList = [];
            this.handleInitComponentConfig(
              columns.componentList,
              tempComponentList,
              isResetUUID
            );
            columns.componentList = tempComponentList;
          }
        });
      } else if (type === "van-design-group-component") {
        let tempComponentList = [];
        this.handleInitComponentConfig(
          item.options.componentList,
          tempComponentList,
          isResetUUID
        );
        item.options.componentList = tempComponentList;
      }
      this.componentsConfigs.forEach((configItems) => {
        configItems.forEach((configItem) => {
          if (configItem.type === type) {
            let newConfigItem = this.componentDeepClone(configItem);
            if (newConfigItem.options) {
              // 对options进行处理，如果模板有某个属性而当前组件没有，则给当前组件添加改属性，并赋值默认值
              for (let newConfigKey in newConfigItem.options) {
                if (componentOptions[newConfigKey] === undefined) {
                  componentOptions[newConfigKey] =
                    newConfigItem.options[newConfigKey];
                }
              }
            }
            newConfigItem.options = componentOptions;
            componentObj = this.componentDeepClone(newConfigItem);
            componentObj.uuid = uuid;
          }
        });
      });
      if (componentObj.type === "van-design-group-component") {
        // this.pageModuleList.forEach(pageModuleItem => {
        //   componentObj.options.componentList = pageModuleItem.options.componentList
        //   // this.handleGroupComponentConfig(componentObj.options.componentList, pageModuleItem.options.componentList)
        // })
      }
      if (groupComponentOriginUUID) {
        componentObj.groupComponentOriginUUID = groupComponentOriginUUID;
      }
      componentList.push(componentObj);
    });
  }
  // 接口调用的状态处理
  handleInterfaceStatus(statusActionList, resData) {
    if (!statusActionList || !statusActionList.length) return false;
    let actionList = [] as any;
    statusActionList.forEach((item) => {
      if (resData[item.statusName] == item.statusValue) {
        if (item.hrefPageParams.length > 0) {
          item.hrefPageParams[0].operateHrefPageParamValue = resData[item.hrefPageParams[0].operateHrefPageParamKey]
        }
        actionList.push(item);
      }
    });
    let obj = {
      detail: {
        data: {
          actionList,
        },
      },
    };
    actionList.length && this.handleEventFunc(obj);
  }
  // 逻辑判断的事件处理
  handleLogicJudgment(actionItem) {
    // console.log('logic', actionItem)
    let actionList = [] as any;
    let logicChildren = actionItem.logicChildren || actionItem.children || []
    let falseChildren = {}
    let trueChildren = {}
    if (logicChildren[0]._connectionLabel === '假') {
      falseChildren = logicChildren[0] || {}
      trueChildren = logicChildren[1] || {}
    } else {
      falseChildren = logicChildren[1] || {}
      trueChildren = logicChildren[0] || {}
    }
    if (judgmentAction(actionItem, this)) {
      packageActionList(trueChildren, actionList, this)
    } else {
      packageActionList(falseChildren, actionList, this)
    }
    // logicChildren.forEach(item => {
    //   packageActionList(item, actionList)
    // })
    let obj = {
      detail: {
        data: {
          actionList,
        },
      },
    };
    actionList.length && this.handleEventFunc(obj);

    // 组装行为list
    function packageActionList(actionItem, actionList, vm) {
      actionList.push(actionItem.actionItem)
      if (actionItem.type !== 'event-operate-logic-judgment') {
        actionItem.children && actionItem.children.forEach(item => {
          packageActionList(item, actionList, vm)
        })
        // return vm.handleLogicJudgment(actionItem)
        // actionList.push(actionItem.actionItem)
        // return false
      }
      // actionList.push(actionItem.actionItem)
      // if (actionItem.children) {
      //   actionItem.children && actionItem.children.forEach(item => {
      //     packageActionList(item, actionList, vm)
      //   })
      // }
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
  // 页面刷新，数据更新
  refreshComponentData(componentIds) {
    // componentIds.forEach(componentId => {

    // })
    this.uuidComponentList.forEach((uuidComponent) => {
      if (componentIds.indexOf(uuidComponent.uuid) !== -1) {
        this.refreshComponent(uuidComponent);
      }
    });
  }

  refreshComponent(uuidComponent) {

    // let componentType = uuidComponent.type
    uuidComponent.options.value = ''; // 数据刷新时清空该组件的value  TODO::: 可能会对引用组件值造成影响
    uuidComponent.options.pickerValue && (uuidComponent.options.pickerValue = '')
    let contentDataSource = uuidComponent.options.contentDataSource || "";
    let interfaceDataConfig: any = {};
    let interfaceList = this.vm.$pageDataModelEngine.getInterfaceData();
    interfaceList.forEach(interfaceItem => {
      if (interfaceItem.id == uuidComponent.options.interfaceDataConfig.uuid) {
        interfaceDataConfig = interfaceItem.data
      }
    })
    if (!interfaceDataConfig) {
      return false;
    }
    let apiId = interfaceDataConfig.id; // 接口id、或数据集、数据表id
    let dbConfigId = interfaceDataConfig.dbConfigId;
    let dataSetName = interfaceDataConfig.dataSetName;
    let tableName = interfaceDataConfig.tableName;
    let apiKey = uuidComponent.options.interfaceDataConfig.key;
    if (contentDataSource === "radio-button-interface") {
      let params = {};
      let paramsConfigs = interfaceDataConfig.paramsConfigs || [];
      paramsConfigs.forEach((paramsConfig) => {
        let relevanceComponentUuid = paramsConfig.relevanceComponentUuid;
        let param_value_type = paramsConfig.param_value_type;
        if (param_value_type === "V") {
          // 默认使用param_value
        } else {
          this.matchComponent(this.uuidComponentList, relevanceComponentUuid, paramsConfig)
          this.subpageList.forEach((subList) => {
            let ucList = subList.list
            this.matchComponent(ucList, relevanceComponentUuid, paramsConfig)
          });
        }

        params[paramsConfig.param_name] = paramsConfig.param_value; // TODO::: 待优化，要通过uuid遍历实时获取
      });
      const data = {
        dataApiId: apiId,
        params,
      };
      getProcesseDataList(data).then((res) => {
        if (res.code === 0) {
          // this.interfaceKeyList = []
          let interfaceData = res.data;
          // interfaceDataConfig.value = interfaceData[apiKey]
          this.vm.$set(interfaceDataConfig, "value", interfaceData[apiKey]);
          if (typeof interfaceData[apiKey] == 'string' || typeof interfaceData[apiKey] == 'number') {
            uuidComponent.options.interfaceDataConfig.value = interfaceData[apiKey]
          }
          interfaceDataConfig.tableData && (interfaceDataConfig.tableData = interfaceData[apiKey]);
          interfaceDataConfig.chartData &&
            (interfaceDataConfig.chartData.rows = interfaceData[apiKey]);
          if (uuidComponent.type == 'van-design-table') {
            uuidComponent.options.interfaceDataConfig.tableData = interfaceData[uuidComponent.options.interfaceDataConfig.key] || [];
          }
          // for (const i in res.data) {
          //     this.interfaceKeyList.push(i)
          // }
          // if (componentType === 'van-design-select' && interfaceDataConfig.tableData && interfaceDataConfig.tableData.length) {
          //   uuidComponent.options.columnsStrArr = []
          //   interfaceDataConfig.tableData.forEach(item => {
          //     // let label = item.label
          //     uuidComponent.options.columnsStrArr.push(item)
          //   })
          // }
        } else {
          // Toast.fail(res.message);
        }
      });
    } else if (contentDataSource === "radio-button-dataset") {
      let _this = this;
      setTimeout(function () {
        let queryConfigs = interfaceDataConfig.queryConfigs || [];
        let conditionList = [] as any;
        queryConfigs.forEach((queryConfig) => {
          if (!queryConfig.param_name) return false;
          let relevanceComponentUuid = queryConfig.relevanceComponentUuid;
          let param_value_type = queryConfig.param_value_type;
          if (param_value_type === "V") {
            // 默认使用param_value
            // queryConfig.param_value=getLocalDataByKey(queryConfig.param_name);
            queryConfig.param_value = this.vm.$pageDataModelEngine.getCustomData(queryConfig.param_name)
          } else {
            _this.matchComponent(_this.uuidComponentList, relevanceComponentUuid, queryConfig)
            _this.subpageList.forEach((subList) => {
              let ucList = subList.list
              _this.matchComponent(ucList, relevanceComponentUuid, queryConfig)
            });
          }
          let obj = {
            columnName: queryConfig.param_name,
            columnAlias: queryConfig.param_name,
            columnType: queryConfig.fieldType,
            operator: queryConfig.operator,
            conditionVal: queryConfig.param_value,
            conditionType: queryConfig.param_value_type,
          };
          conditionList.push(obj);
        });
        let params = {
          id: apiId,
          name: dataSetName,
          conditionList,
          page: {
            pageIndex: 1,
            pageSize: 10,
          },
          orderBy: [],
        };
        getOpenDatasetResult(params).then((res) => {
          if (uuidComponent.type == 'van-design-table') {
            let pagination = uuidComponent.options.pagination || {};
            pagination.total = res.totalNumber;
            pagination.current = res.pageIndex;
          }

          interfaceDataConfig.tableData && (interfaceDataConfig.tableData = res.dataList || []);
          interfaceDataConfig.chartData && (interfaceDataConfig.chartData.rows = res.dataList || []);
        });
      }, 50)

    } else if (contentDataSource === "radio-button-tables") {
      let _this = this;
      setTimeout(function () {
        let queryConfigs = interfaceDataConfig.queryConfigs || [];
        let conditionList = [] as any;
        queryConfigs.forEach((queryConfig) => {

          if (queryConfig.param_value_type == "V") {
            //2021-04-29
            // queryConfig.param_value = getLocalDataByKey(queryConfig.param_name);
            queryConfig.param_value = this.vm.$pageDataModelEngine.getCustomData(queryConfig.param_name)
          } else {
            let relevanceComponentUuid = queryConfig.relevanceComponentUuid;
            _this.matchComponent(_this.uuidComponentList, relevanceComponentUuid, queryConfig)
            _this.subpageList.forEach((subList) => {
              let ucList = subList.list
              _this.matchComponent(ucList, relevanceComponentUuid, queryConfig)
            });
          }
          if (!queryConfig.param_name || !queryConfig.operator || !queryConfig.param_value) return false

          let obj = {
            columnName: queryConfig.param_name,
            columnAlias: queryConfig.param_name,
            columnType: queryConfig.fieldType,
            operator: queryConfig.operator,
            conditionVal: queryConfig.param_value,
            conditionType: queryConfig.param_value_type,
          };
          conditionList.push(obj);
        });
        let params = {
          id: interfaceDataConfig.businessId,
          name: tableName,
          conditionList,
          page: {
            pageIndex: 1,
            pageSize: 10,
          },
          orderBy: [],
        };
        getOpenDataTableResult(params).then((res) => {
          if (uuidComponent.type == 'van-design-table') {
            let pagination = uuidComponent.options.pagination || {};
            pagination.total = res.totalNumber;
            pagination.current = res.pageIndex;
          }
          //2021-12-21 不知道为啥 刷新数据突然不刷新 表格了，这边临时处理了下
          uuidComponent.options.interfaceDataConfig.tableData = res.dataList || [];
        });
      }, 50);
    }
  }

  // 表单提交
  onSubmit(uuidComponent) {
    let inputComponentList = [];
    this.handleComponentConfig(
      uuidComponent.options.columns[0].componentList,
      inputComponentList
    );
    let fieldList: any[] = [];
    inputComponentList.forEach((item: any) => {
      let inputItem;
      if (item.type === "van-design-checkbox") {
        let valueStr = "";
        item.options.value.forEach((checkValue) => {
          valueStr += checkValue + ",";
        });
        if (valueStr.length > 0) {
          valueStr = valueStr.substring(0, valueStr.length - 1);
        }
        inputItem = {
          fieldName: item.options.databaseField,
          fieldValue: valueStr,
        };
      } else {
        inputItem = {
          fieldName: item.options.databaseField,
          fieldValue: item.options.value,
        };
      }
      fieldList.push(inputItem);
      // console.log(item.options.databaseField,item.options.value);
    });
    let params: any = {
      dbConfigId: uuidComponent.options.interfaceDataConfig.dbConfigId,
      tableName: uuidComponent.options.interfaceDataConfig.tableName,
      fieldList,
    };
    // 2021-05-17 修改primaryKey 为读取 interfaceDataConfig queryConfigs
    if (uuidComponent.options.primaryKey) {
      if (uuidComponent.options.param_value_type === 'V') {
        if (uuidComponent.options.param_v_key) {
          // TODO
          uuidComponent.options.primaryKey = this.vm.$pageDataModelEngine.getCustomData(uuidComponent.options.param_v_key)
        }
      }
      params.id = uuidComponent.options.primaryKey;

    }

    dataSaveV4Service(params).then((res: any) => {
      if (res.code == 0) {
        //成功
        this.vm.$antdMessage.success('表单保存成功')
        // Message({
        //   message: "表单保存成功",
        //   type: "success",
        //   duration: 3 * 1000,
        // });
      } else {
        //失败
        this.vm.$antdMessage.error('表单保存失败')
        // Message({
        //   message: "表单保存失败",
        //   type: "error",
        //   duration: 3 * 1000,
        // });
      }
    });
  }

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
        item.type == "van-design-radio" ||
        item.type == "van-design-checkbox"
      ) {
        componentList.push(item);
      }
    });
  }
}
