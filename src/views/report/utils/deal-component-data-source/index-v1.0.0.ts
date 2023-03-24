/**
 * 处理组件数据源
 *
 */
// import Vue from 'vue'
import SweepCrawler from './sweep-crawler'
import {
  getProcesseDataList,
  getOpenDatasetResult,
  getOpenDataTableResult,
  getMockResult
} from "@/api/chartsData.js";
import {
  previewDataService
} from "@/api/database-command/index.js";
import { testInterfaceService } from '@/api/process.js'
import { transformComponentListTreeToPlan } from "@/views/report/utils/deal-component-data/transform-component-list";
import QueryInterfaceData from '../report-data-engine/query-interface-data';
import {getStorage,setStorage} from "@/util/storageUtil.js";
import {saveVariable,getVariable} from '@/views/report/utils/deal-global-variable/globalUtils'
export class ComponentDataSourceApiQueryV1_0_0 {
  $pageDataModelEngine: any
  // ListLinear：一维线性的组件列表，可以直接用forEach遍历出所有item
  componentListAllLinear: any // 页面中所有的组件集合
  componentListLinear: any // 需要查询接口的组件集合
  interfaceDataConfig: any

  constructor(componentListLinear, componentListAllLinear, $pageDataModelEngine) {
    // super()
    this.$pageDataModelEngine = $pageDataModelEngine
    this.componentListLinear = componentListLinear
    this.componentListAllLinear = componentListAllLinear
    this.interfaceDataConfig = this.$pageDataModelEngine.getInterfaceData()
  }

  run() {
    // 数据源为：自定义
    this.customDataAppend()
    // 数据源为：组件
    this.componentDataAppend()
    // 数据源为：全局变量
    this.globalDataAppend()
    // 数据源为：接口（这种类型的数据源需要先请求接口拿到数据后再赋值给组件）
    this.initInterfaceData()
    this.interfaceDataAppend()
  }

  // 数据源为自定义的组件赋值
  customDataAppend() {
    this.componentListLinear.forEach(componentItem => {
      let dataSourceType = componentItem.options.contentDataSource
      let interfaceDataConfig = componentItem.options.interfaceDataConfig
      let contentDataEcho = componentItem.options.contentDataEcho || "";
      if (dataSourceType === 'custom') {
        interfaceDataConfig.value = this.$pageDataModelEngine.getCustomData(interfaceDataConfig.key) || ''

        // 2022-04-24 这里理论上 应该修改 日期组件
        if (componentItem.type == 'van-design-calendar' || componentItem.type == "van-design-datetime-picker") {
          componentItem.options.value = this.$pageDataModelEngine.getCustomData(interfaceDataConfig.key) || ''
        }
      }

      if(contentDataEcho === 'custom'){
        let interfaceDataEchoConfig = componentItem.options.interfaceDataEchoConfig
        let echoValue=this.$pageDataModelEngine.getCustomData(interfaceDataEchoConfig.key) || '';
        interfaceDataEchoConfig.value = echoValue
        componentItem.options.value = echoValue
      }
      // let dataEchoType = componentItem.options.contentDataEcho
      // let interfaceDataEchoConfig = componentItem.options.interfaceDataEchoConfig

      // if (dataEchoType === 'custom') {
      //   interfaceDataEchoConfig.value = this.$pageDataModelEngine.getCustomData(interfaceDataEchoConfig.key) || ''
      // }
    })
  }
  // 数据源为组件的组件赋值
  componentDataAppend() {
    this.componentListLinear.forEach(componentItem => {
      let dataSourceType = componentItem.options.contentDataSource
      let interfaceDataConfig = componentItem.options.interfaceDataConfig
      if (dataSourceType === 'component') {
        let relevanceComponentUuid = interfaceDataConfig.key;
        this.componentListAllLinear.forEach((uuidComponent) => {
          if (uuidComponent.uuid === relevanceComponentUuid) {
            interfaceDataConfig.value = uuidComponent.options.value
          }
        });
      }
    })
  }
  globalDataAppend(){
    this.componentListLinear.forEach(componentItem => {
      let dataSourceType = componentItem.options.contentDataSource
      let interfaceDataConfig = componentItem.options.interfaceDataConfig
      let contentDataEcho = componentItem.options.contentDataEcho || "";
      if (dataSourceType === 'global') {
        interfaceDataConfig.value=getVariable(interfaceDataConfig.scope,interfaceDataConfig.key)
      }
      if(contentDataEcho === 'global'){
        let interfaceDataEchoConfig = componentItem.options.interfaceDataEchoConfig
        let echoValue=this.$pageDataModelEngine.getCustomData(interfaceDataEchoConfig.key) || '';
        interfaceDataEchoConfig.value = echoValue
        componentItem.options.value = echoValue
      }
    })
  }
  // 数据源为接口的组件赋值
  interfaceDataAppend() {
    this.interfaceDataConfig && this.interfaceDataConfig.forEach(interfaceDataItem => {
      this.componentListLinear.forEach(componentItem => {
          if (componentItem.options.interfaceDataConfig.uuid === interfaceDataItem.id ||
            ((componentItem.options.interfaceDataEchoConfig) && (componentItem.options.interfaceDataEchoConfig.uuid === interfaceDataItem.id))) {
            if (componentItem.type === "van-design-form") {
              InterfaceResponseToComponentValue.giveFormComponentData(componentItem, interfaceDataItem, this.$pageDataModelEngine, 0, this.componentListAllLinear)
            } else {
              InterfaceResponseToComponentValue.giveComponentData(componentItem, interfaceDataItem, 0, this.$pageDataModelEngine)
            }
          }
      })
    })
  }

