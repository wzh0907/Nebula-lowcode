/**
 * 处理组件数据源
 * 
 */
// import Vue from 'vue'
import { coverBigComponent } from "@/views/report/utils/common-const";
import { ComponentDataSourceApiQueryV1_0_0 } from './index-v1.0.0';
// import { componentDeepClone } from "@/views/report/utils/deal-component-data/component-deep-clone";
import { getLocalData, saveAndUpdateLocalData } from '@/views/report/utils/deal-data-cache/index'
import {
  getProcesseDataList,
  getOpenDatasetResult,
  getOpenDataTableResult
} from "@/api/chartsData.js";

export class ComponentDataSourceApiQuery {
  // componentConfigList: any
  componentList: any
  $pageDataModelEngine: any
  // pickComponentList: any
  // handleInterface: any
  // handleInterfaceData: any
  // refreshComponent__balalalalala: any

  constructor(componentConfigList, componentList, $pageDataModelEngine) {
    // super()
    // this.componentConfigList = componentConfigList
    this.componentList = componentList
    this.$pageDataModelEngine = $pageDataModelEngine
  }

  init() {
    // 各类型的组件集合：线性一维组件集合、低版本组件、最新版本组件
    let componentListLinear = []
    let lowVersionComponentList = []
    let latestVersionComponentList = []

    // 各类型的接口集合：后端服务、数据表、数据集
    let interfaceList = []
    let dataTableList = []
    let dataDatasetList = []


    // 挑选出各类型的组件集合
    this.pickComponentList(this.componentList, componentListLinear)
    this.pickLowVersionComponent(componentListLinear, lowVersionComponentList, latestVersionComponentList)
    // 挑选出各类型的接口
    this.collectComponentApi(lowVersionComponentList, interfaceList, dataTableList, dataDatasetList)
    // 发起各类型的接口请求
    this.handleInterfaceData(componentListLinear, interfaceList)
    setTimeout(() => {
      this.handleTableData(dataTableList)
    }, 50);
    this.handleDatesetData(dataDatasetList)

    // 最新版本组件的接口处理
    let componentDataSourceApiQueryV1_0_0 = new ComponentDataSourceApiQueryV1_0_0(latestVersionComponentList, componentListLinear, this.$pageDataModelEngine)
    componentDataSourceApiQueryV1_0_0.run()
  }

  /**
   * 挑选出低版本组件和最新版本组件
   * @param componentListLinear 一维线性的组件列表
   * @param lowVersionComponentList 低版本组件
   * @param latestVersionComponentList 最新版本组件
   */
  pickLowVersionComponent(componentListLinear, lowVersionComponentList, latestVersionComponentList) {
    componentListLinear.forEach(componentItem => {
      let interfaceDataConfig = componentItem.options.interfaceDataConfig
      if (interfaceDataConfig && interfaceDataConfig.versions === '1.0.0') {
        latestVersionComponentList.push(componentItem)
      } else {
        lowVersionComponentList.push(componentItem)
      }
    })
  }

  /**
   * 收集所有组件的数据源，然后在handle中处理
   * @param componentList 页面中的组件list
   * @param interfaceList 数据源：后端服务
   * @param dataTableList 数据源：数据表
   * @param dataDatasetList 数据源：数据集
   */
  collectComponentApi(componentList, interfaceList, dataTableList, dataDatasetList) {
    componentList.forEach((itemComponent) => {
      let contentDataSource = itemComponent.options.contentDataSource || "";
      let contentDataEcho = itemComponent.options.contentDataEcho || "";
      // 后端服务
      let componentInterList = ["radio-button-interface", 'radio-qrCode-interface']
      if (componentInterList.indexOf(contentDataSource) != -1) {

        this.handleInterfaceList(itemComponent.options.interfaceDataConfig, itemComponent, interfaceList, componentList);
      }
      if (contentDataEcho === 'radio-button-interface-echo') {
        this.handleInterfaceList(itemComponent.options.interfaceDataEchoConfig, itemComponent, interfaceList, componentList);
      }
      // 数据表
      if (contentDataSource === 'radio-button-tables') {
        let interfaceItem = {
          // apiId: apiId,
          componentUuidList: [itemComponent.uuid],
          componentConfig: itemComponent,
          interfaceData: {},
        };
        dataTableList.push(interfaceItem);
      }
      // 数据集
      if (contentDataSource === 'radio-button-dataset') {
        // let interfaceDataConfigByUUIDMap = {}
        // interfaceDataConfigByUUIDMap
        let interfaceItem = {
          // apiId: apiId,
          componentUuidList: [itemComponent.uuid],
          // interfaceDataConfig: itemComponent.options.interfaceDataConfig,
          componentConfig: itemComponent,
          interfaceData: {},
        };
        dataDatasetList.push(interfaceItem);
      }
    });
  }

