import { FormatType } from '@/views/report/utils/deal-text-format/format-def'
import { formatHandler } from '@/views/report/utils/deal-text-format/format-handler'
let optionsConfig = {
  // 自定义属性
  contentDataSource: 'radio-button-default',
  text: '大标题',
  interfaceDataConfig: {
    id: '',
    key: '',
    value: '标题',
  },
  textFormat: FormatType.NORMAL_TEXT,
  styleEditorConfig: {
    textBgColor: '',
    textHtmlSize: 20,
    textHtmlPosit: '',
    textHtmlBlod: 'bold',
    textHtmlTilt: '',
    textHtmlUnder: '',
    textColor: '#333'
  }
}

export default {
  type: 'van-design-text-title-big',
  isAsideMenuHide: true,
  name: '大标题',
  icon: 'icontext',
  component: {
    template: `
      <div
        class="text-title"
        :style="{
          'color': options.styleEditorConfig.textColor,
          'background': options.styleEditorConfig.textBgColor,
          'fontSize': options.styleEditorConfig.textHtmlSize +'px',
          'textAlign': options.styleEditorConfig.textHtmlPosit,
          'fontWeight': options.styleEditorConfig.textHtmlBlod,
          'fontStyle': options.styleEditorConfig.textHtmlTilt,
          'textDecoration': options.styleEditorConfig.textHtmlUnder
        }"
      >
        <span v-text="formatFunction(getDisplayText())" />
      </div>
    `,
    data() {
      return {
        options: optionsConfig,
      }
    },
    computed: {
      formatFunction() {
        const options = this.options

        return formatHandler[options.textFormat] || (t => t)
      }
    },
    methods: {
      getDisplayText() {
        let displayText = ''
        const options = this.options

        if (options.contentDataSource === 'radio-button-default') {
          displayText = options.value
        } else {
          displayText = options.interfaceDataConfig.value
        }

        return displayText || '暂无数据'
      },
    },
  },
  configList: [
    {
      labelName: '文本内容',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'data-source-api-config',
      key: 'contentDataSource',
      typeConfigs: [
        {
          label: '默认值',
          value: 'radio-button-default',
          formType: 'input',
          key: 'value'
        }, {
          label: '后端服务',
          value: 'radio-button-interface',
          formType: 'interface-text-title'
        }
      ]
    },
    {
      labelName: '样式',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'text-style-editor',
      key: 'styleEditorConfig'
    },
    {
      labelName: '文本格式',
      formType: 'text-format-selector',
      key: 'textFormat'
    }
  ],
  options: optionsConfig
}