  // 发起所有接口请求
  initInterfaceData() {
    this.interfaceDataConfig && this.interfaceDataConfig.forEach(interfaceItem => {
      interfaceItem.data.queryIsReady = false
      let type = interfaceItem.type
      if (type === 'radio-button-interface') {
        // QueryInterface.getDataProcessing(interfaceItem.data, this.$pageDataModelEngine, this.componentListAllLinear)
        QueryInterface.getMockDataProcessing(interfaceItem, this.$pageDataModelEngine, this.componentListAllLinear)
      } else if (type === 'radio-button-tables') {
        QueryInterface.queryOpenDataTableResult(interfaceItem.data, this.$pageDataModelEngine)
      } else if (type === 'radio-button-dataset') {
        QueryInterface.queryDataset(interfaceItem.data, this.$pageDataModelEngine)
      } else if (type === 'radio-button-view') {
        // QueryInterface.queryDataset(interfaceItem.data, this.$pageDataModelEngine)
        QueryInterface.queryViewData(interfaceItem.data)
      } else if (type === 'radio-button-connect') {
        QueryInterface.getDataProcessing(interfaceItem.data, this.$pageDataModelEngine, this.componentListAllLinear)
      }
      // else if (type === 'radio-button-sql') {
      //   QueryInterface.queryViewData(interfaceItem.data)
      // }
    })
  }
}

/**
 * 下面是接口获取的工具类
 */

/**
 * 接口获取到数据之后为组件赋值
 */
