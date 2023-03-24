import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-calendar',
  name: '日期选择器',
  icon: 'iconriqi',
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
    // {
    //   labelName: '默认值',
    //   formType: 'select',
    //   key: 'defaultValueType',
    //   typeConfigs: [
    //     {
    //       label: '当天',
    //       value: 'Today'
    //     }, {
    //       label: '本周一',
    //       value: 'Monday'
    //     }, {
    //       label: '本周日',
    //       value: 'Sunday'
    //     }, {
    //       label: '本月一号',
    //       value: 'MonthStart'
    //     }, {
    //       label: '本月底',
    //       value: 'MonthEnd'
    //     }
    //   ]
    // },
    {
      labelName: '提示信息',
      formType: 'i18nInput',
      key: 'placeholder',
      enKey: 'enPlaceHolder'
    },
    {
      labelName: '必填项',
      formType: 'switch',
      key: 'required'
    }, {
      labelName: '清除按钮',
      formType: 'switch',
      key: 'clearable'
    }
  ],
  options: optionsConfig
}
