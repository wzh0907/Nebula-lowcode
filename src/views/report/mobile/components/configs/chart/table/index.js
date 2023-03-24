/** 进度条 */
import tableTemplate from './template.vue'
import optionsConfig from './options-config'
/**
 * TODO:: beforeCreate, beforeDestroy hook报错
 * 待修复，目前解决方法是删除beforeCreate, beforeDestroy方法
 */
// delete tableTemplate.beforeCreate
// delete tableTemplate.beforeDestroy

export default {
  type: 'van-design-table',
  name: '表格',
  icon: 'iconbiaoge1',
  component: tableTemplate,
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
      labelName: '筛选器ID',
      formType: 'input',
      key: 'triggerComponentId'
    },
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
    // {
    //   // TODO:: 待优化  目前耦合性太高，且没有明确的关联标识，需要添加一下标识
    //   // TODO:: 依赖项  依赖key值是否展示
    //   // frontKey
    // },
    // 数据来源配置
    // {
    //   labelName: '表列设置',
    //   formType: 'collapse-panel',
    //   panelLabelPosition: 'left',
    //   panelLabelPositionWidth: '45px',
    //   addBtnText: '添加列',
    //   key: 'optionColumn',
    //   addColumnConfig: {
    //     label: '',
    //     prop: ''
    //   },
    //   collapsePanelColumnsConfigs: [
    //     {
    //       labelName: '列名：',
    //       formType: 'input',
    //       placeholder: '值',
    //       key: 'label'
    //     },
    //     {
    //       labelName: '列值：',
    //       formType: 'input',
    //       placeholder: '值',
    //       key: 'prop'
    //     }
    //   ]
    // }
  ],
  options: optionsConfig
}
