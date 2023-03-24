let optionsConfig = {
  // 自定义属性
  value:"",
  commonConfigCompWidthUnit: "%",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "px",
  commonConfigCompHeight:"400",
  legendAlign: 'top',
  chartPEvents: {},
  // 配置
  contentDataSource: 'radio-button-tables',
  chartColors: ['#0780cf', '#765005', '#fa6d1d', '#0e2c82', '#b6b51f', '#da1f18', '#701866', '#f47a75', '#009db2', '#024b51', '#0780cf', '#765005'],
  echartsOptions: {
    color: [],
    grid: {},
    tooltip: {
      trigger: 'item'
    },
    series: []
  },
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    chartSettings: {
      metrics: '',
      dimension: ''
    },
    chartData: {
      columns: [],
      rows: []
    }
  },
  defaultData: {
    chartSettings: {
      metrics: "访问用户",
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
import { setChartsConfigData } from "@/views/report/utils/set_charts_data.js";
export default {
  type: 'van-design-chart-ring',
  name: '环形图',
  icon: 'iconhuanxingtu',
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
      //   click: function (e) {
      //     self.tenDepChartClicked(e);
      //   }
      // };
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
        window.addEventListener("resize", () => { this.chart.resize()})
      },
      chartOptions() {
        let options = this.options
        options.echartsOptions.color = options.chartColors
        options.echartsOptions.legend = this.legend()
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
          let sList = []
          resp.forEach(dataItem => {
            sList.push({
              name: dataItem[dimension],
              value: dataItem[metrics]
            })
          })
          let metricItem = {
            name: metrics,
            type: 'pie',
            radius: ['50%', '70%'],
            data: sList
          }
          options.echartsOptions.series.push(metricItem);
        }
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
