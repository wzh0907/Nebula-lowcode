import layoutTemplate from './template.vue'
import optionsConfig from './options-config'
/**
 * TODO:: beforeCreate, beforeDestroy hook报错
 * 待修复，目前解决方法是删除beforeCreate, beforeDestroy方法
 */
// delete layoutTemplate.beforeCreate
// delete layoutTemplate.beforeDestroy

export default {
  type: 'van-design-list',
  name: '列表',
  icon: 'iconliebiao1',
  component: layoutTemplate,
  // dataSourceConfig: {
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
  configList: [
    {
      labelName: '数据配置',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'data-source-api-config',
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
    {
      labelName: '图片',
      formType: 'input',
      key: 'img'
    }, {
      labelName: '标题',
      formType: 'input',
      key: 'title'
    }, {
      labelName: '内容',
      formType: 'input',
      key: 'contain'
    }, {
      labelName: '副标题-描述',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'columns-values-config',
      key: 'options'
    }, {
      labelName: '操作项',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'columns-values-config',
      key: 'opert'
    }
  ],
  options: optionsConfig
}