  handleInterfaceList(interfaceDataConfig, itemComponent, interfaceList, componentList) {
    // let varDataObj = getLocalData()
    let varDataObj = this.$pageDataModelEngine.getCustomData()
    let apiId = interfaceDataConfig.id;
    if(!apiId){
      return ;
    }
    // 循环 interfaceList 判断是否已经存在
    let existFlag = false;
    interfaceList &&
      interfaceList.forEach((element) => {
        if (element.apiId === apiId) {
          existFlag = true;
          //存在就 推入新的uuid
          element.componentUuidList.push(itemComponent.uuid);
        }
      });
    if (!existFlag) {
      let params = {};
      let paramsConfigs = interfaceDataConfig.paramsConfigs || [];
      paramsConfigs.forEach((paramsConfig) => {
        if (paramsConfig.param_value_type === 'V') {
          if (paramsConfig.param_v_key) {
            paramsConfig.param_value = varDataObj[paramsConfig.param_v_key]
          }
        } else {
          let relevanceComponentUuid = paramsConfig.relevanceComponentUuid;
          componentList.forEach((uuidComponent) => {
            if (uuidComponent.uuid === relevanceComponentUuid) {
              paramsConfig.param_value = uuidComponent.options.value;
            }
          });
        }
        params[paramsConfig.param_name] = paramsConfig.param_value; // TODO::: 待优化，要通过uuid遍历实时获取
      });
      const data = {
        dataApiId: apiId,
        params,
      };
      let interfaceItem = {
        apiId: apiId,
        componentUuidList: [itemComponent.uuid],
        data: data,
        interfaceData: {},
      };
      interfaceList.push(interfaceItem);
    }
  }

  handleInterfaceData(componentConfigList, interfaceList) {
    interfaceList.forEach(interfaceItem => {

      getProcesseDataList(interfaceItem.data).then((res) => {

        if (res.code === 0) {

          let interfaceData = res.data;
          interfaceItem.interfaceData = interfaceData;
          this.refreshComponent__balalalalala(componentConfigList, interfaceItem);
        } else {
        }
      });
    });
  }

