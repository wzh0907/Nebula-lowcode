import { Vue } from 'vue-property-decorator';
import customHeader from '@/components/customHeader/index.vue'
import fieldSetView from './module/field-set-view.vue'
import filterView from './module/filter/filter-view.vue'
import tableRowDataUpdate from './module/table-row-data-update.vue'
import crudDialog from './dialog-module/crud-dialog.vue';

import { getListService, getTableListService } from '@/api/database.js'
import { getDbTableDataList, getDbTableColumnsList, deleteDbTableColumnData } from '@/api/database-command/index.js'
import {
  getTableFieldService,
  getProcedureFieldService
} from '@/api/database'
import { getReductionExecuteService } from '@/api/data-trim.js'
export default Vue.extend({
  name: 'databaseInfo',
  components: {
    customHeader,
    fieldSetView,
    filterView,
    tableRowDataUpdate,
    crudDialog
  },
  props: ['tableName', 'databaseId', 'tableId', 'isCreateTable','dataSourceName'],
  data() {
    return {
      tableRowDetailData: [],
      tableColumns: [],
      drawerVisible: false,
      listLoading: false,
      id: '',
      currentDirId: '0',
      reductionName: '',
      // contentViewHeight: '0px',
      // contentHeaderHeight: '',
      modelType: 'query',
      tabHeaderView: 'data',
      tabContentView: 'preview',
      modelTypeDict: {
        query: 'query',
        insert: 'create',
        create: 'insert',
        edit: 'update',
        update: 'edit',
        delete: 'delete'
      },
      operationTableFieldList: [],
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
      // renameFieldDialogVisible: false,
      isShowSiderTableSearch: false,
      isShowSiderDatasetsSearch: false,
      isShowTargetZone: true,
      isRenderTargetZone: true,
      isShowTable: true,
      // isShowHideField: false,
      isEditMode: false,
      isScriptModel: false,
      execSqlText: '',
      codeEditorMode: 'sql',
      editorOptions: {
        showGutter: false
      },
      addDialogVisible:false,
      // sourceZoneItems: <any>[],
      // targetZoneItems: <any>[],
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
      dataTypeIconDict: {
        'INT': '#',
        'BIT': '#',
        'VARCHAR': 'Abc'
      },
      // ---------------------------------------
      isShowDataFilter: false,
      selectedDatabaseId: '',
      selectedTableId: '',
      dataTableList: [],
      databaseList: [],
      dataSetFieldList: [],
      dataTableInfoMap: {},
      dataTableInfo: [],

      contentViewHeight: '0px',
      contentHeaderHeight: '0px',
      executeResultColumnList: [],
      executeResultValueList: [],
      // pages
      pageIndex: 1,
      pageSize: 10,
      pageTotal: 10,
      filterData: []
    }
  },
  created() {
    if (this.isCreateTable) {
      this.tabHeaderView = 'structure'
    } else if(this.tableName) {
      this.queryDbTableDataList()
      this.queryDbTableColumnsList()
    }
    // let tableName = this.tableName;
    // this.selectedDatabaseId = this.databaseId;
    // this.selectedTableId = this.tableId;
    // this.queryDatabaseList()
    // this.onSelectionTable(this.selectedTableId, tableName)
    // this.executeReductionService()
  },
  mounted() {
    let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - 55;
    this.contentViewHeight = height - 10 + 'px';
    this.contentHeaderHeight = height - (55 * 2) - 10 + 'px'; // (55 * 2) = 两个nav高度、10 = padding-top-bottom
  },
  methods: {
  
    onReloadData(){
      this.drawerVisible = false
      this.queryDbTableDataList()
      this.queryDbTableColumnsList()
    },
    onAddTableRowData(){
      this.tableRowDetailData = []
      this.drawerVisible = true
    },
    openCurd(){
     
    },
    onEditTableRowData(rowDataValue){
      this.drawerVisible = true
      this.tableRowDetailData = rowDataValue
    },
    onDelTableRowData(rowDataValue){
      this.$confirm('确认删除本条数据？')
      .then(_ => {
        let obj = {}
        if (rowDataValue && rowDataValue.length) {
          for (let index = 0; index < this.tableColumns.length; index++) {
            const name = this.tableColumns[index].columnName;
            const value = rowDataValue[index]
            obj[name] = value
          }
        }
        // this.dataForm = obj
        let oldDataForm = JSON.parse(JSON.stringify(obj))

        let conditionColumns = []
        for(let key in oldDataForm) {
          conditionColumns.push({
            columnName: key,
            condition: '=',
            connectType: 'and',
            columnValue: oldDataForm[key]
          })
        }
        let params = {
          dbConfigId: this.databaseId,
          tableName: this.tableName,
          setColumns: [],
          conditionColumns
        }
        deleteDbTableColumnData(params).then(res => {
          this.$message.success('删除成功');
          this.onReloadData()
        })
      })
      .catch(_ => {});
    },
    onHandleDrawerClose(done){
      this.$confirm('确认关闭？')
      .then(_ => {
        done();
      })
      .catch(_ => {});
    },
    handleCurrentChange(currentPage){
      this.pageIndex = currentPage
      this.queryDbTableDataList(this.filterData)
    },
    queryDbTableDataList(filterData){
      getDbTableDataList({
        dbConfigId: this.databaseId,
        tableName: this.tableName,
        conditionColumns: filterData || [],
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.pageIndex = res.data.pageIndex
        this.pageSize = res.data.pageSize
        this.pageTotal = res.data.total
        let columnList = res.data.columnList || []
        let valueList = res.data.valueList || []
        columnList.forEach(item => {
          item.isShow = true
        })
        this.executeResultColumnList = columnList
        this.executeResultValueList = valueList
        this.isShowTable = false
        this.$nextTick(() => {
          this.isShowTable = true
        })
      })
    },
    queryDbTableColumnsList(){
      // console.log('ccccc')
      getDbTableColumnsList({
        dbConfigId: this.databaseId,
        tableName: this.tableName
      }).then(res => {
        this.tableColumns = res.dataList || []
      })
    },
    // 界面事件
    onFilterData(filterData){
      // console.log(filterData)
      this.filterData = filterData
      this.queryDbTableDataList(filterData)
    },
    onSaveData(){},
    onAddDatabase(){},
    onSearchField(){},
    onChangeDataSetFieldList(){
      // this.executeReductionService()
    },
    onSelectionTable(tableId, tableName){
      this.selectedTableId = tableId
      // if (this.infoDataType === 'procedure') {
      //   this.queryDataProcedureInfo(tableId, tableName)
      //   return false
      // }
      this.queryDataTableInfo(tableId, tableName)
      this.executeReductionService(tableId, tableName)
    },
    // 查询接口
    queryDataProcedureInfo(tableId, tableName) {
      this.listLoading = true
      getProcedureFieldService({
        dbConfigId: this.selectedDatabaseId,
        procedureId: tableId
      }).then((res) => {
        this.listLoading = false
        let dataList = res.dataList || []
        this.dataTableInfo = dataList
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryDataTableInfo(tableId, tableName) {
      this.listLoading = true
      getTableFieldService({
        dbConfigId: this.selectedDatabaseId,
        tableName,
        tableId
      }).then((res) => {
        this.listLoading = false
        let dataList = res.dataList || []
        this.dataTableInfo = dataList
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryDatabaseList() {
      this.listLoading = true
      getListService().then(res => {
        this.databaseList = res.dataList || []
        // this.databaseTotal = this.databaseList.length
        this.listLoading = false
        if (!this.selectedDatabaseId) this.selectedDatabaseId = this.databaseList[0] && this.databaseList[0].id
        this.queryDataTableList(this.selectedDatabaseId)
      }).catch(() => {
        this.listLoading = false
      })
    },
    queryDataTableList(dbConfigId) {
      if (!dbConfigId) return false
      this.listLoading = true
      const params = {
        dbConfigId,
        size: 999,
        queryType: 'table'
      }
      getTableListService(params).then(res => {
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
    executeReductionService(tableId, tableName) {
      // let fromDataList = []
      let graphConfig = {
        nodeId: tableId,
        nodeName: tableName,
        nodeType: 'table',
        parentConnectData: {},
        rightNodes: []
      }
      // this.handleDepD3RootJson(this.d3RootJson, fromDataList)
      getReductionExecuteService({
        dataSetFieldList: [],
        // dataSetFieldList: this.dataSetFieldList,
        dbConfigId: this.selectedDatabaseId,
        // graphConfig: JSON.stringify(fromDataList[0]),
        // graphConfig: '{"nodeId":0,"parentConnectData":{},"rightNodes":[]}',
        graphConfig: JSON.stringify(graphConfig),
        limit: 10,
        filterConfig: '{}',
        // filterConfig: JSON.stringify(this.filterConfig),
        // statisticsConfig: JSON.stringify(this.statisticsConfig),
        statisticsConfig: '{}',
        // processList: this.processListData,
        processList: [],
        modeType: 'design',
        execSqlText: '',
        sqlParamList: []
      }).then((res) => {
        let columnList = res.data.columnList || []
        let valueList = res.data.valueList || []
        columnList.forEach(item => {
          item.isShow = true
        })
        this.executeResultColumnList = columnList
        this.executeResultValueList = valueList
        this.isShowTable = false
        this.$nextTick(() => {
          this.isShowTable = true
        })
        // if (next) next()
      })
    }
  }
})
