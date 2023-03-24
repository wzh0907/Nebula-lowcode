let optionsConfig = {
  // 自定义属性
  value:"",
  commonConfigCompWidthUnit: "%",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "px",
  commonConfigCompHeight:"400",
  legendAlign: 'top',
  xAxisConfig: {
    forceDisplayLabel: false,
    axisLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'solid',
        color: '#333',
      }
    },
    axisLabel: {
      show: true,
      rotate: 0,
      color: '#333',
    },
  },
  yAxisConfig: {
    name: '',
    nameShow: true,
    autoMax: true,
    autoMin: true,
    axisLine: {
      show: false,
      lineStyle: {
        width: 1,
        type: 'solid',
        color: '#333',
      }
    },
    axisLabel: {
      show: true,
      rotate: 0,
      color: '#333',
    },
    nameTextStyle: {
      color: '#333',
    }
  },
  grid: {
    left: 0,
    right: 20,
    containLabel: true
  },
  regression: {
    algorithm: 'none',
    order: 2
  },
  tempObj:{},
  // 配置
  contentDataSource: 'radio-button-tables',
  chartColors:['#0780cf','#765005','#fa6d1d','#0e2c82','#b6b51f','#da1f18','#701866','#f47a75','#009db2','#024b51','#0780cf','#765005'],
  echartsOptions: {
    color: [],
    dataset: [{
      source: []
    }, {
      transform: {}
    }],
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
      metrics: ["Y"],
      dimension: ["X"],
    },
    chartData: {
      columns: ["日期", "访问用户", "下单用户", "下单率"],
      rows: [
        { X: 1, 日期: "1/1", 访问用户: 3393, 下单用户: 1093, 下单率: 0.32, Y: 10 },
        { X: 2, 日期: "1/2", 访问用户: 4530, 下单用户: 3230, 下单率: 0.26, Y: 8  },
        { X: 3, 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76, Y: 6  },
        { X: 4, 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49, Y: 5  },
        { X: 5, 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323, Y: 4  },
        { X: 6, 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78, Y: 3  }
      ]
    }
  }
}
import {axisFormatter} from "@/views/report/pc/components/configs/chart/axis-formatter";
import { setChartsConfigDatas } from "@/views/report/utils/set_charts_data.js";
export default {
  type: 'van-design-chart-scatter',
  name: '散点图',
  icon: 'iconleidatu',
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
    watch:{
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
      'options.grid':{
        deep: true,
        handler:function(){
          this.chart.setOption(this.chartOptions())
        },
      },
      'options.regression':{
        deep: true,
        handler:function(val){
          this.chart.setOption(this.chartOptions())
        },
      },
      'options.xAxisConfig.forceDisplayLabel':{
        handler:function(val){
          if (val) {
            this.options.xAxisConfig.axisLabel.hideOverlap = false
            this.options.xAxisConfig.axisLabel.interval = 0
          } else {
            this.options.xAxisConfig.axisLabel.hideOverlap = true
            this.options.xAxisConfig.axisLabel.interval = 'auto'
          }
        },
      },
      'options.xAxisConfig':{
        deep: true,
        handler:function(val){
          this.chart.setOption(this.chartOptions())
        },
      },
      'options.yAxisConfig':{
        deep: true,
        handler:function(val){
          this.chart.setOption(this.chartOptions())
        },
      },
      'options.yAxisConfig.autoMax':{
        handler:function(val){
          if (val) {
            this.options.yAxisConfig.max = undefined
          }
        },
      },
      'options.yAxisConfig.autoMin':{
        handler:function(val){
          if (val) {
            this.options.yAxisConfig.min = undefined
          }
        },
      }
    },
    mounted() {
      this.drawCharts()
    },
    methods: {
      drawCharts() {
        this.chart = this.$echarts.init(this.$refs.chart)
        this.chart.setOption(this.chartOptions())
        this.chart.off('click')
        let that = this;
        this.chart.on('click', function(params) {
          that.options.value =params.name
        });
        this.options.grid = this.chart.getOption().grid[0]
        window.addEventListener("resize", () => { this.chart.resize()})
      },
      chartOptions() {
        let options = this.options
        let yAxisType = options.interfaceDataConfig.yAxisType
        options.echartsOptions.color = options.chartColors
        options.echartsOptions.grid = options.grid
        options.echartsOptions.legend = this.legend()
        options.echartsOptions.yAxis = {
          name: options.yAxisConfig.nameShow ? options.yAxisConfig.name : '',
          nameTextStyle: options.yAxisConfig.nameTextStyle,
          max: options.yAxisConfig.max,
          min: options.yAxisConfig.min,
          axisLabel: options.yAxisConfig.axisLabel,
          axisLine: options.yAxisConfig.axisLine,
        }
        options.echartsOptions.yAxis.axisLabel.formatter = function (value) {
          return axisFormatter(value, yAxisType)
        }
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
          options.echartsOptions.xAxis = [];
          dimension.forEach((dItem) => {
            let xList = [];
            resp.forEach(dataItem => {
              xList.push(dataItem[dItem])
            })
            // console.log('xList=', xList);
            let xAxisItem = {
              type: "category",
              axisTick: {show: false},
              axisLabel: options.xAxisConfig.axisLabel,
              axisLine: options.xAxisConfig.axisLine,
              // data: xList
            }
            options.echartsOptions.xAxis.push(xAxisItem);
          })


          // options.echartsOptions.dataset[0].dimension = dimension.concat(metrics)
          if (options.regression.algorithm !== 'none') {
            options.echartsOptions.dataset[1].transform = {
              type: 'ecStat:regression',
              config: {
                method: options.regression.algorithm,
                // method: 'logarithmic',
                // dimensions: ['X', '访问用户'],
                // dimensions: [0, 1],
                order: options.regression.order
              }
            }

            let data = []
            resp.forEach(dataItem => {
              let item = []
              item.push(dataItem[dimension[0]])
              metrics.forEach(metric => {
                item.push(dataItem[metric])
              })
              data.push(item)
            })
            options.echartsOptions.dataset[0].source = data

            options.echartsOptions.series = []
            metrics.forEach((item) => {
              let sList = []
              resp.forEach(dataItem => {
                sList.push(dataItem[item])
              })
              let metricItem = {
                name: item,
                type: 'scatter',
                // data: sList
              }
              // let myRegression = this.$ecStat.regression('polynomial', data);
              options.echartsOptions.series.push(metricItem);
              // options.echartsOptions.series.push({
              //   name: "line",
              //   type: "line",
              //   label: {show: true},
              //   data: myRegression.points
              // })

            })

            options.echartsOptions.series.push({
              name: 'line',
              type: 'line',
              smooth: true,
              datasetIndex: 1,
              symbolSize: 0.1,
              symbol: 'circle',
              color: this.options.echartsOptions.color[0],
              label: { show: true, fontSize: 16 ,overflow: 'break'},
              labelLayout: { dx: -80, width: 300 },
              encode: { label: 2, tooltip: 1 }
            })
          } else {
            let data = []
            resp.forEach(dataItem => {
              let item = []
              item.push(dataItem[dimension[0]])
              metrics.forEach(metric => {
                item.push(dataItem[metric])
              })
              data.push(item)
            })
            options.echartsOptions.dataset[0].source = data

            options.echartsOptions.series = []
            metrics.forEach((item) => {
              let sList = []
              resp.forEach(dataItem => {
                sList.push(dataItem[item])
              })
              let metricItem = {
                name: item,
                type: 'scatter',
                // data: sList
              }
              options.echartsOptions.series.push(metricItem);
            })
          }
        }
        console.log('echartsOptions=', JSON.stringify(options.echartsOptions));
        return options.echartsOptions
      },
      legend() {
        let legend = {}
        switch (this.options.legendAlign) {
          case "top":
            legend = {
              orient: 'horizontal',
              right: 'center',
              top: 0
            }
            break
          case "left":
            legend = {
              orient: 'vertical',
              left: 0,
              top: 'center'
            }
            break
          case "right":
            legend = {
              orient: 'vertical',
              right: 0,
              top: 'center'
            }
            break
          case "bottom":
            legend = {
              orient: 'horizontal',
              right: 'center',
              bottom: 0
            }
            break
          case "none":
            legend = undefined
            break
        }
        return legend
      },
      tenDepChartClicked(e) {
        // 2022-04-12 简单的穿透X轴
        this.options.value = e.name
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
      labelName: '配色方案',
      formType: 'chart-color-config',
      key: 'chartColors',
    },{
      labelName: '图例',
      formType: 'custom-style-legend',
      key: 'legendAlign',
      typeConfigs: [
        {
          label: '上',
          value: 'top'
        }, {
          label: '下',
          value: 'bottom'
        }, {
          label: '左',
          value: 'left'
        },{
          label: '右',
          value: 'right'
        },{
          label: '无',
          value: 'none'
        }
      ],
    },
    {
      labelName: '图表偏移',
      formType: 'grid-offset-config',
      key: 'grid',
    },
    {
      labelName: '回归统计',
      formType: 'regression-charts',
      key: 'regression',
    },
    {
      labelName: '坐标X轴',
      formType: 'x-axis-config',
      key: 'xAxisConfig',
      isSetConfigName:true, // 不启用labelWidth
    },
    {
      labelName: '坐标Y轴',
      formType: 'y-axis-config',
      key: 'yAxisConfig',
      isSetConfigName:true, // 不启用labelWidth
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
    // }
  ],
  options: optionsConfig
}
