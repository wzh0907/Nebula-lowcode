import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-countdown',
  name: '倒计时',
  icon: 'iconcountdown',
  component: layoutTemplate,
  dataSourceConfig: {
    key: 'contentDataSource',
    // typeConfigs: [
    //   {
    //     label: '默认值',
    //     value: 'radio-button-default',
    //     key: 'value'
    //   }, {
    //     label: '后端服务',
    //     value: 'radio-button-interface',
    //     formType: 'interface-text-title'
    //   }
    // ]
  },
  configList: [
    {
      labelName: '样式',
      isSetConfigName: true, // 不启用labelWidth
      formType: 'custom-text-content',
      key: 'styleEditorConfig'
    },
  ],
  options: optionsConfig
}
