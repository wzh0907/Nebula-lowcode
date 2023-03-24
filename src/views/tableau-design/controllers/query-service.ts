import { getListService, getTableListService, getTableFieldService } from '@/api/database.js'
import { getReductionItemService,  getReductionDatasetService  } from '@/api/data-trim.js'
// 引入类型
import {  d3RootJsonType, d3RootJsonChildrenType } from '../types/type'
import {
  reductionItemServiceType,
  tableFieldServiceType,
  tableListServiceType,
  dbConfigListServiceType,
  reductionResultListServiceType,
  reductionDatasetListServiceType,
  reductionExecuteResType
} from '../types/service-type'

import MasterMask from './index'
export default class QueryService extends MasterMask {
  queryDatasetInfo(tableId: number, tableName: string) {
    if (!tableId) return false
    this.listLoading = true
    getReductionItemService({
      dsConfigId: tableId,
    }).then((res: reductionItemServiceType) => {
      this.listLoading = false
      let dataList = res.data.dataSetFieldList || []
      dataList.forEach((item) => {
        item.name = item.fieldName
        item.type = item.fieldType
        item.tableName = tableName
        item.tableId = tableId
        item.isShow = !item.hide
      })
      this.dataTableInfo = this.dataTableInfo.concat(dataList)
      // console.log(res)
    }).catch(() => {
      this.listLoading = false
    })
  }
  queryDataTableInfo(dbConfigId: number, tableId: number, tableName: string) {
    if (!tableId) return false
    this.listLoading = true
    getTableFieldService({
      tableId,
      dbConfigId,
      tableName
    }).then((res: tableFieldServiceType) => {
      this.listLoading = false
      let dataList = res.dataList || []
      dataList.forEach(item => {
        item.tableName = tableName
        item.tableId = tableId
        item.isShow = true
      })
      this.dataTableInfo = this.dataTableInfo.concat(dataList)
    }).catch(() => {
      this.listLoading = false
    })
  }
  queryDataTableList(dbConfigId: number) {
    if (!dbConfigId) return false
    this.listLoading = true
    const params = {
      dbConfigId,
      size: 9999,
      queryType: 'table'
    }
    getTableListService(params).then((res: tableListServiceType) => {
      this.dataTableList = res.dataList || []
      this.listLoading = false
      this.dataTableList.forEach((item) => {
        item.id = item.tableId
      })
      // 初始化拖拽控件
      this.$nextTick(() => {
        this.nativeDrag()
      })
    }).catch(() => {
      this.listLoading = false
    })
  }
  queryDatabaseList() {
    this.listLoading = true
    let params = {
    }
    getListService(params).then((res: dbConfigListServiceType) => {
      this.databaseList = res.dataList || []
      // this.databaseTotal = this.databaseList.length
      this.listLoading = false
      this.selectedDatabaseId = this.databaseList[0] && this.databaseList[0].id
      this.queryDataTableList(this.selectedDatabaseId)
    }).catch(() => {
      this.listLoading = false
    })
  }
  // @ts-ignore
  queryReductionItemService() {
    this.listLoading = true
    getReductionItemService({
      dsConfigId: this.id
    }).then((res: reductionResultListServiceType) => {
      let data = res.data || {} as reductionResultListServiceType['data']
      let graphConfig = JSON.parse(data.graphConfig || '{}') // 类型 as fromDataListServiceType[0]
      this.filterConfig = JSON.parse(data.filterConfig || '[]')
      this.statisticsConfig = JSON.parse(data.statisticsConfig || '{}')
      this.processListData = data.processList || []
      this.reductionName = data.name
      console.log(graphConfig)

      let tableList: d3RootJsonChildrenType = [] // 把所有表保存  遍历获取表字段
      let childrenArr: d3RootJsonChildrenType = []
      let d3RootJson: d3RootJsonType = {
        id: graphConfig.nodeId,
        name: graphConfig.nodeName,
        nodeType: '',
        children: childrenArr
      }
      tableList.push({
        name: graphConfig.nodeName,
        id: graphConfig.nodeId,
        nodeType: graphConfig.nodeType
      })
      this.connectDataObj[graphConfig.nodeId] = graphConfig.parentConnectData || {}
      this.handleGraphConfig(graphConfig.rightNodes, childrenArr, tableList)
      tableList.forEach(item => {
        setTimeout(() => {
          this.reloadTableInfoData(item.nodeType === 'dataSet', item.name, item.id)
        }, 1000)
      })

      this.d3RootJson = d3RootJson
      this.initD3(this, this.d3RootJson)
      this.listLoading = false
    }).catch(() => {
      this.listLoading = false
    })
  }
  queryDaSetList() {
    this.listLoading = true
    getReductionDatasetService().then((res: reductionDatasetListServiceType) => {
      this.datasetsList = res.dataList || []
      this.listLoading = false
    }).catch(() => {
      this.listLoading = false
    })
  }
}