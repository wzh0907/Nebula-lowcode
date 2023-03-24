// import Vue from 'vue'
import { removeLocalData, saveAndUpdateLocalData } from '@/views/report/utils/deal-data-cache/index'
import { generateUUID } from "@/views/report/utils/index.js";
import { coverBigComponent } from "@/views/report/utils/common-const";
import { componentDeepClone } from "@/views/report/utils/deal-component-data/deep-clone-component-config";
import { transformComponentListTreeToPlan } from "@/views/report/utils/deal-component-data/transform-component-list";
import { getReportDetail } from "@/api/chartsData.js";
import axios from 'axios'
import {
  getProcesseDataList,
  getOpenDatasetResult,
  getOpenDataTableResult,
} from "@/api/chartsData.js";
import { dataSaveV4Service } from "@/api/database";
import {getStorage,setStorage} from "@/util/storageUtil.js";
import { saveVariable, getVariable } from '@/views/report/utils/deal-global-variable/globalUtils'
import eventOperateJavascript from './hooks/event-operate-javascript/index.js'
import {
  getFunctionDetail,
} from "@/api/function.js";
export default class WatchPageEventV1_0_0 {
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
    this.handleNewEventFunc(resData)
  }
  handleNewEventFunc(resData) {
    let eventDataPackage = resData.detail.data;
    let actionList = eventDataPackage.actionList || [];
    actionList.every((node, index) => {
      // 找到开始节点
      if (node.type === 'start') {
        // 执行方法 并找到next 节点执行
        this.nextEvent(node, actionList)
      }
    });
  }
  execNewEventAction(node, actionList) {
    let actionItem = node.properties;
    let isPause = false;
    console.log("execNewEventAction", actionItem);
    let operateEventType = actionItem.actionType;
    let operateHrefPageId = actionItem.operateHrefPageId;
    let operateRefresh = actionItem.operateRefresh;
    let operateApiId = actionItem.operateApiId;
    let operateDisplay = actionItem.operateDisplay;
    let operatePrintComponentId = actionItem.operatePrintComponentId;
    let displayAction = actionItem.displayAction;
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
            } else if(operateHrefPageParamType === 'G'){
              paramsItem.operateHrefPageParamValue = getVariable(paramsItem.middle,paramsItem.param_v_key)
            }
          })
        })
        this.savePageParamsLocalData(hrefPageParams)
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
      isPause = true
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
          this.nextEvent(node, actionList)
        }).catch(() => {

        })
      }, 0)
    } else if (operateEventType === "event-operate-function") {
      isPause = true
      // @ts-ignore
      let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
      getFunctionDetail({
        businessId: actionItem.operateApiId
      }).then(res => {
        console.log('res', JSON.stringify(res))
        let params = []
        let paramsConfigs = actionItem.interfaceDataConfig.paramsConfigs || [];
        paramsConfigs.forEach((paramsConfig) => {
          let paramValue = this.getActionValue(paramsConfig, varDataObj, this)
          // @ts-ignore
          params.push(paramValue)
        })
        // for (const param of this.params) {
        //   values.push(param.value)
        // }
        let func = new Function('return ' + res.data.scheme)
        let result = func()(...params)
        this.vm.$pageDataModelEngine.saveCustomInterfaceData(
          'function-' + actionItem.operateApiId,
          result
        )
        this.nextEvent(node, actionList)
      })
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
      isPause = true
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
          this.popupConfig.widthHeightConfig = {
            width: width + "%",
            height: height + '%',
          };
        } else if (["top", "bottom"].indexOf(position) !== -1) {
          width = 100;
          title = "";
          this.popupConfig.widthHeightConfig = {
            width: width + "%",
            height: height + '%',
          };
        } else {
          this.popupConfig.widthHeightConfig = {
            width: width + "%",
            height: height,
          };
        }
        this.popupConfig.title = title;
        // this.vm.popupSubPageConfigList = this.subpageList[subPageConfigIndex].list || [];
        // 处理弹窗的入参
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
            } else if (operateHrefPageParamType === 'G') {
              paramsItem.operateHrefPageParamValue = getVariable(paramsItem.middle,paramsItem.param_v_key)
            }
          })
        })
        // this.savePageParamsLocalData(hrefPageParams)
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
          this.nextEvent(node, actionList)
        });
      }, 50)
    } else if (operateEventType === "event-operate-close-dialog") {
      this.vm.isShowPopupDialog = false;
      this.vm.isShowPopupDrawer = false;
      this.vm.isShowPopup = false;
      this.vm.afterClose();
    } else if (operateEventType === "event-operate-logic-judgment") {
      isPause = true;
      this.handleLogicJudgment(node, actionList)
    } else if (operateEventType === "event-operate-dialog-box-msg") {
      // 1
      let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
      if (actionItem.actionSet != undefined && actionItem.actionSet != null && actionItem.actionSet.valueType == 'custom') {
        let value = "";
        value = this.getActionValue(actionItem.actionSet.getInfo,varDataObj,this);
        // let actionSet = actionItem.actionSet;
        // if (actionSet.getInfo.param_value_type == 'V' && actionSet.getInfo.type == "customInterface") {
        //   let customInterfaceData = this.vm.$pageDataModelEngine.getCustomInterfaceData(actionSet.getInfo.operateApiId);
        //   if (customInterfaceData) {
        //     value = customInterfaceData.value.data[actionSet.getInfo.param_v_key];
        //   } else {
        //     value = actionSet.getInfo.param_value;
        //   }
        // } else if (actionSet.getInfo.param_value_type  === 'V') {
        //   let param_v_key = actionSet.getInfo.param_v_key
        //   // judgmentValue = getLocalDataByKey(param_v_key)
        //   value = this.vm.$pageDataModelEngine.getCustomData(param_v_key)
        // } else if (actionSet.getInfo.param_value_type == 'T') {
        //   this.matchComponent(this.uuidComponentList, actionSet.getInfo.relevanceComponentUuid, actionSet.getInfo)
        //   value = actionSet.getInfo.param_value
        // } else if(actionSet.getInfo.param_value_type == 'G'){
        //   value = getVariable(actionSet.getInfo.middle,actionSet.getInfo.param_v_key)
        // } else {
        //   value = actionSet.getInfo.param_value;
        // }
        this.vm.$antdMessage.success(value)
      } else {
        this.vm.$antdMessage.success(actionItem.popupBody)
      }
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
        } else if (actionSet.getInfo.param_value_type  === 'V') {
          let param_v_key = actionSet.getInfo.param_v_key
          // judgmentValue = getLocalDataByKey(param_v_key)
          value = this.vm.$pageDataModelEngine.getCustomData(param_v_key)
        } else if (actionSet.getInfo.param_value_type == 'T') {
          this.matchComponent(this.uuidComponentList, actionSet.getInfo.relevanceComponentUuid, actionSet.getInfo)
          value = actionSet.getInfo.param_value
        } else if(actionSet.getInfo.param_value_type == 'G'){
          value = getVariable(actionSet.getInfo.middle,actionSet.getInfo.param_v_key);
        } else if(actionSet.getInfo.param_value_type == 'F'){
          //脚本函数
          let returnMap = this.vm.$pageDataModelEngine.getCustomInterfaceData(
            'function-' + actionSet.getInfo.operateApiId
          )
          value = returnMap.get(actionSet.getInfo.param_v_key)
        } else {
          value = actionSet.getInfo.param_value;
        }
      } else if (actionSet.valueType == 'constant') {
        value = actionSet.value?actionSet.value:"";
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
      } else if (setInfo.param_value_type == 'T') {
        this.uuidComponentList.forEach((uuidComponent) => {
          if (setInfo.relevanceComponentUuid == uuidComponent.uuid) {
            if (uuidComponent.type == 'van-design-field') {
              uuidComponent.options.interfaceDataConfig.uuid = "";
              uuidComponent.options.interfaceDataConfig.value = value;
            } else if (uuidComponent.type == 'van-design-cascade'
            || uuidComponent.type == 'van-design-tree-select'
            || uuidComponent.type == 'van-design-tree') {
              uuidComponent.options.interfaceDataEchoConfig.uuid = "";
              uuidComponent.options.interfaceDataEchoConfig.value = value;
            }
            uuidComponent.options.value = value;
          }
        })
      } else if(setInfo.param_value_type == 'G'){
        saveVariable(setInfo.middle,setInfo.param_v_key,value)
      }

    } else if (operateEventType === "event-operate-dialog-box-confirm") {
      isPause = true;
      let _this = this;
      this.vm.$antdConfirm({
        title: actionItem.popupBody || '确认删除?',
        cancelText:'取消',
        okText:'确认',
        onOk() {
          _this.nextEvent(node, actionList)
        },
        onCancel() {

        },
      });
    } else if (operateEventType === "event-operate-form-validate") {
      let _this = this;
      isPause = true;
      let validate = true;
      this.uuidComponentList && this.uuidComponentList.forEach(item => {
        if (item.options.required) {
          let paramValue = item.options.value;
          if (paramValue) {

          } else {
            validate = false;
            this.vm.$antdMessage.error(item.options.requiredMsg)
          }
        }
        if (item.options.validatorTypeFunc && item.options.inputRuleType && item.options.inputRuleType.length > 0) {
          // let ruleCheckPassed = item.options.validator(item.options.value)
          let ruleCheckPassed = this.inputRulePassed(item.options)
          if (!ruleCheckPassed) {
            validate = false;
            this.vm.$antdMessage.error(item.options.funcMsg)
          }
        }
        else if (item.options.validatorTypeReg && item.options.inputRuleReg && item.options.inputRuleReg.length > 0) {
          // let ruleCheckPassed = item.options.validator(item.options.value)
          let ruleCheckPassed = this.inputRulePassed(item.options)
          if (!ruleCheckPassed) {
            validate = false;
            this.vm.$antdMessage.error(item.options.regMsg)
          }
        }
      })
      if (validate) {
        this.nextEvent(node, actionList)
      }
    } else if (operateEventType === "event-operate-main-menu-href") {
      let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
      let paramUserValue = this.getActionValue(actionItem.paramUser, varDataObj, this);
      let paramTokenValue = this.getActionValue(actionItem.paramToken, varDataObj, this);
      let paramAuthValue = this.getActionValue(actionItem.paramAuth, varDataObj, this);
      let url = location.href;
      setStorage("token", paramTokenValue);
      setStorage("fullName", paramUserValue);
      setStorage("permission", JSON.stringify(paramAuthValue))
      // 2022-07-05 主页跳转前获取一次菜单
      let data = {
        projectId: getStorage("projectId"),
        merchantId: getStorage("merchantId")
      }
      axios.get("https://localhost:40518/platform/api/report/config/v5/menu/pc", {
        params: data,
        headers: {
          'content-type': 'application/json',
          "X-AUTH-TOKEN": paramTokenValue  //token换成从缓存获取
        }
      }).then((res: any) => {
        console.log("-----res", res);
        if (res.data.code == 0) {
          //
          setStorage("vant.routes", JSON.stringify(res.data.dataList))
        }

        // 这里有个判断 如果是本地的执行器 ，那么只需要 #/ 就可以了
        if (url.indexOf("/#/") > -1) {
          let baseUrl = url.split("/#/")[0];
          location.href = baseUrl;
        } else {
          let baseUrl = url.split("#/")[0];
          location.href = baseUrl;
        }
      })
    } else if (operateEventType === "event-operate-export") {
      isPause = true
      setTimeout(() => { // 解决本地存储异步问题
        // let varDataObj = getLocalData()
        // @ts-ignore
        let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
        let params = {};
        let paramsConfigs = actionItem.interfaceDataConfig.paramsConfigs || [];
        paramsConfigs.forEach((paramsConfig) => {
          let paramValue = this.getActionValue(paramsConfig, varDataObj, this);
          params[paramsConfig.param_name] = paramValue || ""; // TODO::: 待优化，要通过uuid遍历实时获取
        });
        const data = {
          dataApiId: operateApiId,
          outputKey: actionItem.exportDataConfig.param_v_key,
          params: params,
          merchantId: getStorage("merchantId"),
          projectId: getStorage("projectId"),
          name: actionItem.exportName
        };
        //调用导出接口
        // window.location.href = url;
        //   this.nextEvent(node,actionList)
        const link = document.createElement('a')

        axios.post("https://localhost:40518/platform/api/excel/v1/export", data, {
          headers: {
            'content-type': 'application/json',
            "X-AUTH-TOKEN": getStorage('token')  //token换成从缓存获取
          }, responseType: 'arraybuffer'
        }).then(res => {
          // 创建Blob对象，设置文件类型
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" })
          let objectUrl = URL.createObjectURL(blob) // 创建URL
          link.href = objectUrl
          link.download = actionItem.exportName // 自定义文件名
          link.click() // 下载文件
          URL.revokeObjectURL(objectUrl); // 释放内存
        })
      }, 0)
    } else if (operateEventType === "event-operate-import") {
      isPause = true
      const input = document.createElement("input");
      input.type = 'file'
      input.addEventListener('change', (e: any) => {
        // 这个本质还是通过Dom获取文件
        let file = e.path[0].files[0];
        let fileData = new FormData();
        let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
        let paramsConfigs = actionItem.interfaceDataConfig.paramsConfigs || [];

        let params = new Array();
        paramsConfigs.forEach(paramItem => {
          // params.push(paramItem.param_name);
          let pValue;
          if (paramItem.custom) {
            pValue = this.getActionValue(paramItem, varDataObj, this);
          }
          params.push({
            name: paramItem.param_name,
            value: pValue,
          })
        })
        let request: any = {
          dataApiId: operateApiId,
          params: params,
          merchantId: getStorage("merchantId"),
          projectId: getStorage("projectId"),
        };
        fileData.append("request", JSON.stringify(request));
        fileData.append("file", file);
        axios.post("https://localhost:40518/platform/api/import/excel", fileData, {
          // axios.post("http://localhost:40518/platform/api/import/excel", fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-AUTH-TOKEN": getStorage('token'),
            "X-AUTH-KEY": getStorage("phoneNumber"),
            "X-PROJECT-ID": getStorage("projectId"),
            "X-MERCHANT-ID": getStorage("merchantId"),
            "X-AUTH-SOURCE": "PORTAL_PC",
          }
        }).then((res: any) => {
          console.log('----------------import', res)
          // 创建Blob对象，设置文件类型
          if (res.data.code == 0) {
            this.vm.$antdMessage.success('导入成功')
            this.nextEvent(node, actionList)
          }

        })
      }, false);
      input.click();

    } else if (operateEventType === "event-operate-link") {
      let url = actionItem.linkUrl;
      let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
      let paramsConfigs = actionItem.params || [];
      paramsConfigs.forEach((paramsConfig) => {
        let paramValue = this.getActionValue(paramsConfig, varDataObj, this);
        paramsConfig.param_value = paramValue; // TODO::: 待优化，要通过uuid遍历实时获取

      });
      //动态url
      if (actionItem.dynamic) {
        // 动态值
        url = this.getActionValue(actionItem.linkDynamic, varDataObj, this);
      } else {
        url = actionItem.linkUrl
      }
      url = this.contractUrl(url, paramsConfigs);
      if (actionItem.redirectPageId) {
        let redirectPageUrl = "" + getStorage("projectId") + "&merchantId=" + getStorage("merchantId") + "&reportId=" + actionItem.redirectPageId + "&token=%7Btoken%7D";
        url = url + "&redirectUrl=" + redirectPageUrl;
      }
      window.open(url, "_blank")
    }  else if (operateEventType === "event-operate-hlink") {
      let url = ''
      let varDataObj = this.vm.$pageDataModelEngine.getCustomData()
      let paramsConfigs = actionItem.params || [];
      paramsConfigs.forEach((paramsConfig) => {
        let paramValue = this.getActionValue(paramsConfig, varDataObj, this);
        paramsConfig.param_value = paramValue; // TODO::: 待优化，要通过uuid遍历实时获取
      });
      //动态url
      if (actionItem.dynamic) {
        // 动态值
        url = this.getActionValue(actionItem.linkDynamic, varDataObj, this);
      } else {
        url = actionItem.linkUrl
      }
      url = this.contractUrl(url, paramsConfigs);
      if (actionItem.redirectPageId) {
        let redirectPageUrl = "" + getStorage("projectId") + "&merchantId=" + getStorage("merchantId") + "&reportId=" + actionItem.redirectPageId + "&token=%7Btoken%7D";
        url = url + "&redirectUrl=" + redirectPageUrl;
      }
      if (actionItem.openType != undefined && actionItem.openType == 'current') {
        window.open(url, "_self")
      } else {
        window.open(url, "_blank")
      }
    } else if (operateEventType === "event-operate-javascript") {
      eventOperateJavascript(
        actionItem,
        this.vm.$pageDataModelEngine,
        {
          componentsConfigs: this.componentsConfigs,
          subpageList: this.subpageList,
          uuidComponentList: this.uuidComponentList,
          popupConfig: this.popupConfig,
          deviceType: this.deviceType
        },
        {
          refreshComponentData: this.refreshComponentData
        }
      )
    } else if (operateEventType === 'event-operate-print') {
      setTimeout(() => {
        let printEl = document.getElementsByClassName(operatePrintComponentId)[0]
        if (!printEl) return false

        let newstr = printEl.innerHTML;
        // let oldstr = document.body.innerHTML;
        document.body.innerHTML = newstr;
        window.print();

        window.location.reload()
        // document.body.innerHTML = oldstr;
        // window.print()
      }, 100)
    }
    if (!isPause) {
      this.nextEvent(node, actionList)
    }

  }

  //输入框校验
  inputRulePassed(options) {
    let inputRuleType = options.inputRuleType
    let value = options.value
    console.log('input options===', options)
    if (options.validatorTypeFunc) {
      if (inputRuleType === 'phone') {
        return /^1\d{10}$/.test(value)
      } else if (inputRuleType === 'idcard') {
        return this.checkIDCard(value)
      } else if (inputRuleType === 'url') {
        return /http:|https:/.test(value)
      } else if (inputRuleType === 'email') {
        return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,5})$/.test(value)
      } else if (inputRuleType === 'string') {
        //非数字全部当做字符串处理
        return !(/^\d+$/.test(value))
      } else if (inputRuleType === 'number') {
        return /^\d+(\.\d+)?$/.test(String(value))
      } else if (inputRuleType === 'int') {
        return /^-?\d+$/.test(String(value))
      } else if (inputRuleType === 'float') {
        return /^(-?\d+)(\.\d+)?$/.test(String(value))
      } else if (inputRuleType === 'hex') {
        return /(^0x[a-f0-9]{1,2}$)|(^0X[A-F0-9]{1,2}$)|(^[A-F0-9]{1,2}$)|(^[a-f0-9]{1,2}$)/.test(value)
      } else {
        return true
      }
    } else if (options.validatorTypeReg) {
      console.log('validatorTypeRegvalidatorTypeReg');
      // if (inputRuleType === 'reg') {
        let reg = '/' + options.inputRuleReg + '/'
        return eval(reg).test(value)
      // } else {
      //   return true
      // }
    } else {
      return true
    }
  }

  //身份证号校验
  checkIDCard(idcode) {
    // 加权因子
    let weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    let check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    let code = idcode + "";
    let last = idcode[17]; //最后一位

    let seventeen = code.substring(0, 17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    let arr = seventeen.split("");
    let len = arr.length;
    let num = 0;
    for (let i = 0; i < len; i++) {
      // @ts-ignore
      num = num + arr[i] * weight_factor[i];
    }

    // 获取余数
    let resisue = num % 11;
    let last_no = check_code[resisue];

    // 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    let idcard_patter =
      /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    let format = idcard_patter.test(idcode);

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format ? true : false;
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
      console.log("next", judgment);
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
      paramValue = paramsConfig.param_value
    } else if (param_value_type === 'G'){
      paramValue = getVariable(paramsConfig.middle,paramsConfig.param_v_key);
    } else {
      this.matchComponent(vm.uuidComponentList, relevanceComponentUuid, paramsConfig)
      paramValue = paramsConfig.param_value
      // this.uuidComponentList.forEach((uuidComponent) => {
      //   if (uuidComponent.uuid === relevanceComponentUuid) {
      //     paramValue = uuidComponent.options.value;
      //     // 2021-02-20 临时特殊处理
      //     if (uuidComponent.type == "van-design-field") {

      //     } else if (uuidComponent.type === "van-design-checkbox") {
      //       let valueStr = "";
      //       uuidComponent.options.value.forEach((checkValue) => {
      //         valueStr += checkValue + ",";
      //       });
      //       if (valueStr.length > 0) {
      //         valueStr = valueStr.substring(0, valueStr.length - 1);
      //       }
      //       paramValue = valueStr;
      //     } else if (uuidComponent.type === "van-design-upload-img") {
      //       let valueStr = "";
      //       uuidComponent.options.fileList.forEach(fileItem => {
      //         let response = fileItem.response;
      //         if (response.code == 0) {
      //           valueStr += response.data.fileId + ","
      //         }
      //       });
      //       if (valueStr.length > 0) {
      //         valueStr = valueStr.substring(0, valueStr.length - 1);
      //       }
      //       paramValue = valueStr;
      //     } else if (uuidComponent.type === "van-design-datetime-picker") {
      //       let dateValue = this.formatDate(new Date(uuidComponent.options.value), uuidComponent.options.format);
      //       paramValue = dateValue;
      //     } else if (uuidComponent.type === "van-design-checkbox-auth"){
      //       let valueStr = "";
      //       uuidComponent.options.values.forEach((checkValue) => {
      //         valueStr += checkValue + ",";
      //       });
      //       if (valueStr.length > 0) {
      //         valueStr = valueStr.substring(0, valueStr.length - 1);
      //       }
      //       paramValue = valueStr;
      //     }
      //   }
      // });
    }
    return paramValue;
  }
  matchComponent(uuidComponentList, relevanceComponentUuid, paramsConfig) {
    console.log('-------matchComponent',uuidComponentList,paramsConfig)
    uuidComponentList.forEach((uuidComponent) => {
      if (uuidComponent.uuid === relevanceComponentUuid) {
        paramsConfig.param_value = uuidComponent.options.value;
        // 2021-02-20 临时特殊处理
        if (uuidComponent.type == "van-design-field") {
          paramsConfig.param_value = uuidComponent.options.value
        } else if (uuidComponent.type === "van-design-checkbox") {
          let valueStr = "";
          uuidComponent.options.value&&uuidComponent.options.value.forEach((checkValue) => {
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
              valueStr += response.data.url + ","
            }
          });
          if (valueStr.length > 0) {
            valueStr = valueStr.substring(0, valueStr.length - 1);
          }
          paramsConfig.param_value = valueStr;
        } else if (uuidComponent.type === "van-design-calendar") {
          let format = "YYYY-MM-DD";
          if (uuidComponent.options.format) {
            format = uuidComponent.options.format;
          }
          let dateValue = "";
          if (uuidComponent.options.value) {
            dateValue = this.formatDate(new Date(uuidComponent.options.value), format);
          }

          paramsConfig.param_value = dateValue;
        } else if (uuidComponent.type === "van-design-datetime-picker") {
          // let format = "HH:mm:ss";
          // if (uuidComponent.options.format) {
          //   format = uuidComponent.options.format;
          // }
          // let dateValue="";
          // if(uuidComponent.options.value){
          //   dateValue = this.formatDate(new Date(uuidComponent.options.value), format);
          // }

          paramsConfig.param_value = uuidComponent.options.value;
        }else if(uuidComponent.type ==="van-design-calendar-range"){
          let valueStr = "";
          uuidComponent.options.value&&uuidComponent.options.value.forEach((checkValue) => {
            valueStr += checkValue + ",";
          });
          if (valueStr.length > 0) {
            valueStr = valueStr.substring(0, valueStr.length - 1);
          }
          paramsConfig.param_value = valueStr;
        } else if (uuidComponent.type === "van-design-select" && uuidComponent.options.mode === 'multiple') {
          let valueStr = "";
          uuidComponent.options.value&&uuidComponent.options.value.forEach((checkValue) => {
            valueStr += checkValue + ",";
          });
          if (valueStr.length > 0) {
            valueStr = valueStr.substring(0, valueStr.length - 1);
          }
          paramsConfig.param_value = valueStr;
        } else if (uuidComponent.type === "van-design-checkbox-auth") {
          let valueStr = "";
          uuidComponent.options.values.forEach((checkValue) => {
            valueStr += checkValue + ",";
          });
          if (valueStr.length > 0) {
            valueStr = valueStr.substring(0, valueStr.length - 1);
          }
          paramsConfig.param_value = valueStr;
        } else if (uuidComponent.type === "van-design-table") {
          if(paramsConfig.param_v_key=="rownum"){
            paramsConfig.param_value=uuidComponent.options.pagination.pageSize
          }else if(paramsConfig.param_v_key=='pagenum'){
            paramsConfig.param_value=uuidComponent.options.pagination.current
          }
        } else if (uuidComponent.type === "van-design-tree"
          || uuidComponent.type === "van-design-tree-select") {
          if(paramsConfig.param_v_key=="label"){
            paramsConfig.param_value = uuidComponent.options.containPath ?
              uuidComponent.options.pathLabel :uuidComponent.options.outputLabel
          }else{
            paramsConfig.param_value = uuidComponent.options.containPath ?
            uuidComponent.options.pathValue : uuidComponent.options.value
          }
          // console.log('paramsConfig===', JSON.stringify(paramsConfig))
          // console.log('uuidComponent===', JSON.stringify(uuidComponent))
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
    // 2022-11-01 这里处理下  所有的页面都需要加入权限控制
    let localPermission = getStorage("permission")
    if (localPermission != 'undefined') {
      let comPermission = JSON.parse(localPermission || "{}");
      let tempArr = [];
      transformComponentListTreeToPlan(componentList, tempArr);
      let tempUuidComponentList = tempArr;
      let realPermissionList = new Array();
      if (comPermission && comPermission instanceof Array) {
        comPermission.forEach((tempItem) => {
          let cpermission = tempItem["permission"];
          let pList = cpermission.split(",");
          pList.forEach((pItem) => {
            // 匹配van开头的
            if (pItem.indexOf("van-") > -1) {
              realPermissionList.push(pItem);
            }
          });
        });
      }
      tempUuidComponentList.forEach((uuidItem: any) => {
        if (uuidItem.options.commonConfigAssignIsPermission) {
          uuidItem.options.commonConfig.displayHide = true;
          realPermissionList.forEach((rPItem) => {
            if (uuidItem.uuid == rPItem) {
              uuidItem.options.commonConfig.displayHide = false;
            }
          });
        }
      });
    }

  }
  // 逻辑判断的事件处理
  handleLogicJudgment(node, actionList) {
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
        judgmentValue = actionItem.param_value
      } else if(actionItem.param_value_type === 'G'){
        judgmentValue=getVariable(actionItem.middle,actionItem.param_v_key)
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
    if (contentDataSource === "radio-button-interface"||contentDataSource === "radio-button-connect") {
      let params = {};
      let paramsConfigs = interfaceDataConfig.paramsConfigs || [];
      paramsConfigs.forEach((paramsConfig) => {
        let relevanceComponentUuid = paramsConfig.relevanceComponentUuid;
        let param_value_type = paramsConfig.param_value_type;
        if (param_value_type === "V") {
          let pValue = this.vm.$pageDataModelEngine.getCustomData(paramsConfig.param_v_key)
          // 默认使用param_value
          if (pValue) {
            paramsConfig.param_value = pValue
          }
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
          // 2022-04-07
          uuidComponent.options.interfaceDataConfig.tableData && (uuidComponent.options.interfaceDataConfig.tableData = interfaceData[apiKey]);
          uuidComponent.options.interfaceDataConfig.chartData &&
            (uuidComponent.options.interfaceDataConfig.chartData.rows = interfaceData[apiKey]);
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

  contractUrl(url, data) {
    let params = "";
    data && data.forEach(item => {
      params += item.param_name + "=" + item.param_value + "&";
    })
    if (params.length > 0) {
      params = params.substring(0, params.length - 1);
    }
    return url + (url.indexOf('?') < 0 ? '?' : '&') + params
  }
}
