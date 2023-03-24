/** 进度条 */
import layoutTemplate from './template.vue'
import optionsConfig from './options-config'
/**
 * TODO:: beforeCreate, beforeDestroy hook报错
 * 待修复，目前解决方法是删除beforeCreate, beforeDestroy方法
 */
// delete layoutTemplate.beforeCreate
// delete layoutTemplate.beforeDestroy

export default {
  type: 'van-design-progress-bar',
  name: '占比条',
  icon: 'iconjindutiao1',
  component: layoutTemplate,
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '数据表',
        value: 'radio-button-tables',
        formType: 'interface-chart-histogram'
      }, {
        label: '数据集',
        value: 'radio-button-dataset',
        formType: 'interface-chart-histogram'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-chart-histogram'
      }
    ]
  },
  configList: [
    {
      labelName: '进度条高度',
      formType: 'input-number',
      key: 'height'
    },
    {
      labelName: '主体颜色',
      formType: 'color-picker',
      key: 'backgroundColor'
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
    //       formType: 'interface-chart-histogram'
    //     }, {
    //       label: '数据集',
    //       value: 'radio-button-dataset',
    //       formType: 'interface-chart-histogram'
    //     }, {
    //       label: '后端服务',
    //       value: 'radio-button-interface',
    //       formType: 'interface-chart-histogram'
    //     }
    //   ]
    // }
    // {
    //   labelName: '进度',
    //   formType: 'radio-button',
    //   key: 'percentage',
    //   typeConfigs: [
    //     {
    //       label: '静态数据',
    //       value: 50
    //     }, {
    //       label: '后端数据',
    //       value: 100
    //     }
    //   ]
    // }, {
    //   labelName: '进度条粗细',
    //   formType: 'input-number',
    //   key: 'strokeWidth'
    // }, {
    //   labelName: '文字',
    //   formType: 'input',
    //   key: 'pivotText'
    // }, {
    //   labelName: '进度条颜色',
    //   formType: 'color-picker',
    //   key: 'color'
    // }
  ],
  options: optionsConfig
}
