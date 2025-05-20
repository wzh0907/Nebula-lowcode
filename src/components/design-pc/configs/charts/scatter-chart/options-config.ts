export default {
  value: '',
  commonConfigCompWidthUnit: '%',
  commonConfigCompWidth: '100',
  commonConfigCompHeightUnit: 'px',
  commonConfigCompHeight: '400',
  legendAlign: 'top',
  xAxisConfig: {
    forceDisplayLabel: false,
    axisLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'solid',
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      rotate: 0,
      color: '#333'
    }
  },
  yAxisConfig: {
    name: '',
    nameShow: true,
    autoMax: true,
    autoMin: true,
    max: undefined,
    min: undefined,
    axisLine: {
      show: false,
      lineStyle: {
        width: 1,
        type: 'solid',
        color: '#333'
      }
    },
    axisLabel: {
      show: true,
      rotate: 0,
      color: '#333'
    },
    nameTextStyle: {
      color: '#333'
    }
  },
  grid: {
    left: 0,
    right: 20,
    top: 60,
    bottom: 70,
    containLabel: true
  },
  regression: {
    algorithm: 'none',
    order: 2
  },
  // 配置
  contentDataSource: 'radio-button-default',
  chartColors: [
    '#63b2ee',
    '#76da91',
    '#f8cb7f',
    '#f89588',
    '#7cd6cf',
    '#9192ab',
    '#7898e1',
    '#efa666',
    '#eddd86',
    '#9987ce',
    '#63b2ee',
    '#76da91'
  ],
  echartsOptions: {
    color: [],
    dataset: [
      {
        source: []
      },
      {
        transform: {}
      }
    ],
    tooltip: {
      trigger: 'axis'
    },
    grid: {},
    xAxis: [],
    yAxis: {
      type: 'value'
    },
    series: []
  },
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    uuid: '',
    key: '',
    yAxisType: '',
    chartSettings: {
      metrics: [],
      dimension: [],
      yAxisType: []
    },
    chartData: {
      columns: [],
      rows: []
    }
  },
  defaultData: {
    chartSettings: {
      metrics: ['Y'],
      dimension: ['X']
    },
    chartData: {
      columns: ['日期', '访问用户', '下单用户', '下单率'],
      rows: [
        { X: 1, 日期: '1/1', 访问用户: 3393, 下单用户: 1093, 下单率: 0.32, Y: 10 },
        { X: 2, 日期: '1/2', 访问用户: 4530, 下单用户: 3230, 下单率: 0.26, Y: 8 },
        { X: 3, 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76, Y: 6 },
        { X: 4, 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49, Y: 5 },
        { X: 5, 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323, Y: 4 },
        { X: 6, 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78, Y: 3 }
      ]
    }
  },
  commonConfig: {} as any
}
