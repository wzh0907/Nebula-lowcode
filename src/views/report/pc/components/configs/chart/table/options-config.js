import { defaultColumnsData, defaultTableData } from './default-data'

export default {
  elUUID: '',
  defaultValue: true,
  isReloadView: true,
  columns: [], // 这里是配置页面结构使用
  configPageSize: 10,
  defaultPagination: { // Mock分页
    current: 1,
    pageSize: 5,
    total: 10,

    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100']
  },
  rowSelectKey: '', // [行选择功能] 哪个字段作为行选择字段【操作需要】
  selectedRowKeys: [], // [行选择功能] 已选择值【操作需要】
  rowSelectValuesByKeyStr: '', // [行选择功能] 通过已选择值转换处理得到【关联值】
  value: '', // [行选择功能] 目前Table组件实际只有一个值供外部使用，所以直接使用options.value，以后有多值再优化

  echoRowDataType: 'outside', // [行选择功能] outside：外部值，inside：内部值
  echoRowKeyByInside: '', // [行选择功能] 回显行选择key [内部值]

  echoRowKey: '', // [行选择功能] 回显行选择key [外部值]
  echoRowKey_id: [], // [行选择功能] 回显行选择接口路径
  
  rowIndexSwitch: false, // 行号开关

  pagingTotalKey: '',
  pagingTotalKey_id: [],
  pagination: {
    current: 1,
    pageSize: 5,
    total: 0,

    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100']
  }, // 是否进行分页
  specialColumnsConfigs: [],
  columnsConfigList: [], // 表列配置项
  defaultColumnsData: defaultColumnsData, // Mock数据项
  defaultTableData, // Mock数据
  columnsData: [], // 表格渲染需要的配置
  contentDataSource: 'radio-button-tables',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    tableData: []
  },
  workFlow:{
    primaryKey: "",
    currentUserProcessId: null,
    dbconfigId: null,
    tableName: "",
    eventList:[],
  },

  // 显示设置
  columnsReference: [], // 对columns的拷贝，对该数据的操作会通过onReloadColumns事件同步给columns
  columnsBackups: [], // columns备份，用于初始化columns
  columnByKeyMap: {}, // 通过key快速查询column

  tableWidth: 0
}