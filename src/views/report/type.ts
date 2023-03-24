/**
 * 各种类型的接口查询需要用到的字段
 *
 * 后端服务：
 *     id: 接口的dataApiId
 *     paramsConfigs: 接口参数
 * 数据表：
 *     dbConfigId: 数据库id
 *     tableName: 数据表名称
 *     queryConfigs: 数据表查询参数
 * 数据集：
 *     id: 代表数据集id
 *     dataSetName: 数据集名称
 *     queryConfigs: 数据集查询参数
 */
type interfaceDataConfig = {
  uuid: string, // 用了哪个接口实例的数据，唯一
  versions: '1.0.0',
  id: string | number, // 后端服务、数据集会使用到这个字段
  key: string, // 数据源为后端服务、自定义时的key，数据源为组件时的uuid
  mockFlag: Boolean,    //是否是mock数据(已废弃,为了兼容老数据保留)
  isMockData: Boolean,  //是否是mock数据
  // 后端服务类型
  paramsConfigs: {
    param_value_type: string, // 参数类型（T: 组件、V: 入参变量、C: 常量）
    param_v_key: string,
    param_value: string
  },
  // 数据表
  dbConfigId: string | number,
  tableName: string,
  // 数据集
  dataSetName: string,
  // 数据表、数据集共有配置
  queryConfigs: {
    param_name: string, // 参数名称
    fieldType: string, // 字段类型
    operator: string, // 操作符，要进行的查询操作（=、>、<、等）
    param_value_type: string, // 参数类型（T: 组件、V: 入参变量、C: 常量）
    param_value: string, // 参数值
  },
  // 组件渲染需要用到的字段（为什么要把组件配置放到这里： 因为为了兼容老的配置）
  value: string | number,
  chartData: {
    rows: []
  },
  tableData: any[]
}

// 页面全局配置类型
type pageGlobalConfigType = {
  reportId: '',
  uuid: string,
  name: string,
  reportName: string,
  pullRefresh: boolean,
  adaptiveStatusBar: boolean,
  statusBarColor: string,
  backgroundColor: string,
  remark: string,
  interfaceDataConfig?: [],
  // 布局
  topPaddingDistance: number,
  rightPaddingDistance: number,
  bottomPaddingDistance: number,
  leftPaddingDistance: number,
  // 背景图片
  backgroundImage: string,
  backgroundPosition: string,
  backgroundRepeat: string,
  backgroundSize: string,
  backgroundAttachment: string
  hideNavigator: boolean,
  navigatorBGColor:  string,  //移动端导航栏背景色
  navigatorColor: string, //移动端导航栏文字颜色
}

// 单个的组件类型
type componentConfigItemType = {
  uuid: string,
  type: string,
  name: string,
  icon: string,
  options: any,
  configList: any[],
  component: any
}
type componentGroupType = {
  id: string,
  version: string
}

// 页面配置类型
type pageConfigType = {
  list: componentConfigItemType[],
  config: pageGlobalConfigType,
  groupList: any
}

export {
  interfaceDataConfig,
  componentConfigItemType,
  pageGlobalConfigType,
  pageConfigType,
  componentGroupType
}
