import { FormatType } from '@/views/report/utils/deal-text-format/format-def'
import { formatHandler } from '@/views/report/utils/deal-text-format/format-handler'

let optionsConfig = {
  // 自定义属性
  contentDataSource: 'radio-button-default',
  value: '文本',
  enValue: '',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '文本',
  },
  textFormat: FormatType.NORMAL_TEXT,
  styleEditorConfig: {
    textBgColor: '',
    textHtmlSize: 14,
    textHtmlPosit: '',
    textHtmlBlod: '',
    textHtmlTilt: '',
    textHtmlUnder: '',
    textColor: '#333',
    lineHeight:32,
  }
}
export default {
  type: 'van-design-text',
  name: '文本',
  icon: 'iconwenben',
  component: {
    template: `
      <div
        :style="{
          'color': options.styleEditorConfig.textColor,
          'background': options.styleEditorConfig.textBgColor,
          'fontSize': options.styleEditorConfig.textHtmlSize +'px',
          'textAlign': options.styleEditorConfig.textHtmlPosit,
          'fontWeight': options.styleEditorConfig.textHtmlBlod,
          'fontStyle': options.styleEditorConfig.textHtmlTilt,
          'textDecoration': options.styleEditorConfig.textHtmlUnder,
          'lineHeight':options.styleEditorConfig.lineHeight + 'px',
        }"
      >
        <span style="width:100%" >
          {{formatFunction(getDisplayText())}}
        </span>
      </div>
    `,
    data() {
      return {
        options: optionsConfig
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
        if (options.contentDataSource === 'radio-button-bind' && options._isGenerateComponent) {
          displayText = options._interfaceTableDataItem &&
            (
              options._interfaceTableDataItem[options.interfaceDataConfig.bindDataKey] === undefined
                ? ''
                : options._interfaceTableDataItem[options.interfaceDataConfig.bindDataKey]
            )
        } else if (options.contentDataSource === 'radio-button-bind') {
          displayText = options.interfaceDataConfig.value
        } else if (options.contentDataSource === 'radio-button-default') {
          let language = navigator.language.substr(0, 2)
          if (language == 'zh') {
            displayText = this.options.value || this.options.enValue
          } else {
            displayText = this.options.enValue || this.options.value
          }
        } else {
          displayText = options.interfaceDataConfig.value
        }

        return displayText || ''
      },
    }
  },
  dataSourceConfig: {
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
      }, {
        label: '数据绑定',
        value: 'radio-button-bind',
        formType: 'interface-text-title'
      }
    ]
  },
  configList: [
    // {
    //   labelName: '文本内容',
    //   isSetConfigName:true, // 不启用labelWidth
    //   formType: 'custom-text-content',
    //   key: 'contentDataSource',
    //   typeConfigs: [
    //     {
    //       label: '默认值',
    //       value: 'radio-button-default',
    //       formType: 'input',
    //       key: 'value'
    //     }, {
    //       label: '后端服务',
    //       value: 'radio-button-interface',
    //       formType: 'interface-text-title'
    //     }
    //   ]
    // },
    {
      labelName: '文本内容',
      formType: 'i18nTextArea',
      key: 'value',
      enKey: 'enValue'
    },
    {
      labelName: '样式',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'custom-text-content',
      key: 'styleEditorConfig'
    },
    {
      labelName: '文本格式',
      formType: 'text-format-selector',
      key: 'textFormat'
    },
  ],
  options: optionsConfig
}
