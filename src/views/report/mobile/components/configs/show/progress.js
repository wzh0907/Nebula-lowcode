/** 图标 */
let optionsConfig = {
  // 自定义属性
  // percentage: 20,
  strokeWidth: 10,
  color: '#1989fa',
  type: 'line',
  maxValue: 100,
  rateValue: 20,
  numberShow: false, // 进度条数值显示
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '',
    maxValue: '',
    // 数据绑定
    bindDataKey: ''
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
  icon: 'iconjindutiao1',
  isMixinsCustomConfig: true,
  // img: button_img,
  component: {
    components: {
      progressComment
    },
    template: `
      <van-circle :text="progressTip" :rate="options.rateValue" v-if="options.type === 'circle' && options.contentDataSource === 'radio-button-default'" layer-color="#f5f5f5" v-model.number="options.rateValue" :color="options.color" stroke-linecap="butt" :speed="100" :size="options.strokeWidth" />
      <van-circle :text="progressTip" :rate="options.interfaceDataConfig.value" v-else-if="options.type === 'circle' && options.contentDataSource !== 'radio-button-default'" layer-color="#f5f5f5" v-model.number="options.interfaceDataConfig.value" :color="options.color" stroke-linecap="butt" :speed="100" :size="options.strokeWidth" />
      <div v-else>
        <progressComment v-if="options.type === 'line'" :options="options" />
        <van-progress v-else :percentage="(options.contentDataSource === 'radio-button-default' ? options.rateValue : options.interfaceDataConfig.value)" :type="options.type" :stroke-width="options.strokeWidth" :color="options.color" />
      </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed: {
      progressTip() {
        if (this.options.type === 'circle' && this.options.contentDataSource === 'radio-button-default') {
          return this.options.rateValue.toFixed(0) + '%';
        } else {
          return this.options.interfaceDataConfig.value && this.options.interfaceDataConfig.value.toFixed(0) + '%';
        }

      }
    },
    watch: {
      deep: true,
      'options.type': {
        handler(val) {
          if (val === 'circle') {
            if (this.options.strokeWidth < 100) {
              this.options.strokeWidth = 100
            }
          } else {
            this.options.strokeWidth = 10
          }

        }
      }
    }
  },
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-chart-histogram'
      }
    ]
  },
  configList: [
    {
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
        }
      ]
    },
    {
      labelName: '默认最大',
      formType: 'input',
      key: 'maxValue'
    },
    {
      labelName: '默认进度',
      formType: 'input',
      key: 'rateValue'
    },
    {
      labelName: '数值显示',
      formType: 'switch',
      key: 'numberShow'
    },
    {
      labelName: '高度',
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