  handleTableData(interfaceList) {
    // setTimeout(()=>{
    // let varDataObj = this.$pageDataModelEngine.getCustomData()
    let varDataObj = getLocalData()
    interfaceList.forEach(interfaceItem => {
      let componentConfig = interfaceItem.componentConfig
      let interfaceDataConfig = componentConfig.options.interfaceDataConfig || {}
      let dbConfigId = interfaceDataConfig.dbConfigId;
      let tableName = interfaceDataConfig.tableName;
      let queryConfigs = interfaceDataConfig.queryConfigs || [];
      let conditionList = [] as any;
      queryConfigs.forEach((queryConfig) => {
        if (queryConfig.param_value_type === 'V') {
          if (queryConfig.param_v_key) {
            queryConfig.param_value = varDataObj[queryConfig.param_v_key]
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
      let params = {
        id: dbConfigId,
        name: tableName,
        conditionList,
        page: {
          pageIndex: 1,
          pageSize: 20,
        },
        orderBy: [],
      };
      getOpenDataTableResult(params).then((res) => {
        interfaceDataConfig.chartData && (interfaceDataConfig.chartData.rows = res.dataList || [])
        interfaceDataConfig.tableData = res.dataList || []
        // componentConfig.options = {}
        // console.log('xxxxxxxx', componentConfig)
        if ("van-design-form" === componentConfig.type) {
          let formData = res.dataList[0];
          //2021-05-17 这里 由于把表单查询 移过来了，需要进行 特殊判断
          let cList = componentConfig.options.columns[0].componentList;
          cList.forEach(element => {
            element.options.value = formData[element.options.databaseField];
            // console.log('xxxxxxxx', element,componentConfig)

          });

        }
        // this.refreshComponent__balalalalala(componentConfigList,interfaceItem);

      });
    });
    // },50)

  }

  handleDatesetData(interfaceList) {
    // let varDataObj = getLocalData()
    let varDataObj = this.$pageDataModelEngine.getCustomData()
    interfaceList.forEach(interfaceItem => {
      let componentConfig = interfaceItem.componentConfig
      let interfaceDataConfig = componentConfig.options.interfaceDataConfig || {}
      let apiId = interfaceDataConfig.id; // 接口id、或数据集、数据表id
      let dataSetName = interfaceDataConfig.dataSetName;
      let queryConfigs = interfaceDataConfig.queryConfigs || [];
      let conditionList = [] as any;
      queryConfigs.forEach((queryConfig) => {
        if (!queryConfig.param_name) return false;
        if (queryConfig.param_value_type === 'V') {
          if (queryConfig.param_v_key) {
            queryConfig.param_value = varDataObj[queryConfig.param_v_key]
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
      let params = {
        id: apiId,
        name: dataSetName,
        conditionList,
        page: {
          pageIndex: 1,
          pageSize: 20,
        },
        orderBy: [],
      };
      getOpenDatasetResult(params).then((res) => {
        interfaceDataConfig.chartData && (interfaceDataConfig.chartData.rows = res.dataList || [])
        interfaceDataConfig.tableData = res.dataList || []
      });
    });
  }

  refreshComponent__balalalalala(componentConfigList, interfaceItem) { // 方法名要修改，使用es6 class重构

    componentConfigList.forEach((item) => {
      // let componentObj = {} as any;
      let type = item.type;
      let uuid = item.uuid;
      let contentDataSource = item.options.contentDataSource || "";
      let contentDataEcho = item.options.contentDataEcho || "";
      if (contentDataSource === "radio-button-interface") {
        let interfaceDataConfig = item.options.interfaceDataConfig;
        let apiKey = interfaceDataConfig.key;
        //2021-1-14 直接从interfaceList 里遍历获取接口返回值
        if (interfaceItem.componentUuidList.indexOf(uuid) !== -1 && interfaceItem.apiId === interfaceDataConfig.id) {
          let interfaceData = interfaceItem.interfaceData;
          interfaceDataConfig.value = interfaceData[apiKey];
          interfaceDataConfig.tableData = interfaceData[apiKey];
          interfaceDataConfig.chartData && (interfaceDataConfig.chartData.rows = interfaceData[apiKey])
          let options = item.options;
          //2021-03-17 发现form 组件调整了取值不再从interfaceData 里面取值，所以接口获取到的数据需要刷新columns
          if (item.type === 'van-design-form' && options.columns) {
            options.columns = [];
            interfaceDataConfig.tableData.forEach(colItem => {
              options.columns.push({
                label: colItem[options.labelKey],
                value: colItem[options.valueKey]
              })
            })
          }
          if (item.type == 'van-design-checkbox') {
            item.options.interfaceDataConfig.tableData = interfaceData[apiKey];
          } else if (item.type == 'van-design-radio' || item.type == 'van-design-select') {
            if (!item.options.value) {
              item.options.value = "";
            }
            item.options.interfaceDataConfig.tableData = interfaceData[apiKey];
          } else if (item.type == 'van-design-progress') {
            item.options.interfaceDataConfig.rateValue = interfaceData[interfaceDataConfig.rateKey]
            item.options.interfaceDataConfig.maxValue = interfaceData[interfaceDataConfig.maxKey]
          } else if (item.type === 'van-design-list') {
            // console.log('xxxx', interfaceData, apiKey)
            let listTemp = interfaceData[apiKey]
            saveAndUpdateLocalData(item.uuid, listTemp || [])
          }
        }

      }
      // 回显内容需要直接放到value
      if (contentDataEcho === 'radio-button-interface-echo') {
        let interfaceDataConfig = item.options.interfaceDataEchoConfig;
        let apiKey = interfaceDataConfig.key;
        //2021-1-14 直接从interfaceList 里遍历获取接口返回值
        if (interfaceItem.componentUuidList.indexOf(uuid) !== -1 && interfaceItem.apiId === interfaceDataConfig.id) {
          let interfaceData = interfaceItem.interfaceData;
          interfaceDataConfig.value = interfaceData[apiKey];
          interfaceDataConfig.tableData = interfaceData[apiKey];
          interfaceDataConfig.chartData && (interfaceDataConfig.chartData.rows = interfaceData[apiKey])
          let options = item.options;
          //2021-03-17 发现form 组件调整了取值不再从interfaceData 里面取值，所以接口获取到的数据需要刷新columns
          if (item.type === 'van-design-form' && options.columns) {
            options.columns = [];
            interfaceDataConfig.tableData.forEach(colItem => {
              options.columns.push({
                label: colItem[options.labelKey],
                value: colItem[options.valueKey]
              })
            })
          }
          if (item.type == 'van-design-checkbox') {
            let temp = interfaceData[apiKey].split(",");
            item.options.value = temp;
          } else if (item.type == 'van-design-radio' || item.type == 'van-design-select') {
            item.options.value = interfaceData[apiKey];
          }
        }

      }
      let componentOptions = item.options;
      if (
        coverBigComponent.indexOf(type) !== -1 &&
        item.options.columns &&
        item.options.columns.length
      ) {
        item.options.columns.forEach((columns) => {
          if (columns.componentList && columns.componentList.length) {
            this.refreshComponent__balalalalala(columns.componentList, interfaceItem);
          }
        });
      } else if (type === "van-design-group-component") {
        this.refreshComponent__balalalalala(item.options.componentList, interfaceItem);
      }
    });
  }

  // 获取所有子节点组件 TODO::: 这样引用的是原component对象，慎重对该对象进行修改
  pickComponentList(componentConfigList, leafsComponentList) {
    componentConfigList.forEach((item) => {
      // let newItem = componentDeepClone(item);
      let newItem = item
      // let componentObj: any = {};
      let type = newItem.type;
      // let name = newItem.name;
      // let uuid = newItem.uuid;
      // let options = newItem.options;
      let optionsColumns = newItem.options && newItem.options.columns;
      if (
        coverBigComponent.indexOf(type) !== -1 &&
        optionsColumns &&
        optionsColumns.length
      ) {
        optionsColumns.forEach((columnItem) => {
          if (columnItem.componentList && columnItem.componentList.length) {
            this.pickComponentList(
              columnItem.componentList,
              leafsComponentList
            );
          }
        });
      } else if (type == 'van-design-group-component') {
        // 2021-10-26 由于 复合组件 有个问题，就是没有columns 虽然也包含在coverBigComponent 里 所以这边做一个处理
        this.pickComponentList(
          newItem.options.componentList,
          leafsComponentList
        );

      }
      // componentObj.type = type;
      // componentObj.name = name;
      // componentObj.uuid = uuid;
      // componentObj.options = options;
      leafsComponentList.push(newItem);
    });
  }
}

// export function handleInterface(componentList, interfaceList) {
//   /**
//    * 
//    * TODO::: 没有处理数据表及数据集的数据源
//    * 
//    */
//   componentList.forEach((itemComponent) => {
//     let contentDataSource = itemComponent.options.contentDataSource || "";
//     let contentDataEcho = itemComponent.options.contentDataEcho || "";
//     if (contentDataSource === "radio-button-interface" || contentDataEcho==='radio-button-interface-echo') {
//       let interfaceDataConfig = contentDataSource === "radio-button-interface"?itemComponent.options.interfaceDataConfig:itemComponent.options.interfaceDataEchoConfig || {};
//       let apiId = interfaceDataConfig.id;
//       // 循环 interfaceList 判断是否已经存在
//       let existFlag = false;
//       interfaceList &&
//         interfaceList.forEach((element) => {
//           if (element.apiId === apiId) {
//             existFlag = true;
//             //存在就 推入新的uuid
//             element.componentUuidList.push(itemComponent.uuid);
//           }
//         });
//       if (!existFlag) {
//         let params = {};
//         let paramsConfigs = interfaceDataConfig.paramsConfigs || [];
//         paramsConfigs.forEach((paramsConfig) => {
//           let relevanceComponentUuid = paramsConfig.relevanceComponentUuid;
//           componentList.forEach((uuidComponent) => {
//             if (uuidComponent.uuid === relevanceComponentUuid) {
//               paramsConfig.param_value = uuidComponent.options.value;
//             }
//           });
//           params[paramsConfig.param_name] = paramsConfig.param_value; // TODO::: 待优化，要通过uuid遍历实时获取
//         });
//         const data = {
//           dataApiId: apiId,
//           params,
//         };
//         let interfaceItem = {
//               apiId: apiId,
//               componentUuidList: [itemComponent.uuid],
//               data: data,
//               interfaceData:{},
//             };               
//             interfaceList.push(interfaceItem);                       

//       }
//     }
//   });
// }
// export function handleInterfaceData(componentConfigList,interfaceList){
//   interfaceList.forEach(interfaceItem=>{
//     getProcesseDataList(interfaceItem.data).then((res) => {
//       if (res.code === 0) {
//         let interfaceData = res.data;
//         interfaceItem.interfaceData=interfaceData;
//         refreshComponent__balalalalala(componentConfigList,interfaceItem);
//       } else {
//       }
//     });
//   });
// }
// export function refreshComponent__balalalalala(componentConfigList, interfaceItem) { // 方法名要修改，使用es6 class重构
//   componentConfigList.forEach((item) => {
//     let componentObj = {} as any;
//     let type = item.type;
//     let uuid = item.uuid;
//     let contentDataSource = item.options.contentDataSource || "";
//     let contentDataEcho = item.options.contentDataEcho || "";
//     if (contentDataSource === "radio-button-interface" || contentDataEcho==='radio-button-interface-echo') {
//       let interfaceDataConfig = contentDataSource === "radio-button-interface"?item.options.interfaceDataConfig:item.options.interfaceDataEchoConfig || {};
//       let apiKey = interfaceDataConfig.key;
//       //2021-1-14 直接从interfaceList 里遍历获取接口返回值
//         if (interfaceItem.componentUuidList.indexOf(uuid) !== -1) {
//           let interfaceData = interfaceItem.interfaceData;
//           interfaceDataConfig.value = interfaceData[apiKey];
//           interfaceDataConfig.tableData = interfaceData[apiKey];
//           let options = item.options;
//           //2021-03-17 发现form 组件调整了取值不再从interfaceData 里面取值，所以接口获取到的数据需要刷新columns
//           if(options.columns){
//             options.columns=[];
//             interfaceDataConfig.tableData.forEach(colItem=>{
//               options.columns.push({
//                 label:colItem[options.labelKey],
//                 value:colItem[options.valueKey]
//               })
//             })
//           }
//           if(item.type=='van-design-checkbox'){
//             let temp = interfaceData[apiKey].split(",");
//             item.options.value=temp;
//           }else if(item.type=='van-design-radio'||item.type=='van-design-select'){
//             item.options.value=interfaceData[apiKey];
//           }
//         }

//     }
//     let componentOptions = item.options;
//     if (
//       coverBigComponent.indexOf(type) !== -1 &&
//       item.options.columns &&
//       item.options.columns.length
//     ) {
//       item.options.columns.forEach((columns) => {
//         if (columns.componentList && columns.componentList.length) {
//           this.refreshComponent__balalalalala(columns.componentList, interfaceItem);
//         }
//       });
//     } else if (type === "van-design-group-component") {
//       this.refreshComponent__balalalalala(item.options.componentList, interfaceItem);
//     }
//   });
// }
