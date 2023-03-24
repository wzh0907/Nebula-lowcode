import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-calendar-range',
  name: '日期范围',
  icon: 'iconriqi',
  isMixinsCustomConfig: true,
  component: layoutTemplate,
  // dataSourceConfig: {
  //   key: 'contentDataSource',
  //   typeConfigs: [
  //     {
  //       label: '默认值',
  //       value: 'radio-button-default',
  //       key: 'value'
  //     }, {
  //       label: '后端服务',
  //       value: 'radio-button-interface',
  //       formType: 'interface-text-title'
  //     }
  //   ]
  // },
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
        width: 'width', //宽度
        labelShow: 'labelShow' //是否显示标签
      }
    },
    {
      labelName: '类型',
      formType: 'select',
      key: 'rangeType',
      typeConfigs: [
        {
          label: '日',
          value: 'day'
        }, {
          label: '周',
          value: 'week'
        }, {
          label: '月',
          value: 'month'
        }, {
          label: '季',
          value: 'Q'
        }, {
          label: '年',
          value: 'year'
        }
      ]
    }, {
      labelName: '选择范围',
      formType: 'input',
      key: 'selectRange'
    }, {
      labelName: '禁选日期',
      formType: 'radio-button',
      key: 'forbidRange',
      typeConfigs: [
        {
          label: '无',
          value: ''
        }, {
          label: '过去',
          value: 'before'
        }, {
          label: '以后',
          value: 'after'
        }
      ]
    },
    {
      labelName: '提示信息',
      formType: 'i18nInput',
      key: 'placeholder',
      enKey: 'enPlaceHolder'
    },
    {
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
    }, {
      labelName: '校验',
      formType: 'custom-component-config',
      key: 'mix-custom-text-content',
      isSetConfigName: true,
    }, {
      labelName: '其他',
      formType: 'custom-collapse-panel',
      isSetConfigName: true,
      key: 'customOther',
      collapsePanelColumnsConfigs: [
        {
          labelName: '禁用',
          formType: 'switch',
          type: 'disabled',
          key: 'disabled'
        }
      ]
    }
  ],
  options: optionsConfig
}