class InterfaceResponseToComponentValue {
  /**
   * 数据源为接口的组件赋值
   * @param componentItem
   * @param interfaceDataItem
   * @param tryCount 尝试赋值计数，超过8次就不在进行赋值了
   *
   * BUG 记录，要知道 哪个接口是回显用，哪个接口是赋值用
   * TODO 先调用赋值接口，全部结束后调用回显接口
   */
  static giveComponentData(componentItem, interfaceDataItem, tryCount, $pageDataModelEngine) {
    setTimeout(() => {
      if (!interfaceDataItem.data.queryIsReady) {
        if (tryCount >= 8) {
          return false
        }
        tryCount++
        this.giveComponentData(componentItem, interfaceDataItem, tryCount, $pageDataModelEngine)
      } else {

        let dataSourceType = componentItem.options.contentDataSource
        let interfaceDataConfig = componentItem.options.interfaceDataConfig
        let responseData = interfaceDataItem.data.responseData

        let contentDataEcho = componentItem.options.contentDataEcho || "";
        if (dataSourceType === 'radio-button-interface' || dataSourceType === 'radio-button-connect') {
          let apiKey = interfaceDataConfig.key
          if (typeof responseData[apiKey] === 'object'&&responseData[apiKey]!=null) {
            interfaceDataConfig.chartData && (interfaceDataConfig.chartData.rows = responseData[apiKey] || [])
            interfaceDataConfig.tableData = responseData[apiKey] || []
            if(componentItem.type === "van-design-table"){
              // 2023.02.23 适配下表格真分页逻辑
              if(componentItem.options.pagingTotalKey){
                componentItem.options.pagination.total= responseData[componentItem.options.pagingTotalKey]
              }
            }
          } else {
            if(responseData[apiKey]){
              interfaceDataConfig.value = responseData[apiKey]
            }else{
              if(componentItem.type === "van-design-field"){
                componentItem.options.value="";
                componentItem.options.interfaceDataConfig.value="";
              }else if (componentItem.type == 'van-design-select' && componentItem.options.mode === 'multiple') {
                componentItem.options.interfaceDataConfig.value="";
              }else{
                componentItem.options.value="";
              }
            }
          }
        }
        if (contentDataEcho === 'radio-button-interface' || contentDataEcho === 'radio-button-connect') {
          let interfaceDataEchoConfig = componentItem.options.interfaceDataEchoConfig
          let apiKey = interfaceDataEchoConfig.key
          if (typeof responseData[apiKey] === 'object') {
            interfaceDataEchoConfig.chartData && (interfaceDataEchoConfig.chartData.rows = responseData[apiKey] || [])
            interfaceDataEchoConfig.tableData = responseData[apiKey] || []
          } else {
            if (responseData[apiKey]) {
              interfaceDataEchoConfig.value = responseData[apiKey]
              componentItem.options.value = responseData[apiKey]
              if (componentItem.type == 'van-design-checkbox') {
                let valueList = new Array()
                let needTranNumber = true;
                let temp = responseData[apiKey].split(",");
                if(componentItem.options.contentDataSource==='radio-button-default'){
                  if(typeof componentItem.options.defaultTableData[0].value =='string'){
                    needTranNumber=false;
                  }
                }
                temp && temp.forEach(tItem => {
                  if (needTranNumber&&this.isNumber(tItem)) {
                    valueList.push(Number(tItem));
                  } else {
                    valueList.push(tItem);
                  }
                })
                componentItem.options.value = valueList;

              } else if (componentItem.type == 'van-design-calendar-range' ) {
                let temp = responseData[apiKey].split(",");
                let needTranNumber = true;
                let valueList = new Array()
                // 回显需要 数字的时候
                temp && temp.forEach(tItem => {
                  if (needTranNumber&&this.isNumber(tItem)) {
                    valueList.push(Number(tItem));
                  } else {
                    valueList.push(tItem);
                  }
                })
                componentItem.options.value = valueList;
              } else if (componentItem.type == 'van-design-select' && componentItem.options.mode === 'multiple') {
                let temp = responseData[apiKey].split(",");
                let needTranNumber = true;
                let valueList = new Array()
                // 回显需要 数字的时候
                temp && temp.forEach(tItem => {
                  if (needTranNumber&&this.isNumber(tItem)) {
                    valueList.push(Number(tItem));
                  } else {
                    valueList.push(tItem);
                  }
                })
                componentItem.options.value = valueList;
              } else if(componentItem.type == 'van-design-select'){

              } else if (componentItem.type === "van-design-checkbox-auth") {
                let valueList = new Array()
                let temp = responseData[apiKey].split(",");
                temp && temp.forEach(tItem => {
                  // if (this.isNumber(tItem)) {
                  //   valueList.push(Number(tItem));
                  // } else {
                    // valueList.push(String(tItem));
                  // }
                  valueList.push(String(tItem));
                })
                componentItem.options.values = valueList;
              }else if(componentItem.type === "van-design-upload-img"){
                let temp = responseData[apiKey].split(",");
                let fileList = new Array();
                temp && temp.forEach((tItem,tindex) => {
                  fileList.push(
                    {
                      uid: tindex,
                      name: tItem,
                      response:{
                        code:0,
                        data:{
                          url:tItem
                        }
                      },
                      status: 'done',
                      url: tItem,
                    });
                })
                componentItem.options.fileList=fileList
              }
            }else{
              // 一般配置回显的组件 会调用2次接口，一次是配置值一次是回显值，所以不能简单的将数据清空，如果 配置值接口慢，会导致回显值丢失
              // 接口无对应返回值的时候，展示默认值还是接口
              if(componentItem.type === "van-design-field"){
                componentItem.options.value="";
                componentItem.options.interfaceDataConfig.value="";
              }

              if(componentItem.type === "van-design-upload-img"){
                componentItem.options.fileList=new Array();
              }
              if(componentItem.type == 'van-design-select' && componentItem.options.mode === 'multiple'){
                // bug 记录，如果一个组件 既配置了 赋值接口，又配置了回显接口，就会走进这个逻辑，导致回显值被清空，
                // console.log('---33---multiple--------',componentItem)
                // componentItem.options.value = null;
              }
            }

          }
        }
        // 数据源为数据集或数据表
        if (typeof responseData === 'object' && ['radio-button-tables', 'radio-button-dataset', 'radio-button-view'].indexOf(dataSourceType) !== -1) {
          interfaceDataConfig.chartData && (interfaceDataConfig.chartData.rows = responseData || [])
          interfaceDataConfig.tableData = responseData || []
        }
        // 处理一些特殊组件
        SweepCrawler.makeBeautify(componentItem, $pageDataModelEngine)
      }
    }, 1000)
  }
  static isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (val.length<15&&(regPos.test(val) || regNeg.test(val))) {
      return true;
    } else {
      return false;
    }
  }
  static giveFormComponentData(componentItem, interfaceDataItem, $pageDataModelEngine, tryCount, componentListAllLinear) {
    setTimeout(() => {
      if (!interfaceDataItem.data.queryIsReady) {
        if (tryCount >= 8) {
          return false
        }
        tryCount++
        this.giveFormComponentData(componentItem, interfaceDataItem, $pageDataModelEngine, tryCount, componentListAllLinear)
      } else {
        // 2021-06-03 queryTable 特殊处理 type 是表单的情况 如果有primaryKey 则 查询
        QueryInterface.queryFormTable(interfaceDataItem, $pageDataModelEngine, componentItem, componentListAllLinear)

      }
    }, 1000)
  }
}
/**
 * 通过组件配置请求接口
 * 2022-01-27
 * 这边的这个是实际运行过程中（运行阶段） 的接口请求，也就是 预览或者门户的时候的请求
 */
