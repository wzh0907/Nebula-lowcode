import {
  getReductionDataSetListService,
  getOpenDatasetResult,
  getOpenDataTableResult, getProcesseDataList, getMockResult, saveMockResult
} from "@/api/chartsData";
import { getProcessParamService } from "@/api/process";
import {
  getDbTableDataList,
  getDbTableColumnsList,
} from "@/api/database-command/index.js";
import {getStorage,setStorage} from "@/util/storageUtil.js";
/**
 * 编辑器 初始化数据model 用的类，在执行阶段应该是用不到的
 */
export default class QueryInterfaceData {
  interfaceList: []
  env: String


  constructor(interfaceList, env?) {
    this.interfaceList = interfaceList;
    if (env) {
      this.env = env;
    } else {
      this.env = getStorage("authEnv") || "dev";
    }

  }

  run() {
    this.interfaceList.forEach(interfaceItem => {
      // interfaceItem
      this.getInterfaceParamAndData(interfaceItem)
    })
  }
  saveInterfacParamAndData(apiData) {
    this.interfaceList.forEach((interfaceItem: any) => {
      // interfaceItem
      if (interfaceItem.id == apiData.id) {
        this.getInterfaceParamAndData(interfaceItem);
      }
    })
  }
  getInterfaceParamAndData(interfaceItem: any) {
    // 流程和接口可以直接获取 入参 以及 返回值
    if (interfaceItem.data.isMockData != true
      && (interfaceItem.type == 'radio-button-interface' || interfaceItem.type == 'radio-button-connect')) {
      this.getMockDataProcessing(interfaceItem);
      // this.getDataProcessing(interfaceItem);
      this.getDataProcessParam(interfaceItem);
    } else if (interfaceItem.type === 'radio-button-tables') {
      // 获取数据表 字段 以及返回值
      this.getDataTableField(interfaceItem)
      this.getOpenDataTableResult(interfaceItem);
    } else if (interfaceItem.type === 'radio-button-dataset') {
      // sql 脚本
      this.getDataSetField(interfaceItem)
      this.getDatasetResult(interfaceItem)
    } else if (interfaceItem.type === 'radio-button-view') {
      // 视图
      this.getViewData(interfaceItem)
    }
  }
  getMockDataProcessing(interfaceItem: any) {
    console.log('getMockDataProcessing======');
    if (this.env === 'dev' && interfaceItem.data.mockFlag && interfaceItem.data.isMockData != true) {
      const mockQuery = {
        processId: interfaceItem.data.id,
        type: 'report',
      }
      getMockResult(mockQuery).then(res => {
        if (!res.data) {
          this.getDataProcessing(interfaceItem);
        } else {
          let apiInterfaceData = JSON.parse(res.data.mockData);
          interfaceItem.data.responseData = apiInterfaceData;
        }
      }).catch(e => {
      })
    } else {
      console.log('else else else')
      this.getDataProcessing(interfaceItem);
    }

  }
  getDataProcessing(interfaceItem: any) {
    console.log('getDataProcessing======', interfaceItem.data)
    if (interfaceItem.data.isMockData != true) {
      const data = {
        dataApiId: interfaceItem.data.id,
        params: {},
      };
      getProcesseDataList(data).then((res) => {
        if (res.code === 0) {
          // this.interfaceKeyList = []
          let apiInterfaceData = res.data;
          interfaceItem.data.responseData = apiInterfaceData;
          let mockParam = {
            processId: interfaceItem.data.id,
            type: 'report',
            mockData: JSON.stringify(res.data)
          }
          // TODO 这里需要处理 ，不需要每次请求的时候都保存mock 数据
          if (this.env === 'dev' && interfaceItem.data.mockFlag) {
            saveMockResult(mockParam);
          }
        } else {
        }
      }).catch(e => {
        interfaceItem.data.responseData = {};
      });
    }
  }
  getDataProcessParam(interfaceItem: any) {
    const data = {
      processId: interfaceItem.data.id,
    };
    getProcessParamService(data).then(res => {
      if (res.code == 0) {
        let dataList = res.data.params;
        interfaceItem.data.version = res.data.version;
        dataList && dataList.forEach((dItem) => {

          let existFlag = false;
          interfaceItem.data.paramsConfigs && interfaceItem.data.paramsConfigs.forEach((pConfig) => {
            if (dItem.name == pConfig.param_name) {
              existFlag = true
            }
          })
          if (!existFlag) {
            let obj = {
              param_name: dItem.name,
              param_value: "",
            };
            interfaceItem.data.paramsConfigs.push(obj);
          }

        });
        // 2023-03-23 反向清除逻辑，如果接口处删除了入参，则引擎对应的删除
        interfaceItem.data.paramsConfigs && interfaceItem.data.paramsConfigs.forEach((pConfig,pIndex) => {
            let existFlag = false;
            dataList && dataList.forEach((dItem) => {
                if (dItem.name == pConfig.param_name) {
                    existFlag = true
                  }
            })
            if (!existFlag) {
                interfaceItem.data.paramsConfigs.splice(pIndex,1)
            }
        });

        let resList = res.data.res;
        resList && resList.forEach((rItem) => {
          let existFlag = false;
          for (let key in interfaceItem.data.responseData) {
            if (key == rItem.name) {
              existFlag = true
            }
          }
          if (!existFlag) {
            interfaceItem.data.responseData[rItem.name] = "";
          }
        });
      }
    })
  }
  getDataTableField(interfaceItem) {
    let dbConfigId = interfaceItem.data.dbConfigId
    let tableName = interfaceItem.data.tableName
    let tableId = interfaceItem.data.tableId

    // getTableFieldService
    getDbTableColumnsList({ dbConfigId, tableName, tableId }).then(res => {
      interfaceItem.data.tableFieldList = res.dataList
    })
  }
  // 获取数据表数据
  getOpenDataTableResult(interfaceItem) {
    let params = {
      id: interfaceItem.data.businessId,
      name: interfaceItem.data.tableName,
      conditionList: [],
      page: {
        pageIndex: 1,
        pageSize: 20
      },
      orderBy: [{}]
    }
    getOpenDataTableResult(params).then(res => {
      interfaceItem.data.responseData = res.dataList || []
    })
  }
  getDataSetField(interfaceItem) {
    let dataSetId = interfaceItem.data.id
    getReductionDataSetListService({ id: dataSetId }).then(res => {
      interfaceItem.data.datasetParamsList = res.data.params;
    })
  }
  // 获取数据集结果（sql脚本）
  getDatasetResult(interfaceItem) {
    let params = {
      id: interfaceItem.data.dataSetId,
      name: interfaceItem.data.dataSetName,
      conditionList: [],
      page: {
        pageIndex: 1,
        pageSize: 20
      },
      orderBy: []
    }
    getOpenDatasetResult(params).then(res => {
      let responseDataList = res.dataList || []
      if (responseDataList.length > 20) {
        responseDataList = responseDataList.splice(0, 20)
      }
      interfaceItem.data.responseData = responseDataList || []
    })
  }
  // 获取视图 列 以及 值
  getViewData(interfaceItem) {
    let dbConfigId = interfaceItem.data.dbConfigId
    let name = interfaceItem.data.name
    getDbTableDataList({
      dbConfigId: dbConfigId,
      tableName: name,
    }).then(res => {
      let columnList = res.data.columnList || []
      let valueList = res.data.valueList || []
      let responseDataList = [] as any
      valueList.forEach((valueItem, valueIndex) => {
        let obj
        columnList.forEach((columnItem, columnIndex) => {
          obj[columnItem.name] = valueItem[columnIndex]
        })
        responseDataList.push(obj)
      })
      if (responseDataList.length > 20) {
        responseDataList = responseDataList.splice(0, 20)
      }
      interfaceItem.data.responseData = responseDataList || []
    })
  }
}
