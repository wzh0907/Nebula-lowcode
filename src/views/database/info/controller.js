import { Vue } from 'vue-property-decorator';
import customHeader from '@/components/customHeader/index.vue'
import fieldSetView from './field-set-view.vue'
import filterView from './filter/filter-view.vue'
import { getListService, getTableListService } from '@/api/database.js'
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
    filterView
  },
  props: ['tableName', 'databaseId', 'tableId', 'infoDataType'],
  data() {
    return {
      listLoading: false,
      id: '',
      currentDirId: '0',
      reductionName: '',
      // contentViewHeight: '0px',
      // contentHeaderHeight: '',
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
      svgD3: '',
      svgD3Width: 400,
      svgD3Height: 400,
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
      executeResultValueList: []
    }
  },
  created() {
    // 加载数据
    let tableName = this.tableName;
    this.selectedDatabaseId = this.databaseId;
    this.selectedTableId = this.tableId;
    this.queryDatabaseList()
    this.onSelectionTable(this.selectedTableId, tableName)
    // this.executeReductionService()
  },
  mounted() {
    let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - 55;
    this.contentViewHeight = height + 'px';
    this.contentHeaderHeight = height - (55 * 2) - 10 + 'px'; // (55 * 2) = 两个nav高度、10 = padding-top-bottom
  },
  methods: {
    onHeaderBackEvent(){
      this.$emit('changeDataType', 'database')
    },
    // 界面事件
    onFilterData(){},
    onSaveData(){},
    onAddDatabase(){},
    onSearchField(){},
    onChangeDataSetFieldList(){
      // this.executeReductionService()
    },
    onSelectionTable(tableId, tableName){
      this.selectedTableId = tableId
      if (this.infoDataType === 'procedure') {
        this.queryDataProcedureInfo(tableId, tableName)
        return false
      }
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

        // dataList.forEach(item => {
        //   item.tableName = tableName
        //   item.tableId = tableId
        //   item.isShow = true
        // })
        // this.dataTableInfo = this.dataTableInfo.concat(dataList)
        // this.dataTableInfoMap[tableId] = dataList
        // console.log(this.dataTableInfoMap)
        // 异步操作完成发送事件
        // window.dispatchEvent(readyQueryDataTableInfoEvent)
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
