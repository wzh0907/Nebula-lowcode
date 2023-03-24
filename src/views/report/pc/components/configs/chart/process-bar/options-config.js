export default {
  height: 10,
  backgroundColor: '#aaa',
  proportionDataList: [ // 占比图数据
    {
      name: 'aaa', // 占比图下面方块的名称
      color: 'red', // 方块颜色
      value: 10 // 占比多少
    }, {
      name: 'bbb',
      color: 'blue',
      value: 20
    }, {
      name: 'ccc',
      color: 'yellow',
      value: 30
    }
  ],
  totalProportData: 100, // 占比总数 = 纵轴的值相加
  // 配置
  contentDataSource: 'radio-button-tables',
  interfaceDataConfig: {
    id: '',
    key: '',
    chartSettings: {
      metrics: [], // 纵轴，类目值
      dimension: [], // 横轴，类目
    },
    chartData: {
      columns: '', // 纵轴，类目值 -- 废弃
      rows: [] // 图表数据
    }
  }
  // 自定义属性
  // percentage: 0,
  // strokeWidth: 4,
  // pivotText: '文字',
  // color: '#1989fa'
}