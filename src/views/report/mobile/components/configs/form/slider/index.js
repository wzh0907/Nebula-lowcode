import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-slider',
  name: '滑动条',
  icon: 'iconsliders',
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
      labelName: '默认值',
      formType: 'input-number',
      key: 'value'
    }, {
      labelName: '高度',
      formType: 'input-number',
      key: 'barHeight'
    }, {
      labelName: '按钮大小',
      formType: 'input-number',
      key: 'buttonSize'
    }, {
      labelName: '最小值',
      formType: 'input-number',
      key: 'min'
    }, {
      labelName: '最大值',
      formType: 'input-number',
      key: 'max'
    }, {
      labelName: '步长',
      formType: 'input-number',
      key: 'step'
    }, {
      labelName: '竖向显示',
      formType: 'switch',
      key: 'vertical'
    }
  ],
  options: optionsConfig
}
