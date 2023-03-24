import listTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-list',
  name: '列表',
  icon: 'iconliebiao1',
  component: listTemplate,
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '数据表',
        value: 'radio-button-tables',
        formType: 'interface-chart-table'
      }, {
        label: '数据集',
        value: 'radio-button-dataset',
        formType: 'interface-chart-table'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-chart-table'
      }
    ]
  },
  configList: [
    {
      labelName: '分页',
      formType: 'select',
      key: 'configPageSize',
      typeConfigs: [
        {
          label: '不分页',
          value: 10000
        },
        {
          label: '10',
          value: 10
        }, {
          label: '15',
          value: 15
        }, {
          label: '20',
          value: 20
        }, {
          label: '30',
          value: 30
        }, {
          label: '50',
          value: 50
        }
      ]
    },
  ],
  options: optionsConfig
}
