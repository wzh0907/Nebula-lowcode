let optionsConfig = {
  // 自定义属性
  value:"",
  commonConfigCompWidthUnit: "%",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "px",
  commonConfigCompHeight:"400",
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
    right: 0,
    containLabel: true
  },  //坐标轴离四周的距离
  // 配置
  contentDataSource: 'radio-button-tables',
  chartColors:['#0780cf','#765005','#fa6d1d','#0e2c82','#b6b51f','#da1f18','#701866','#f47a75','#009db2','#024b51','#0780cf','#765005'],
  echartsOptions: {
    color: [],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {},
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      axisLabel: {show: true},
      data: ['总计']
    },
    yAxis: {
      type: "value",
    },
    series: []
  },
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    yAxisType: '',
    chartSettings: {
      metrics: '',
      dimension: '',
      yAxisType: [],
    },
    chartData: {
      rows: []
    }
  },
  defaultData: {
    chartSettings: {
      metrics: "下单用户",
      dimension: "日期",
    },
    chartData: {
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

//瀑布图使用堆叠柱状图模拟，通过将堆叠图下半部分设为透明来模拟瀑布图
import {axisFormatter} from "@/views/report/pc/components/configs/chart/axis-formatter";
export default {
  type: 'van-design-chart-waterfall',
  name: '瀑布图',
  icon: 'iconchart',
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
        // options.echartsOptions.legend = this.legend()
        options.echartsOptions.xAxis = {
          axisTick: {show: false},
          axisLabel: options.xAxisConfig.axisLabel,
          axisLine: options.xAxisConfig.axisLine,
        }
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
        options.echartsOptions.tooltip.formatter = function (params) {
          let tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
        }
        let total = 0
        let resp
        // 横轴
        let dimension = ''
        // 纵轴
        let metrics = ''
        if (options.interfaceDataConfig.id ||
          options.interfaceDataConfig.chartData.rows.length) {
          dimension = options.interfaceDataConfig.chartSettings.dimension || ''
          metrics = options.interfaceDataConfig.chartSettings.metrics || ''
          resp = options.interfaceDataConfig.chartData.rows || []
        }
        else {
          dimension = options.defaultData.chartSettings.dimension;
          metrics = options.defaultData.chartSettings.metrics
          resp = options.defaultData.chartData.rows
        }
        if (resp) {
          options.echartsOptions.series = []
          options.echartsOptions.xAxis.data = ['总计']
          resp.forEach(dataItem => {
            total = total + (dataItem[metrics] + 0)
            options.echartsOptions.xAxis.data.push(dataItem[dimension])
          })

          let data1 = [total]  //有颜色部分的数值
          resp.forEach(dataItem => {
            data1.push(dataItem[metrics])
          })
          let data0 = [0, total - data1[1]]  //透明部分的数值
          for (let i = 2; i < data1.length; i++) {
            data0.push(data0[i-1] - data1[i])
          }
          options.echartsOptions.series.push({
            name: 'Placeholder',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            },
            emphasis: {
              itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
              }
            },
            data: data0
          })
          options.echartsOptions.series.push({
            name: metrics,
            type: 'bar',
            stack: 'Total',
            label: {
              show: true,
              position: 'top',
              formatter: function (value) {
                return axisFormatter(value.value, yAxisType)
              }
            },
            data: data1
          })

          // options.echartsOptions.xAxis = [];
          // dimension.forEach((dItem) => {
          //   let xList = [];
          //   resp.forEach(dataItem => {
          //     xList.push(dataItem[dItem])
          //   })
          //   let xAxisItem = {
          //     type: "category",
          //     axisTick: {show: false},
          //     data: xList
          //   }
          //   options.echartsOptions.xAxis.push(xAxisItem);
          // })
        }
        return options.echartsOptions
      },
      tenDepChartClicked(e) {
        // 2022-04-12 简单的穿透X轴
        this.options.value = e.name
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
    },
    {
      labelName: '图表偏移',
      formType: 'grid-offset-config',
      key: 'grid',
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
