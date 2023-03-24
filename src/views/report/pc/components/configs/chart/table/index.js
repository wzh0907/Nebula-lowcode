import tableTemplate from './template-simple.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-table',
  name: '表格',
  icon: 'iconbiaoge1',
  component: tableTemplate,
  isMixinsCustomConfig: true,
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
    // {
    //   labelName: '数据配置',
    //   isSetConfigName:true, // 不启用labelWidth
    //   formType: 'data-source-api-config',
    //   key: 'contentDataSource',
    //   typeConfigs: [
    //     {
    //       label: '数据表',
    //       value: 'radio-button-tables',
    //       formType: 'interface-chart-table'
    //     }, {
    //       label: '数据集',
    //       value: 'radio-button-dataset',
    //       formType: 'interface-chart-table'
    //     }, {
    //       label: '后端服务',
    //       value: 'radio-button-interface',
    //       formType: 'interface-chart-table'
    //     }
    //   ]
    // }, 
    //  {
    //   labelName: '表列设置',
    //   formType: 'columns-config',
    //   addBtnText: '添加表列',
    //   key: 'columnsConfigList',
    //   addColumnConfig: {
    //     value: '',
    //     title: '',
    //     colValue: '',
    //     dataIndex: '',
    //     key: '',
    //     align: 'center',
    //     colIndex: 0,
    //     specialColumnsConfigs: {},
    //     interfaceDataConfig: {},
    //   }
    // }, 
    // {
    //   labelName: '分页',
    //   formType: 'select',
    //   key: 'configPageSize',
    //   typeConfigs: [
    //     {
    //       label: '10',
    //       value: 10
    //     }, {
    //       label: '15',
    //       value: 15
    //     }, {
    //       label: '20',
    //       value: 20
    //     }, {
    //       label: '30',
    //       value: 30
    //     }, {
    //       label: '50',
    //       value: 50
    //     }
    //   ]
    // },
    {
      labelName: '表头固定',
      formType: 'switch',
      key: 'defaultValue'
    }, {
      labelName: '行号开关',
      formType: 'switch',
      key: 'rowIndexSwitch'
    }
  ],
  options: optionsConfig
}
