/** 柱状图 */
let optionsConfig = {
  // 自定义属性
  // 配置
  contentDataSource: 'radio-button-tables',
  tempObj:{},
  commonConfigCompWidthUnit: "%",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "px",
  commonConfigCompHeight:"400",
  echartsOptions: {
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
      columns: [],
      rows: []
    }
  },
  defaultData:{
    chartSettings: {
      metrics: [],
      dimension: [],
    },
    chartData: {
      columns: ['时间', '地点', '人数'],
      rows: [
        { '时间': '星期一', '地点': '北京', '人数': 1000 },
        { '时间': '星期二', '地点': '上海', '人数': 400 },
        { '时间': '星期三', '地点': '杭州', '人数': 800 },
        { '时间': '星期二', '地点': '深圳', '人数': 200 },
        { '时间': '星期三', '地点': '长春', '人数': 100 },
        { '时间': '星期五', '地点': '南京', '人数': 300 },
        { '时间': '星期四', '地点': '江苏', '人数': 800 },
        { '时间': '星期一', '地点': '北京', '人数': 700 },
        { '时间': '星期三', '地点': '上海', '人数': 300 },
        { '时间': '星期二', '地点': '杭州', '人数': 500 }
      ]
    }
  }
}
import {axisFormatter} from "@/views/report/pc/components/configs/chart/axis-formatter";
import { setChartsConfigData } from "@/views/report/utils/set_charts_data.js";
export default {
  type: 'van-design-chart-heatmap',
  name: '热力图',
  icon: 'iconrelitu',
  component: {
    template: `
      <div ref="chart" :style="{width:chartWidth, height: chartHeight}"></div>
    `,
    components: {
    },
    data() {
      return {
        options: optionsConfig,
        chart: null
      }
    },
    computed:{
      chartWidth(){
        const margin = this.options.commonConfig.leftSpaceDistance + this.options.commonConfig.rightSpaceDistance + 'px'
        let width = this.options.commonConfigCompWidth+this.options.commonConfigCompWidthUnit
        if(this.options.commonConfigCompWidthUnit=='auto'){
          return `calc(100% - ${margin})`
        }
        return `calc(${width} - ${margin})`
      },
      chartHeight(){
        if(this.options.commonConfigCompHeightUnit=='auto'){
          return '100%'
        }
        return this.options.commonConfigCompHeight+this.options.commonConfigCompHeightUnit
      },
      events(){
        var self = this;
        return {
          click: function (e) {
            self.tenDepChartClicked(e);
          }
        }
      }
    },
    watch: {
      'chartHeight': {
        handler: function (val) {
          this.$nextTick(function () {
            this.chart.resize()
          })
        }
      },
      'chartWidth': {
        handler: function () {
          this.$nextTick(function () {
            this.chart.resize()
          })
        }
      },
    },
    created() {
      // var self = this;
      // this.options.chartPEvents = {
      //   click: function(e) {
      //       self.tenDepChartClicked(e);
      //   }
      //  };
    },
    methods: {
      chartOptions() {
        let options = this.options
        let resp
        // 横轴
        let dimension = []
        // 纵轴
        let metrics = []
        if (options.interfaceDataConfig.id ||
          options.interfaceDataConfig.chartData.rows.length) {
          dimension = options.interfaceDataConfig.chartSettings.dimension || []
          metrics = options.interfaceDataConfig.chartSettings.metrics || []
          resp = options.interfaceDataConfig.chartData.rows || []
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
            if (stack.includes(item)) {
              metricItem.stack = 'stack'
            } else {
              metricItem.stack = undefined
            }
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
         // 2022-04-12 简单的穿透X轴
         this.options.value = e.name
        // setChartsConfigData(e)
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
    // }
  ],
  options: optionsConfig
}
