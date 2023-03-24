let optionsConfig = {
  // 自定义属性
  contentDataSource: 'radio-button-default',
  // radioButtonKeyDefault: '标题',
  // radioButtonKeyInterface: '',
  // text: '标题',
  value: '标题',
  interfaceDataConfig: {
    id: '',
    key: '',
    value: '标题',
  },
  styleEditorConfig: {
    textBgColor: '',
    textHtmlSize: 16,
    textHtmlPosit: '',
    textHtmlBlod: '',
    textHtmlTilt: '',
    textHtmlUnder: '',
    textColor: '#333'
  }
}
export default {
  type: 'van-design-text-title',
  isAsideMenuHide: true,
  name: '标题',
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
        <span>
          {{ (options.contentDataSource === 'radio-button-default' ? options.value : options.interfaceDataConfig.value) || '暂无数据' }}
        </span>
      </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    methods: {}
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
    }, {
      labelName: '样式',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'text-style-editor',
      key: 'styleEditorConfig'
    }
  ],
  options: optionsConfig
}
