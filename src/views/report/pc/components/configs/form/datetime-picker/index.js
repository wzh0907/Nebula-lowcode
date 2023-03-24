import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-datetime-picker',
  name: '时间选择器',
  icon: 'iconshijianxuanzeqi',
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
      labelName: '标签名称',
      formType: 'i18nInput',
      key: 'label',
      enKey: 'enLabel'
    },
    {
      labelName: '提示信息',
      formType: 'i18nInput',
      key: 'placeholder',
      enKey: 'enPlaceHolder'
    },
    {
      labelName: '时间格式',
      formType: 'select',
      key: 'format',
      typeConfigs: [
        {
          label: 'HH:mm:ss',
          value: 'HH:mm:ss'
        }, {
          label: 'HH:mm',
          value: 'HH:mm'
        }, {
          label: 'HH',
          value: 'HH'
        }
      ]
    }, {
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
        width:'width', //宽度
        labelShow: 'labelShow' //是否显示标签
      }
    },{
      labelName: '尺寸',
      formType: 'radio-button',
      key: 'size',
      typeConfigs: [
        {
          label: '大',
          value: 'large'
        }, {
          label: '中',
          value: 'default'
        }, {
          label: '小',
          value: 'small'
        }
      ]
    }, {
      labelName: '清除按钮',
      formType: 'switch',
      key: 'clearable'
    }
  ],
  options: optionsConfig
}
