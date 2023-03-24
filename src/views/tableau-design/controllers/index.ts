import { Vue } from 'vue-property-decorator';

import customHeader from '@/components/customHeader/index.vue'
import uploadCommentDialog from "../../report/modules/uploadComment/index.vue";
import connectionDialog from '../modules/connection.vue'
import sqlParamsModule from '../modules/common/sql-params-module.vue'
import fieldSetView from '../modules/field-set-view.vue'
import filterView from '../modules/filter/filter-view.vue'
import statView from '../modules/stat/stat-view.vue'
import processView from '../modules/process/process-view.vue'
import codeEditor from '@/components/CodeEditor/index.vue'
import { getListService, getTableListService, getTableFieldService } from '@/api/database.js'
import { getReductionItemService, getReductionExecuteService, getReductionDatasetService, addReductionItemV4Service, editReductionItemV4Service } from '@/api/data-trim.js'
import { isStringDict, isNumberDict, isDatetimeDict } from '../utils/field-type'

// ts
import initD3 from './rander-d3'
// 引入类型
import { filterConfigType, d3RootJsonType, d3RootJsonChildrenType, fromDataListServiceType, connectDataObjType } from '../types/type'
import { reductionItemServiceType, tableFieldServiceType, tableListServiceType, dbConfigListServiceType, reductionResultListServiceType, reductionDatasetListServiceType, reductionExecuteResType } from '../types/service-type'
// 自定义事件
import {
  serviceReadyStatusMap,
  readyQueryReductionItemServiceEvent,
  readyQueryDataTableInfoEvent,
  previewDataButtonEvent,
  saveDataButtonEvent
} from './custom-event/index'
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default Vue.extend({
  name: 'bi',
  components: {
    customHeader,
    uploadCommentDialog,
    connectionDialog,
    codeEditor,
    sqlParamsModule,
    fieldSetView,
    filterView,
    statView,
    processView
  },
  props: ['id', 'currentFileData', 'scriptModel', 'currentDataType'],
  data() {
    return {
      tabView: 'dataTable',
      serviceReadyStatusMap, // 接口状态map
      // id: '',
      currentDirId: '0',
      reductionName: '',
      contentViewHeight: '0px',
      contentHeaderHeight: '',
      contentTableListHeight: '',
      modelType: 'query',
      tabHeaderView: 'first',
      tabContentView: 'preview',
      modelTypeDict: {
        query: 'query',
        insert: 'create',
        create: 'insert',
        edit: 'update',
        update: 'edit',
        delete: 'delete'
      } as any,
      operationTableFieldList: [] as any,
      joinTypeIconMap: {
        'left': require('../images/left.png'),
        'in': require('../images/in.png'),
        'right': require('../images/right.png')
      },
      fieldPopoverVisible: false,
      processDialogVisible: false,
      filterDialogVisible: false,
      collectDialogVisible: false,
      connectionDialogVisible: false,
      uploadCommentVisible: false,
      uploadCommentTitle: '组件上传',
      // renameFieldDialogVisible: false,
      isShowSiderTableSearch: false,
      isShowSiderDatasetsSearch: false,
      isShowTargetZone: true,
      isRenderTargetZone: true,
      isShowTable: false,
      // isShowHideField: false,
      isEditMode: false,
      isScriptModel: false,
      scriptModelType: 'sql', // 脚本模式下，细分sql模式: sql、视图: view、存储过程: procedure
      execSqlText: '',
      codeEditorMode: 'sql',
      editorOptions: {
        showGutter: false
      },
      // sourceZoneItems: <any>[],
      // targetZoneItems: <any>[],
      connectLineRightId: 0,
      connectLineLeftId: 0,
      connectDataObj: <connectDataObjType>{},
      joinTypeProps: 'inner',
      connectFieldListProps: [{}],
      // dataTableType: 1,
      tableSearchKey: '',
      dataSetSearchKey: '',
      modeTypesMap: {
        query: '查询',
        insert: '新增',
        edit: '修改',
        delete: '删除'
      },
      isStringDict: isStringDict,
      isNumberDict: isNumberDict,
      isDatetimeDict: isDatetimeDict,
      dataTypeIconDict: {
        'INT': '#',
        'BIT': '#',
        'VARCHAR': 'Abc'
      },
      svgD3: '',
      svgD3Width: 400,
      svgD3Height: 400,
      d3RootJson: <d3RootJsonType>{},
      selectedD3TableName: '',
      selectedD3TableId: 0,
      // selectedFieldRename: '',
      // selectedFieldRenameItem: <reductionExecuteResType['data']['columnList'][0]>{},
      // selectedFieldRenameIndex: 0,
      // selectedSortField: 'aaa',
      selectedDatabaseId: 0,
      selectedLeftTableList: <tableFieldServiceType['dataList']>[],
      selectedRightTableList: <tableFieldServiceType['dataList']>[],
      selectedD3TreeTableIdsMap: [] as number[], // 所有拖入模型配置的table id
      datasetsList: <reductionDatasetListServiceType['dataList']>[],
      databaseList: <dbConfigListServiceType['dataList']>[],
      dataTableList: <tableListServiceType['dataList']>[],
      dataTableInfo: <tableFieldServiceType['dataList']>[],
      dataTableInfoMap: {} as any,
      dataTableInfoMapPick: {} as any,
      dataSetFieldList: [] as any, // 字段设置tab页的数据
      executeResultColumnList: <reductionExecuteResType['data']['columnList']>[],
      executeResultValueList: <reductionExecuteResType['data']['valueList']>[],
      executeReductionLimit: 10,
      singleTableInfoList: <tableFieldServiceType['dataList']>[],
      singleTableConfig: {}, // 在编辑模式下，当前选中表的基本信息
      // pagination: {},
      listLoading: false,
      // 处理后传给接口的参数
      filterConfig: {} as any,
      statisticsConfig: {} as any,
      processListData: [] as any,
      sqlParamList: [] as any
    }
  },
  created() {
    // this.id = <string>this.$route.query.id
    // this.currentDirId = this.$route.query.currentDirId as string || '0'
    this.isScriptModel = this.scriptModel === 'scriptModel'
    if (this.id) {
      this.queryReductionItemService().then(() => {
        this.queryDatabaseList()
        this.queryDaSetList()
        this.executeReductionService()
      })
    } else {
      this.queryDatabaseList()
      this.queryDaSetList()
    }
    // test
    // if (this.currentDataType && this.currentDataType !== 'dataset') {
    //   let typeMap = {
    //     'dataset-view': 'View',
    //     'dataset-storedProcedure': 'StoredProcedure'
    //   }
    //   this.scriptModelType = typeMap[this.currentDataType] || 'sql'
    // }
    // console.log('xxxxxx', this.scriptModelType)
  },
  mounted() {
    this.initD3(this, this.d3RootJson)
    this.initTargetZone()
    this.initWaitServiceEvent()
    let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - 55
    this.contentViewHeight = height - 41 + 'px'
    this.contentHeaderHeight = height - (55 * 2) - 10 + 'px' // (55 * 2) = 两个nav高度、10 = padding-top-bottom
    this.contentTableListHeight = height - 185 + 'px';
  },
  beforeDestroy() {
    this.onSaveData()
    this.uploadComment()
  },
  methods: {
    testHandleDialog() { // TODO: 临时方法
      // this.tabHeaderView === 'xx'
      //   ? this.collectDialogVisible = true
      //   : (this.tabHeaderView === 'yy'
      //     ? this.processDialogVisible = true
      //     : (this.tabHeaderView === 'filter'
      //       ? this.filterDialogVisible = true
      //       : '')
      //     )
    },
    initTargetZone() {
      let contentTargetZoneEl = document.getElementsByClassName('content-target-zone')[0]
      contentTargetZoneEl.setAttribute('style', `width: ${this.svgD3Width + 200}px; height: ${this.svgD3Height + 50}px;`)
    },
    initWaitServiceEvent() {
      // window.addEventListener('readyQueryReductionItemServiceEvent', () => {
      //   console.log(serviceReadyStatusMap)
      // })
    },
    /******************* 响应页面事件 ***********************/
    onPreviewData() {
      window.dispatchEvent(previewDataButtonEvent)
      this.executeReductionService(() => {
        this.isShowTable = false
        this.$nextTick(() => {
          this.isShowTable = true
        })
      })
    },
    onChangeDataSetFieldList(data: any) {
      this.dataSetFieldList = data
    },
    onSiderMenuOpen(index: any, isDataSet: boolean) {
      // console.log(this.dataTableList)
      let dataTable = this.dataTableList[index] || {}
      let tableName = dataTable.tableName
      let tableId = dataTable.tableId
      // 如果是数据集
      let dataset = this.datasetsList[index] || {}
      if (isDataSet) {
        tableName = dataset.dataSetName
        tableId = dataset.id
      }
      if (this.dataTableInfoMap[tableId]) return false
      this.reloadTableInfoData(isDataSet, tableName, tableId)
    },
    onHandleModeTypeCommand(command: string) {
      if (command !== 'query' && !this.selectedD3TreeTableIdsMap.length) {
        this.$message.warning('请添加一张数据表进行操作')
        return false
      }
      this.modelType = command
      this.handleChangeModelType()
    },
    onGetSqlParams(data: any) {
      // console.log(data)
      this.sqlParamList = data || []
    },
    onSearchField(val: string) {
      this.dataTableList.forEach((item) => {
        if (item.tableName.indexOf(val) === -1) {
          item.isHide = true
        } else {
          item.isHide = false
        }
      })
    },
    onSearchFieldDataset(val: string) {
      this.datasetsList.forEach((item) => {
        if (item.dataSetName.indexOf(val) === -1) {
          item.isHide = true
        } else {
          item.isHide = false
        }
      })
    },
    onCollectData(data: any) {
      // console.log(data)
      this.statisticsConfig = data || {}
      // this.executeReductionService()
    },
    onProcessData(data: any) {
      // console.log(data)
      this.processListData = data || []
      // this.executeReductionService()
    },
    onChangeLimit() {
      this.executeReductionService()
    },
    onChangeModel() {
      // console.log(this.isScriptModel)
    },
    //删除组件
    deleComment() {
      let deleCreatGroupEvent = new CustomEvent('dele-creat-group', { detail: { data: this.currentFileData } })
      window.dispatchEvent(deleCreatGroupEvent)
    },
    onFilterData(filterConfig: filterConfigType) {
      /**
       * TODO::
       * 注意！
       * filterConfig的结构已经改变，从Array改为Object，但是Ts的类型还没来得更新
       */
      // console.log('筛选参数：')
      // console.log(filterConfig)
      // console.log(JSON.stringify(filterConfig))
      this.filterConfig = filterConfig
      // this.executeReductionService()
    },
    onHideShowTableField(data: { isShow: boolean }) {
      data.isShow = !data.isShow
      this.fieldPopoverVisible = false
    },
    onExecuteData() {
      // console.log('type: ', this.modelType)
      // console.log('要操作的表信息: ', this.singleTableConfig)
      // console.log('筛选器: ', this.filterConfig)
      let operationTableFieldList: any = []
      if (this.modelType === 'insert' || this.modelType === 'edit') {
        this.singleTableInfoList.forEach(item => {
          if (!item.newValue) return false;
          let obj = {
            type: item.isInputVar ? 'V' : 'C',
            fieldName: item.name,
            fieldValue: item.newValue
          }
          operationTableFieldList.push(obj)
        })
        // console.log('要操作的字段列表: ', operationTableFieldList)
      }
      this.operationTableFieldList = operationTableFieldList
      this.onSaveData() // 获取要操作的字段后保存
    },
    onSaveData(noOnEvent?: boolean) { // noOnEvent: 需不需要触发saveEvent事件
      if (!this.reductionName) return this.$message.warning('请输入数据集名称')
      // console.log(this.tabHeaderView)
      if (this.tabHeaderView === 'filter' && !noOnEvent) {
        window.dispatchEvent(saveDataButtonEvent)
        return false;
      }
      // console.log('筛选参数 save data：')
      // console.log(this.filterConfig)
      // console.log(JSON.stringify(this.filterConfig))
      if (this.id) return this.editReductionService()
      this.addReductionService()
    },
    uploadComment() {
      this.uploadCommentVisible = true;
      this.uploadCommentTitle = '组件上传';
    },
    onGetConnectData(connectData: {
      parentNodeId: number
      rightId: number
      joinType: string
      connectFieldList: []
    }) {
      this.connectDataObj[connectData.rightId] = connectData
      this.executeReductionService()
    },
    onAddDatabase() {
      let routeUrl = this.$router.resolve({
        path: "/database",
        query: {}
      });
      window.open(routeUrl.href, '_blank');
    },
    /************************ 辅助处理数据 ****************************/
    showConnectionDialog(leftTableId: number, rightTableId: number) {
      this.connectionDialogVisible = true;
      this.connectLineLeftId = leftTableId;
      this.connectLineRightId = rightTableId;
      let connectData = this.connectDataObj[rightTableId] || {}
      // 获取要关联的两个表
      this.selectedLeftTableList = []
      this.selectedRightTableList = []
      this.dataTableInfo.forEach(tableData => {
        if (tableData.tableId === leftTableId || tableData.dataSetId === leftTableId) {
          this.selectedLeftTableList.push(tableData)
        } else if (tableData.tableId === rightTableId || tableData.dataSetId === rightTableId) {
          this.selectedRightTableList.push(tableData)
        }
      })
      this.joinTypeProps = connectData.joinType || 'inner'
      this.connectFieldListProps = connectData.connectFieldList || [{ connectType: '=' }]
    },
    delZoneDataTable(id: number) {
      let vm = this
      let selectedD3TreeTableItemMap: {
        id: number,
        name: string,
        nodeType: string
      }[] = []
      function depFunc(childrenData: d3RootJsonChildrenType, id: number) {
        childrenData.forEach((item, index) => {
          if (item.id === id) {
            childrenData.splice(index, 1)
            return false
          } else {
            selectedD3TreeTableItemMap.push({
              id: item.id,
              name: item.name,
              nodeType: item.nodeType
            })
          }
          if (item.children) depFunc(item.children, id)
        })
      }
      this.$msgbox({
        title: '删除',
        message: '请确认是否删除？',
        showCancelButton: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          delete this.dataTableInfoMapPick[id]
          if (id === this.d3RootJson.id) {
            this.d3RootJson = <d3RootJsonType>{}
          } else {
            selectedD3TreeTableItemMap.push({
              id: this.d3RootJson.id,
              name: this.d3RootJson.name,
              nodeType: this.d3RootJson.nodeType
            })
            if (this.d3RootJson.children) depFunc(this.d3RootJson.children, id)
          }
          this.selectedD3TreeTableIdsMap = []
          this.dataTableInfo = []
          selectedD3TreeTableItemMap.forEach(item => {
            this.selectedD3TreeTableIdsMap.push(item.id)
            this.reloadTableInfoData(item.nodeType === 'dataSet', item.name, item.id)
          })
          setTimeout(() => {
            this.reloadD3Init()
          }, 1000)
        })
        .catch(() => { })
    },
    reloadTableInfoData(isDs: boolean, tableName: string, tableId: number) {
      if (isDs) {
        this.queryDatasetInfo(tableId, tableName)
      } else {
        if (tableId) this.queryDataTableInfo(this.selectedDatabaseId, tableId, tableName)
      }
    },
    /******************** 查询接口获取数据 *********************/
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
          /**
           * TODO::: BUG  可能造成bug
           */
          // item.tableName = tableName
          // item.tableId = tableId
          item.dataSetName = tableName
          item.dataSetId = tableId
          item.isShow = !item.hide
        })
        this.dataTableInfo = this.dataTableInfo.concat(dataList)
        this.dataTableInfoMap[tableId] = dataList
        if (this.selectedD3TreeTableIdsMap.indexOf(tableId) !== -1) this.dataTableInfoMapPick[tableId] = dataList;
      }).catch(() => {
        this.listLoading = false
      })
    },
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
        this.dataTableInfoMap[tableId] = dataList
        if (this.selectedD3TreeTableIdsMap.indexOf(tableId) !== -1) this.dataTableInfoMapPick[tableId] = dataList;
        // console.log(this.dataTableInfoMap)
        // 异步操作完成发送事件
        window.dispatchEvent(readyQueryDataTableInfoEvent)
      }).catch(() => {
        this.listLoading = false
      })
    },
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
    },
    queryDatabaseList() {
      this.listLoading = true
      getListService().then((res: dbConfigListServiceType) => {
        this.databaseList = res.dataList || []
        // this.databaseTotal = this.databaseList.length
        this.listLoading = false
        if (!this.selectedDatabaseId) this.selectedDatabaseId = this.databaseList[0] && this.databaseList[0].id
        this.queryDataTableList(this.selectedDatabaseId)
      }).catch(() => {
        this.listLoading = false
      })
    },
    async queryReductionItemService() {
      this.listLoading = true
      //组件上传需要reportId
      setStorage('reportId', this.id)
      await getReductionItemService({
        dsConfigId: this.id
      }).then((res: reductionResultListServiceType) => {
        let data = res.data || {} as reductionResultListServiceType['data']
        let graphConfig = JSON.parse(data.graphConfig || '{}') // 类型 as fromDataListServiceType[0]
        let filterConfig = JSON.parse(data.filterConfig || '{}')
        this.filterConfig = filterConfig
        this.statisticsConfig = JSON.parse(data.statisticsConfig || '{}')
        this.processListData = data.processList || []
        this.reductionName = data.name
        this.modelType = this.modelTypeDict[data.type] || 'query'
        this.isScriptModel = data.modeType !== 'design'
        this.scriptModelType = data.modeType
        this.operationTableFieldList = data.dmlVOList || []
        this.execSqlText = data.execSqlText
        this.sqlParamList = data.sqlParamList || []
        this.selectedDatabaseId = data.dbConfigId || 0
        this.dataSetFieldList = data.dataSetFieldList || []

        // 上传组件存类型
        setStorage('subType', data.modeType)

        let tableList: d3RootJsonChildrenType = [] // 把所有表保存  遍历获取表字段
        let childrenArr: d3RootJsonChildrenType = []
        let d3RootJson: d3RootJsonType = {
          id: graphConfig.nodeId,
          name: graphConfig.nodeName,
          nodeType: graphConfig.nodeType, // TODO::: TEST   ===>  nodeType: '',
          children: childrenArr
        }
        tableList.push({
          name: graphConfig.nodeName,
          id: graphConfig.nodeId,
          nodeType: graphConfig.nodeType
        })
        this.connectDataObj[graphConfig.nodeId] = graphConfig.parentConnectData || {}
        if (this.selectedD3TreeTableIdsMap.indexOf(graphConfig.nodeId) === -1) this.selectedD3TreeTableIdsMap.push(graphConfig.nodeId)
        this.handleGraphConfig(graphConfig.rightNodes, childrenArr, tableList)
        tableList.forEach(item => {
          setTimeout(() => {
            this.reloadTableInfoData(item.nodeType === 'dataSet', item.name, item.id)
          }, 1000)
        })

        this.d3RootJson = d3RootJson
        this.initD3(this, this.d3RootJson)
        this.listLoading = false
        // 异步操作完成发送事件
        window.dispatchEvent(readyQueryReductionItemServiceEvent)
        // 监听下一个异步操作完成的事件
        window.addEventListener('readyQueryDataTableInfoEvent', () => {
          this.handleChangeModelType() // 获取模式，执行模式处理方法
        })
      }).catch(() => {
        // 上传组件失败存类型
        setStorage('subType', '')
        this.listLoading = false
      })
    },
    queryDaSetList() {
      this.listLoading = true
      getReductionDatasetService().then((res: reductionDatasetListServiceType) => {
        this.datasetsList = res.dataList || []
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    /********************* 对json数据进行特殊处理 **************************/
    handleCurrentChange() { },
    handleChangeModelType() {
      this.isEditMode = ['insert', 'edit', 'delete'].indexOf(this.modelType) !== -1
      if (!this.isEditMode) {
        this.isShowTargetZone = true
        return false
      }
      if (this.d3RootJson.children?.length) this.filterConfig = {} // 如果切换到编辑模式并且有多表时，清空筛选条件

      let singleTableConfig = {
        id: this.d3RootJson.id,
        name: this.d3RootJson.name,
        depth: this.d3RootJson.depth,
        nodeType: this.d3RootJson.nodeType
      }
      let singleTableInfoList = <tableFieldServiceType['dataList']>[]
      this.dataTableInfo.forEach(item => {
        if (item.tableId === singleTableConfig.id) singleTableInfoList.push(JSON.parse(JSON.stringify(item)))
      })
      if (this.operationTableFieldList.length) { // 编辑的时候，回显
        this.operationTableFieldList.forEach((item: any) => {
          singleTableInfoList.forEach(tableItem => {
            if (item.fieldName === tableItem.name) {
              tableItem.isInputVar = item.type === 'V'
              tableItem.newValue = item.fieldValue
            }
          })
        })
      }
      this.singleTableConfig = singleTableConfig
      this.singleTableInfoList = singleTableInfoList
      this.isShowTargetZone = false // 隐藏d3组件拖拽区
    },
    handleD3Data(childrenData: d3RootJsonType, tableName: string, tableId: number, isDataset: boolean) {
      if (childrenData.depth && childrenData.depth - 2 >= 0) { // 层级越深相应的增加svg宽高
        this.svgD3Height = 200 * (childrenData.depth - 1) + 400;
        this.svgD3Width = 200 * (childrenData.depth - 1) + 400;
      }
      if (!childrenData.children) childrenData.children = <d3RootJsonChildrenType>[]
      if (!this.selectedD3TableId) { // 添加到根节点
        if (!childrenData.name) {
          childrenData.name = tableName
          childrenData.id = tableId,
            childrenData.nodeType = isDataset ? 'dataSet' : 'table'
        } else {
          childrenData.children.push({
            name: tableName,
            id: tableId,
            nodeType: isDataset ? 'dataSet' : 'table'
          })
        }
      } else { // 添加到指定节点
        if (!childrenData.name) return false
        if (childrenData.id === this.selectedD3TableId) {
          childrenData.children.push({
            name: tableName,
            id: tableId,
            nodeType: isDataset ? 'dataSet' : 'table'
          })
        } else {
          childrenData.children.forEach(item => {
            this.handleD3Data(item, tableName, tableId, false)
          })
        }
      }
    },
    handleDepD3RootJson(childrenData: d3RootJsonType, tempArr: fromDataListServiceType) {
      let rightNodes: fromDataListServiceType = []
      if (childrenData.children) {
        childrenData.children.forEach(itemData => {
          this.handleDepD3RootJson(itemData, rightNodes)
        })
      }
      tempArr.push({
        nodeId: Number(childrenData.id),
        nodeName: childrenData.name,
        nodeType: childrenData.nodeType, // table or dataSet
        parentConnectData: this.connectDataObj[childrenData.id] || {},
        rightNodes
      })
    },
    handleGraphConfig(rightNodes: fromDataListServiceType, childrenArr: d3RootJsonChildrenType, tableList: d3RootJsonChildrenType) {
      if (!rightNodes || !rightNodes.length) return false
      rightNodes.forEach((item: any) => {
        let arr: d3RootJsonChildrenType = []
        childrenArr.push({
          id: item.nodeId,
          name: item.nodeName,
          nodeType: '',
          children: arr
        })
        tableList.push({
          name: item.nodeName,
          id: item.nodeId,
          nodeType: item.nodeType
        })
        this.connectDataObj[item.nodeId] = item.parentConnectData || {}
        if (this.selectedD3TreeTableIdsMap.indexOf(item.nodeId) === -1) this.selectedD3TreeTableIdsMap.push(item.nodeId)
        if (item.rightNodes && item.rightNodes.length) this.handleGraphConfig(item.rightNodes, arr, [])
      })
    },
    /***************** 执行、添加、修改 **********************/
    executeReductionService(next) {
      let fromDataList: fromDataListServiceType = []
      this.handleDepD3RootJson(this.d3RootJson, fromDataList)
      if (this.scriptModelType === 'procedure' || ['sql', 'view'].indexOf(this.scriptModelType) !== -1) {
        // 存储过程或没有可执行sql语句不调用接口
        if (!this.execSqlText) {
          return false
        }
      } else if (!fromDataList[0] || !fromDataList[0].nodeId) {
        return false
      }
      getReductionExecuteService({
        dataSetFieldList: this.dataSetFieldList,
        dbConfigId: this.selectedDatabaseId,
        graphConfig: JSON.stringify(fromDataList[0]),
        limit: this.executeReductionLimit,
        filterConfig: JSON.stringify(this.filterConfig),
        statisticsConfig: JSON.stringify(this.statisticsConfig),
        processList: this.processListData,
        // modeType: this.isScriptModel ? 'sql' : 'design',
        modeType: this.scriptModelType,
        execSqlText: this.execSqlText || '',
        sqlParamList: this.sqlParamList
      }).then((res: reductionExecuteResType) => {
        let columnList = res.data.columnList || []
        let valueList = res.data.valueList || []
        columnList.forEach(item => {
          item.isShow = true
        })
        this.executeResultColumnList = columnList
        this.executeResultValueList = valueList
        if (next) next()
      })
    },
    addReductionService() {
      if (this.listLoading) return false;
      let fromDataList: fromDataListServiceType = []
      this.handleDepD3RootJson(this.d3RootJson, fromDataList)
      this.listLoading = true
      addReductionItemV4Service({
        name: this.reductionName,
        // folderId: this.currentDirId,
        type: this.modelTypeDict[this.modelType],
        dmlVOList: this.operationTableFieldList,
        dbConfigId: this.selectedDatabaseId,
        graphConfig: JSON.stringify(fromDataList[0]),
        limit: this.executeReductionLimit,
        filterConfig: JSON.stringify(this.filterConfig),
        statisticsConfig: JSON.stringify(this.statisticsConfig),
        processList: this.processListData,
        // modeType: this.isScriptModel ? 'sql' : 'design',
        modeType: this.scriptModelType,
        execSqlText: this.execSqlText || '',
        sqlParamList: this.sqlParamList,
        dataSetFieldList: this.dataSetFieldList
      }).then(res => {
        let id = res?.data?.id
        this.listLoading = false
        this.$message.success('保存成功')
        // this.$router.replace({ path: '/datasets/list' })
        // this.$router.replace({
        //   path: `/tableau`,
        //   query: { id, currentDirId: this.currentDirId }
        // })
      }).catch(() => {
        this.listLoading = false
        this.$message.error('保存失败')
      })
    },
    editReductionService() {
      if (this.listLoading) return false;
      let fromDataList: fromDataListServiceType = []
      this.handleDepD3RootJson(this.d3RootJson, fromDataList)
      this.listLoading = true
      editReductionItemV4Service({
        id: Number(this.id),
        name: this.reductionName,
        // folderId: this.currentDirId,
        type: this.modelTypeDict[this.modelType],
        dmlVOList: this.operationTableFieldList,
        dbConfigId: this.selectedDatabaseId,
        graphConfig: JSON.stringify(fromDataList[0]),
        limit: this.executeReductionLimit,
        filterConfig: JSON.stringify(this.filterConfig),
        statisticsConfig: JSON.stringify(this.statisticsConfig),
        processList: this.processListData,
        // modeType: this.isScriptModel ? 'sql' : 'design',
        modeType: this.scriptModelType,
        execSqlText: this.execSqlText || '',
        sqlParamList: this.sqlParamList,
        dataSetFieldList: this.dataSetFieldList
      }).then(() => {
        this.listLoading = false
        this.$message.success('修改成功')
        this.$emit('refetchData')
        // this.$router.replace({ path: '/datasets/list' })
      }).catch(() => {
        this.listLoading = false
        // this.$message.error('修改失败')
      })
    },
    /*************************** 绘制页面上的特殊组件 *********************************/
    nativeDrag() { // 使用dom0级事件绑定，防止重复执行处理函数
      const tableElList = document.querySelectorAll('.tableau-sider .table-list .table-list-title') as NodeListOf<HTMLElement>
      const zoneEl = <HTMLElement>document.querySelector('.content-target-wrap')
      let currentEl: HTMLElement

      tableElList.forEach(tableEl => {
        // 拖拽进入到目标位置
        tableEl.ondragstart = event => {
          currentEl = event.target as HTMLElement
        }
      })
      // 拖拽进入到目标位置
      zoneEl.ondragenter = event => {
        zoneEl.classList.add('target-zone-active')
      }
      // 拖拽离开目标
      zoneEl.ondragleave = event => {
        zoneEl.classList.remove('target-zone-active')
      }
      // 拖拽释放到目标位置
      zoneEl.ondrop = event => {
        zoneEl.classList.remove('target-zone-active')
        let isDataset = !!currentEl.dataset.ds
        let tableId = Number(currentEl.dataset.id) || 0
        let tableName = currentEl.innerText.trim()

        // 编辑模式禁止添加表，只允许单表操作
        if (this.isEditMode) return this.$message.warning('编辑模式禁止添加表，只允许单表操作')
        // 过滤相同表关联
        // console.log(this.selectedD3TreeTableIdsMap, tableId)
        if (this.selectedD3TreeTableIdsMap.indexOf(tableId) !== -1) return false
        this.selectedD3TreeTableIdsMap.push(tableId)

        setTimeout(() => { // 这里使用定时器解决下面网络延迟问题 TODO: 待优化，可以使用接口状态管理 或者更好的方法
          // 打开关联窗口 TODO: 关联需要的字段数据在异步获取，网络延迟可能会造成没有拿到数据，有时间要改成同步获取
          if (this.d3RootJson.id) this.showConnectionDialog(this.selectedD3TableId || this.d3RootJson.id, tableId)
          this.handleD3Data(this.d3RootJson, tableName, tableId, isDataset)
          if (this.selectedD3TreeTableIdsMap.length === 1) this.executeReductionService() // 只有一个表执行
          // 重新渲染d3组件
          this.reloadD3Init()
          // console.log(this.d3RootJson)
        }, 1000)
        this.reloadTableInfoData(isDataset, tableName, tableId) // 通过接口获取对应表的详细信息
      }
      // 拖拽到了目标元素上并且在目标元素上移动
      zoneEl.ondragover = event => {
        event.preventDefault()
      }
      // 拖拽结束
      zoneEl.ondragend = event => {
        zoneEl.classList.remove('target-zone-active')
      }
    },
    reloadD3Init() {
      this.isRenderTargetZone = false
      this.$nextTick(() => {
        this.isRenderTargetZone = true
        this.$nextTick(() => {
          this.initD3(this, this.d3RootJson)
        })
      })
    },
    initD3
  }
})
