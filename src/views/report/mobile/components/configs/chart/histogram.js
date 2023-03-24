import {axisFormatter} from "@/views/report/pc/components/configs/chart/axis-formatter";

let optionsConfig = {
  height: 400,
  value: '',
  tempObj:{},
  // 配置
  contentDataSource: 'radio-button-tables',
  chartColors:['#0780cf','#765005','#fa6d1d','#0e2c82','#b6b51f','#da1f18','#701866','#f47a75','#009db2','#024b51','#0780cf','#765005'],
  echartsOptions: {
    color: [],
    legend: {},
    tooltip: {
      trigger: 'axis'
    },
    grid: {},
    xAxis: [],
    yAxis: {
      type: "value"
    },
    series: []
  },
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    chartSettings: {
      metrics: [],
      dimension: [],
      showLine: []
    },
    chartData: {
      columns: [],
      rows: []
    }
  },
  defaultData:{
    chartSettings: {
      metrics: ["访问用户","下单用户"],
      dimension: ["日期"],
      showLine: [],
    },
    chartData: {
      // columns: [],
      // rows: []
      columns: ["日期", "访问用户", "下单用户", "下单率"],
      rows: [
        { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
        { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
        { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
        { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
        { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
        { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
      ]
    }
  }
}
export default {
  type: 'van-design-chart-histogram',
  name: '柱状图',
  icon: 'iconzhuzhuangtu',
  component: {
    template: `
      <div ref="chart" :style="style"></div>
    `,
    components: {
    },
    data() {
      return {
        options: optionsConfig,
        chart: null
      }
    },
    computed: {
      style() {
        const margin = this.$data.options.commonConfig.leftSpaceDistance + this.$data.options.commonConfig.rightSpaceDistance + 'px'
        const height = this.$data.options.height + 'px'
        return `width: calc(100% - ${margin}); height: ${height}`
      },
    },
    created() {
      var self = this;
      this.options.chartPEvents = {
        click: function(e) {
            self.tenDepChartClicked(e);
        }
       };
    },
    watch:{
      'options.interfaceDataConfig':{
        handler:function(){
          this.chart.setOption(this.chartOptions())
        },
        deep: true
      },
      'options.legendAlign':{
        handler:function(){
          this.chart.setOption(this.chartOptions())
        },
      },
      'options.chartColors':{
        handler:function(){
          this.chart.setOption(this.chartOptions())
        },
      },
    },
    mounted() {
      this.drawCharts()
    },
    methods: {
      drawCharts() {
        this.chart = this.$echarts.init(this.$refs.chart)
        this.chart.setOption(this.chartOptions())
        window.addEventListener("resize", () => { this.chart.resize()})
      },
      chartOptions() {
        let options = this.options
        let yAxisType = options.interfaceDataConfig.yAxisType
        options.echartsOptions.color = options.chartColors
        let resp
        // 横轴
        let dimension = []
        // 纵轴
        let metrics = []
        //堆叠
        // let stack = []
        //线性
        let line = []
        if (options.interfaceDataConfig.id ||
          options.interfaceDataConfig.chartData.rows.length) {
          dimension = options.interfaceDataConfig.chartSettings.dimension || []
          metrics = options.interfaceDataConfig.chartSettings.metrics || []
          resp = options.interfaceDataConfig.chartData.rows || []
          // stack = options.interfaceDataConfig.stack || []
          line = options.interfaceDataConfig.chartSettings.showLine || []
        }
        else {
          dimension = options.defaultData.chartSettings.dimension;
          metrics = options.defaultData.chartSettings.metrics
          resp = options.defaultData.chartData.rows
        }
        if (resp) {
          options.echartsOptions.series = []
          metrics.forEach((item) => {
            let sList = []
            resp.forEach(dataItem => {
              sList.push(dataItem[item])
            })
            let metricItem = {
              name: item,
              data: sList
            }
            // if (stack.includes(item)) {
            //   metricItem.stack = 'stack'
            // } else {
            //   metricItem.stack = undefined
            // }
            if (line.includes(item)) {
              metricItem.type = 'line'
            } else {
              metricItem.type = 'bar'
            }

            options.echartsOptions.series.push(metricItem);
          })

          options.echartsOptions.xAxis = [];
          dimension.forEach((dItem) => {
            let xList = [];
            resp.forEach(dataItem => {
              xList.push(dataItem[dItem])
            })
            let xAxisItem = {
              type: "category",
              axisTick: {show: false},
              data: xList
            }
            options.echartsOptions.xAxis.push(xAxisItem);
          })
        }
        return options.echartsOptions
      },
      tenDepChartClicked(e) {
        this.options.value = e.value
        // if (this.options.tempObj[e.name + '_' + e.seriesType]  === undefined) {
        //   this.options.tempObj[e.name + '_' + e.seriesType] = []
        // }
        // this.options.tempObj[e.name+'_'+e.seriesType].push({[e.seriesName]: e.value})
        // setChartsConfigDatas(this.options.tempObj)
      }
    }
  },
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '数据表',
        value: 'radio-button-tables',
        formType: 'interface-chart-histogram'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-chart-histogram'
      },
      {
        label: '数据集',
        value: 'radio-button-dataset',
        formType: 'interface-chart-histogram'
      },
      // {
      //   label: 'SQL脚本',
      //   value: 'radio-button-sql'
      // }, {
      //   label: '视图',
      //   value: 'radio-button-view'
      // }
    ]
  },
  configList: [
    {
      labelName: '高度',
      formType: 'input-number',
      key: 'height'
    },{
      labelName: '配色方案',
      formType: 'chart-color-config',
      key: 'chartColors',
    }
    // {
    //   labelName: '数据配置',
    //   isSetConfigName:true, // 不启用labelWidth
    //   formType: 'data-source-api-config',
    //   key: 'contentDataSource',
    //   typeConfigs: [
    //     {
    //       label: '数据表',
    //       value: 'radio-button-tables',
    //       formType: 'interface-chart-histogram'
    //     }, {
    //       label: '数据集',
    //       value: 'radio-button-dataset',
    //       formType: 'interface-chart-histogram'
    //     }, {
    //       label: '后端服务',
    //       value: 'radio-button-interface',
    //       formType: 'interface-chart-histogram'
    //     }
    //   ]
    // },
    // {
    //   labelName: '颜色配置',
    //   formType: 'chart-colors-picker',
    //   key: 'chartColors',
      // typeConfigsKey: 'interfaceDataConfig.chartSettings.metrics'
      // typeConfigs: [
      //   {
      //     label: '数据表',
      //     value: 'radio-button-tables',
      //     formType: 'interface-chart-histogram'
      //   }, {
      //     label: '数据集',
      //     value: 'radio-button-dataset',
      //     formType: 'interface-chart-histogram'
      //   }, {
      //     label: '后端服务',
      //     value: 'radio-button-interface',
      //     formType: 'interface-chart-histogram'
      //   }
      // ]
    // }
    // {
    //   labelName: '图标样式',
    //   formType: 'icon-upload',
    //   key: 'icon'
    // }, {
    //   labelName: '触发操作',
    //   formType: 'radio-button',
    //   key: 'operate',
    //   typeConfigs: [
    //     {
    //       label: '页面跳转',
    //       value: 'aaa'
    //     }, {
    //       label: '接口调用',
    //       value: 'bbb'
    //     }
    //   ]
    // }, {
    //   labelName: '图标颜色',
    //   formType: 'color-picker',
    //   key: 'color'
    // }, {
    //   labelName: '图标大小',
    //   formType: 'input-number',
    //   key: 'size'
    // }
  ],
  options: optionsConfig
}