export class QueryInterface {

  static getMockDataProcessing(interfaceItem: any, $pageDataModelEngine, componentListAllLinear) {
    let env = getStorage("authEnv") || "dev";
    let runMode = getStorage('runMode')
    console.log('runMode====',runMode)
    if (interfaceItem.data.isMockData) {
      interfaceItem.data.queryIsReady = true
    } else {
      if (env === 'dev' && interfaceItem.data.mockFlag) {
        const mockQuery = {
          processId: interfaceItem.data.id,
          type: 'report',
        }
        getMockResult(mockQuery).then(res => {
          if (!res.data) {
            QueryInterface.getDataProcessing(interfaceItem.data, $pageDataModelEngine, componentListAllLinear);
          } else {
            let apiInterfaceData = JSON.parse(res.data.mockData);
            interfaceItem.data.responseData = apiInterfaceData;
            interfaceItem.data.queryIsReady = true
          }
        })
      } else {
        QueryInterface.getDataProcessing(interfaceItem.data, $pageDataModelEngine, componentListAllLinear);
      }
    }
  }

  // 获取后端服务数据
  static getDataProcessing(interfaceItemData, $pageDataModelEngine, componentListAllLinear) {
    let id = interfaceItemData.id
    // 组装请求参数
    let params = {};
    let paramsConfigs = interfaceItemData.paramsConfigs || [];
    paramsConfigs.forEach((paramsConfig) => {
      if (paramsConfig.param_value_type === 'V') {
        if (paramsConfig.param_v_key) {
          paramsConfig.param_value = $pageDataModelEngine.getCustomData(paramsConfig.param_v_key)
        }
      } else if (paramsConfig.param_value_type === 'G') {
        paramsConfig.param_value = getVariable(paramsConfig.middle,paramsConfig.param_v_key)
      } else {
        let relevanceComponentUuid = paramsConfig.relevanceComponentUuid;
        componentListAllLinear.forEach((uuidComponent) => {
          if (uuidComponent.uuid === relevanceComponentUuid) {
            paramsConfig.param_value = uuidComponent.options.value;
            if (uuidComponent.type === "van-design-table") {
              if(paramsConfig.param_v_key=="rownum"){
                paramsConfig.param_value=uuidComponent.options.pagination.pageSize
              }else if(paramsConfig.param_v_key=='pagenum'){
                paramsConfig.param_value=uuidComponent.options.pagination.current
              }
            }else if(uuidComponent.type == 'van-design-select' && uuidComponent.options.mode === 'multiple'){
              let valueStr = "";
              uuidComponent.options.value&&uuidComponent.options.value.forEach((checkValue) => {
                valueStr += checkValue + ",";
              });
              if (valueStr.length > 0) {
                valueStr = valueStr.substring(0, valueStr.length - 1);
              }
              paramsConfig.param_value = valueStr;
            }
          }
        });
      }
      params[paramsConfig.param_name] = paramsConfig.param_value;
    });
    let page = {
      pageIndex: 1,
      pageSize: 20
    }
    if (interfaceItemData.pagination) {
      params['__sys__pageIndex'] = interfaceItemData.pagination.pageIndex;
      params['__sys__pageSize'] = interfaceItemData.pagination.pageSize
    }

    // 发起请求
    const data = {
      dataApiId: id,
      params
    }
    getProcesseDataList(data).then(res => {
      if (res.code === 0) {
        interfaceItemData.responseData = res.data
      } else {
        // this.$message.error(res.message)
      }
      interfaceItemData.queryIsReady = true
    }).catch(() => {
      interfaceItemData.queryIsReady = true
    })
  }
  // 获取数据表数据
  static queryOpenDataTableResult(interfaceItemData, $pageDataModelEngine) {
    let dbConfigId = interfaceItemData.dbConfigId
    let businessId = interfaceItemData.businessId
    let tableName = interfaceItemData.tableName
    let queryConfigs = interfaceItemData.queryConfigs || [];

    // 组装请求条件
    let conditionList = [] as any;
    queryConfigs.forEach((queryConfig) => {
      if (queryConfig.param_value_type === 'V') {
        if (queryConfig.param_v_key) {
          queryConfig.param_value = $pageDataModelEngine.getCustomData(queryConfig.param_v_key)
        }
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
    let page = {
      pageIndex: 1,
      pageSize: 20
    }
    if (interfaceItemData.pagination) {
      page.pageSize = interfaceItemData.pagination.pageSize
    }
    // 发起请求
    let params = {
      id: businessId,
      name: tableName,
      conditionList,
      page: page,
      orderBy: []
    }
    getOpenDataTableResult(params).then(res => {
      let responseDataList = res.dataList || []
      interfaceItemData.responseData = responseDataList
      interfaceItemData.queryIsReady = true
    }).catch(() => {
      interfaceItemData.queryIsReady = true
    })
  }
  // 表单
  static queryFormTable(interfaceItemData, $pageDataModelEngine, componentItem, componentListAllLinear) {
    console.log('******queryFormTable******');
    console.log('******interfaceItemData******', JSON.stringify(interfaceItemData));
    console.log('******componentItem******', JSON.stringify(componentItem));
    let dbConfigId = interfaceItemData.data.dbConfigId
    let tableName = interfaceItemData.data.tableName;
    // 组装请求条件
    let conditionList = [] as any;
    if (componentItem.param_value_type) {

    }
    if (componentItem.options.param_value_type === 'V') {
      if (componentItem.options.param_v_key) {
        componentItem.options.primaryKey = $pageDataModelEngine.getCustomData(componentItem.options.param_v_key)
      }
    } else {
      let relevanceComponentUuid = componentItem.options.relevanceComponentUuid;
      componentListAllLinear.forEach((uuidComponent) => {
        if (uuidComponent.uuid === relevanceComponentUuid) {
          componentItem.options.primaryKey = uuidComponent.options.value;

        }
      });
    }
    if (componentItem.options.primaryKey) {
      let obj = {
        columnName: componentItem.options.param_v_key || componentItem.options.interfaceDataConfig.key,
        columnAlias: componentItem.options.param_v_key || componentItem.options.interfaceDataConfig.key,
        operator: '=',
        conditionVal: componentItem.options.primaryKey,
        conditionType: componentItem.options.param_value_type,
      };
      conditionList.push(obj);

      // 发起请求
      let params = {
        id: dbConfigId,
        name: tableName,
        conditionList,
        page: {
          pageIndex: 1,
          pageSize: 20
        },
        orderBy: []
      }

      getOpenDataTableResult(params).then(res => {
        let formData = res.dataList[0];
        //2021-05-17 这里 由于把表单查询 移过来了，需要进行 特殊判断
        let cList = componentItem.options.columns[0].componentList;
        let tempArr = [] as any;
        transformComponentListTreeToPlan(cList, tempArr)
        tempArr.forEach(element => {
          element.options.value = formData[element.options.databaseField];
        });

      }).catch(() => {
        interfaceItemData.queryIsReady = true
      })
    }

  }

  // 获取数据集结果（SQL脚本与数据集共用一个接口）
  static queryDataset(interfaceItemData, $pageDataModelEngine) {
    let dataSetId = interfaceItemData.id
    let dataSetName = interfaceItemData.name
    let queryConfigs = interfaceItemData.queryConfigs || [];
    // 组装请求条件
    let conditionList = [] as any;
    queryConfigs.forEach((queryConfig) => {
      if (!queryConfig.param_name) return false;
      if (queryConfig.param_value_type === 'V') {
        if (queryConfig.param_v_key) {
          queryConfig.param_value = $pageDataModelEngine.getCustomData(queryConfig.param_v_key)
        }
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

    let page = {
      pageIndex: 1,
      pageSize: 20
    }
    if (interfaceItemData.pagination) {
      page.pageSize = interfaceItemData.pagination.pageSize
    }
    // 发起请求
    let params = {
      id: dataSetId,
      name: dataSetName,
      conditionList,
      page: page,
      orderBy: []
    }
    getOpenDatasetResult(params).then(res => {
      let responseDataList = res.dataList || []
      interfaceItemData.responseData = responseDataList
      interfaceItemData.queryIsReady = true
    }).catch(() => {
      interfaceItemData.queryIsReady = true
    })
  }
  // 获取视图数据
  static queryViewData(interfaceItemData) {
    let dbConfigId = interfaceItemData.dbConfigId
    let name = interfaceItemData.name
    let execSqlText = interfaceItemData.execSqlText
    previewDataService({
      dbConfigId: dbConfigId,
      name,
      sql: execSqlText
    }).then(res => {
      let columnList = res.data.columnList || []
      let valueList = res.data.valueList || []
      let responseDataList = [] as any
      valueList.forEach((valueItem, valueIndex) => {
        let obj = {} as any
        columnList.forEach((columnItem, columnIndex) => {
          obj[columnItem.name] = valueItem[columnIndex]
        })
        responseDataList.push(obj)
      })
      interfaceItemData.responseData = responseDataList
      interfaceItemData.queryIsReady = true
    }).catch(() => {
      interfaceItemData.queryIsReady = true
    })
  }
}
