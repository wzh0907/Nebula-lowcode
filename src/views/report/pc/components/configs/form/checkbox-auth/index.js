import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-checkbox-auth',
  name: '权限',
  icon: 'iconyonghuguanli',
  component: layoutTemplate,
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
  configList: [
    {
      labelName: '完全受控',
      formType: 'switch',
      key: 'checkStrictly',
    },
  ],
  options: optionsConfig
}

