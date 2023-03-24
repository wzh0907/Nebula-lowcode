import {axisFormatter} from "@/views/report/pc/components/configs/chart/axis-formatter";

/** 折线图 */
let optionsConfig = {
  // 自定义属性
  height: 400,
  value: '',
  // responseConfig:false,
  tempObj:{},
  contentDataSource: 'radio-button-tables',
  chartColors:['#0780cf','#765005','#fa6d1d','#0e2c82','#b6b51f','#da1f18','#701866','#f47a75','#009db2','#024b51','#0780cf','#765005'],
  echartsOptions: {
    color: [],
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
      dimension: []
    },
    chartData: {
      // columns: ['日期', '访问用户', '下单用户'],
      rows: []
    }
  },
  defaultData:{
    chartSettings: {
      metrics: ["访问用户","下单用户"],
      dimension: ["日期"],
    },
    chartData: {
      // columns: [],
      // rows: []
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
// import { setChartsConfigDatas } from "@/views/report/utils/set_charts_data.js";
export default {
  type: 'van-design-chart-line',
  name: '线性图',
  icon: 'iconzhuxianzuhetu',
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
        options.echartsOptions.legend = {}
        let resp
        // 横轴
        let dimension = []
        // 纵轴
        let metrics = []
        //堆叠
        // let stack = []
        if (options.interfaceDataConfig.id ||
          options.interfaceDataConfig.chartData.rows.length) {
          dimension = options.interfaceDataConfig.chartSettings.dimension || []
          metrics = options.interfaceDataConfig.chartSettings.metrics || []
          resp = options.interfaceDataConfig.chartData.rows || []
          // stack = options.interfaceDataConfig.stack || []
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
              type: 'line',
              smooth: true,
              data: sList
            }
            // if (stack.includes(item)) {
            //   metricItem.stack = 'stack'
            // } else {
            //   metricItem.stack = undefined
            // }
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
        // if (this.options.tempObj[e.value[0]+'_'+e.seriesType]  === undefined) {
        //   this.options.tempObj[e.value[0]+'_'+e.seriesType] = []
        // }
        // this.options.tempObj[e.value[0]+'_'+e.seriesType].push({[e.seriesName]: e.value[1]})
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
        label: '数据集',
        value: 'radio-button-dataset',
        formType: 'interface-chart-histogram'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-chart-histogram'
      }
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
    },
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
  ],
  options: optionsConfig
}
