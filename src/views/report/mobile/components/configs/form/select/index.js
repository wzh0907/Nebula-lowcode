import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-select',
  name: '选择器',
  // isFullCustomConfig: true,
  icon: 'icondanchu',
  component: layoutTemplate,
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '默认值',
        value: 'radio-button-default',
        formType: 'default',
        key: 'value',
        addColumnConfig: {
          label: '',
          value: ''
        }
      }, {
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
      labelName: '标签名称',
      formType: 'i18nInput',
      key: 'label',
      enKey: 'enLabel'
    },
    {
      labelName: '标签显示',
      formType: 'custom-style-label',
      key: 'labelAlign',
      typeConfigs: [
        {
          label: '左对齐',
          value: 'left',
          icon: 'iconzuoduiqi1'
        }, {
          label: '右对齐',
          value: 'right',
          icon: 'iconyouduiqi1'
        }, {
          label: '顶部对齐',
          value: 'top',
          icon: 'iconjuzhongduiqi'
        },
      ],
      setData: {
        width:'labelWidth', //宽度
        labelShow: 'labelShow' //是否显示标签
      }
    },
    {
      labelName: '数值对齐',
      formType: 'radio-button',
      key: 'valueAlign',
      typeConfigs: [
        {
          label: '左对齐',
          value: 'left',
          icon: 'iconzuoduiqi1'
        }, {
          label: '右对齐',
          value: 'right',
          icon: 'iconyouduiqi1'
        }, {
          label: '中间对齐',
          value: 'center',
          icon: 'iconjuzhongduiqi'
        },
      ],
    },
    {
      labelName: '提示信息',
      formType: 'i18nInput',
      key: 'placeholder',
      enKey: 'enPlaceHolder'
    },
    {
      labelName: '校验',
      formType: 'custom-component-config',
      isSetConfigName: true,
      key: 'mix-custom-text-content'
    },
    // {
    //   labelName: '数据配置',
    //   formType: 'columns-values-config',
    //   key: 'defaultTableData'
    // }
  ],
  options: optionsConfig
}
