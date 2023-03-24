import { Vue } from 'vue-property-decorator';

import customHeader from '@/components/customHeader/index.vue'
import uploadCommentDialog from "@/views/report/modules/uploadComment/index.vue";
import codeEditor from '@/components/CodeEditor/index.vue'
import { getListService, getTableListService, getTableFieldService } from '@/api/database.js'
import { getReductionItemService, getReductionExecuteService, getReductionDatasetService, addReductionItemV4Service, editReductionItemV4Service } from '@/api/data-trim.js'
import { isStringDict, isNumberDict, isDatetimeDict } from '../utils/field-type'

// 引入类型
import { filterConfigType, d3RootJsonType, d3RootJsonChildrenType, fromDataListServiceType, connectDataObjType } from '../types/type'
import { reductionItemServiceType, tableFieldServiceType, tableListServiceType, dbConfigListServiceType, reductionResultListServiceType, reductionDatasetListServiceType, reductionExecuteResType } from '../types/service-type'
import { renameSqlScript } from '@/api/v5/index.js'
// 自定义事件
import {
  serviceReadyStatusMap,
  readyQueryReductionItemServiceEvent,
  readyQueryDataTableInfoEvent,
  previewDataButtonEvent,
  saveDataButtonEvent
} from './custom-event/index'

import { delDatasetV4 } from "@/api/v4/index.js";
import {getStorage,setStorage} from "@/util/storageUtil.js";
export default Vue.extend({
  name: 'bi',
  components: {
    customHeader,
    uploadCommentDialog,
    codeEditor
  },
  props: ['id', 'currentFileData', 'scriptModel', 'currentDataType', 'databaseId', 'name'],
  data() {
    return {
      tabView: 'dataTable',
      serviceReadyStatusMap, // 接口状态map
      // id: '',
      currentDirId: '0',
      reductionName: '',
      isEditingName: false,
      reductionNewName: '',
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
      // joinTypeIconMap: {
      //   'left': require('../images/left.png'),
      //   'in': require('../images/in.png'),
      //   'right': require('../images/right.png')
      // },
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
    this.isScriptModel = this.scriptModel === 'scriptModel'
    this.reductionName = this.name
    this.reductionNewName = this.reductionName
    this.selectedDatabaseId = this.databaseId
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
  },
  mounted() {
    let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - 55
    this.contentViewHeight = height + 'px'
    this.contentHeaderHeight = height - (55 * 2) - 10 + 'px' // (55 * 2) = 两个nav高度、10 = padding-top-bottom
    this.contentTableListHeight = height - 185 + 'px';
  },
  beforeDestroy() {
    this.onSaveData()
    this.uploadComment()
  },
  methods: {
    onEditScriptName() {
      this.isEditingName = false
      renameSqlScript({
        sqlScriptId: this.id,
        name: this.reductionNewName,
      }).then(res => {
        this.reductionName = this.reductionNewName
        this.$emit('reload')
      })
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
    onChangeLimit() {
      this.executeReductionService()
    },
    //删除组件
    onDeleComment() {
      let params = {
        dsConfigId: this.id,
      };
      this.$confirm("确认删除本条数据？")
        .then((_) => {
          delDatasetV4(params).then((res) => {
            this.$message.success("删除成功");
            this.$emit("reload")
          });
        })
        .catch((_) => { });
    },
    onSaveData(noOnEvent?: boolean) { // noOnEvent: 需不需要触发saveEvent事件
      if (!this.reductionName) return this.$message.warning('请输入数据集名称')
      if (this.tabHeaderView === 'filter' && !noOnEvent) {
        window.dispatchEvent(saveDataButtonEvent)
        return false;
      }
      if (this.id) return this.editReductionService()
      this.addReductionService()
    },
    uploadComment() {
      this.uploadCommentVisible = true;
      this.uploadCommentTitle = '组件上传';
    },
    onAddDatabase() {
      let routeUrl = this.$router.resolve({
        path: "/database",
        query: {}
      });
      window.open(routeUrl.href, '_blank');
    },
    /************************ 辅助处理数据 ****************************/
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
        console.log(res.data)
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
        // this.$nextTick(() => {
        //   this.nativeDrag()
        // })
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
        this.reductionNewName = this.reductionName
        this.databaseId = data.dbConfigId
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
        // this.handleGraphConfig(graphConfig.rightNodes, childrenArr, tableList)
        tableList.forEach(item => {
          setTimeout(() => {
            this.reloadTableInfoData(item.nodeType === 'dataSet', item.name, item.id)
          }, 1000)
        })

        this.d3RootJson = d3RootJson
        // this.initD3(this, this.d3RootJson)
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
    // handleGraphConfig(rightNodes: fromDataListServiceType, childrenArr: d3RootJsonChildrenType, tableList: d3RootJsonChildrenType) {
    //   if (!rightNodes || !rightNodes.length) return false
    //   rightNodes.forEach((item: any) => {
    //     let arr: d3RootJsonChildrenType = []
    //     childrenArr.push({
    //       id: item.nodeId,
    //       name: item.nodeName,
    //       nodeType: '',
    //       children: arr
    //     })
    //     tableList.push({
    //       name: item.nodeName,
    //       id: item.nodeId,
    //       nodeType: item.nodeType
    //     })
    //     this.connectDataObj[item.nodeId] = item.parentConnectData || {}
    //     if (this.selectedD3TreeTableIdsMap.indexOf(item.nodeId) === -1) this.selectedD3TreeTableIdsMap.push(item.nodeId)
    //     if (item.rightNodes && item.rightNodes.length) this.handleGraphConfig(item.rightNodes, arr, [])
    //   })
    // },
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
    }
  }
})
