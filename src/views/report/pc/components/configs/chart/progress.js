/** 图标 */
let optionsConfig = {
  // 自定义属性
  percentage: 10,
  strokeWidth: 10,
  color: '#1989fa',
  type:'line',
  maxValue:100,
  rateValue:0,
  numberShow:false, // 进度条数值显示
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: undefined,
    maxValue:undefined,
    // 数据绑定
    bindDataKey: '',
    tableData:[]
  },
  // 公共属性
  commonConfig: {
    topPaddingDistance: 10,
    bottomPaddingDistance: 10,
    leftPaddingDistance: 10,
    rightPaddingDistance: 10,
  }
}
import progressComment from '@/views/report/public-components/progress-comment.vue'
export default {
  type: 'van-design-progress',
  name: '进度条',
  isMixinsCustomConfig:true,
  icon: 'iconjindutiao1',
  // img: button_img,
  component: {
    components: {
      progressComment
    },
    template: `
      <div>
        <progressComment v-if="options.type === 'line'" :options="options" />
        <a-progress v-else :percent="(options.contentDataSource === 'radio-button-default' ? Math.ceil(options.rateValue*100/options.maxValue) : Math.ceil(options.interfaceDataConfig.value*100/options.interfaceDataConfig.maxValue))" :stroke-width="options.strokeWidth" :type="options.type" :color="options.color" />
      </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
  },
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '默认值',
        value: 'radio-button-default',
        key: 'value'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-text-title'
      }
    ]
  },
  configList: [{
      labelName: '类型',
      formType: 'radio-button',
      key: 'type',
      typeConfigs: [
        {
          label: '进度条',
          value: 'line'
        }, {
          label: '进度圈',
          value: 'circle'
        }, {
          label: '仪表盘',
          value: 'dashboard'
        }
      ]
    },
    {
      formType: 'custom-component-config'  // 控制组件位置
    },
    {
      labelName: '数值显示',
      formType: 'switch',
      key: 'numberShow'
    }, 
    {
      labelName: '宽度',
      formType: 'input-number',
      key: 'strokeWidth'
    }, {
      labelName: '颜色',
      formType: 'color-picker',
      key: 'color'
    }
  ],
  options: optionsConfig
}
