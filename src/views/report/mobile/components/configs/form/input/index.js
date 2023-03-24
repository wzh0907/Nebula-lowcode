import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-field',
  name: '输入框',
  icon: 'iconwenbenkuang',
  isMixinsCustomConfig: true,
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
    {
      labelName: '默认值',
      formType: 'input',
      key: 'value'
    },
    {
      labelName: '输入提示',
      formType: 'i18nInput',
      key: 'placeholder',
      enKey: 'enPlaceHolder'
    },
    {
      labelName: '类型',
      formType: 'select',
      key: 'inputType',
      typeConfigs: [
        {
          label: '单行文本',
          value: 'text'
        }, {
          label: '多行文本',
          value: 'textarea'
        }, {
          label: '密码',
          value: 'password'
        }, {
          label: '数字',
          value: 'number'
        }
      ]
    }, {
      labelName: '最大字数',
      formType: 'input',
      key: 'maxlength'
    },
    {
      labelName: '扫码',
      formType: 'switch',
      key: 'qrscan'
    },
    {
      labelName: '搜索',
      formType: 'switch',
      key: 'searchData'
    },
    {
      labelName: '组件列表',
      formType: 'searchDataList',
      isSelectMultiple: true,
      key: 'searchDataList',
      relyOn: 'searchData', // 依赖
      relyOnCondition: true // 条件
    }, {
      labelName: '校验',
      formType: 'custom-component-config',
      isSetConfigName: true,
      key: 'mix-custom-text-content'
    }, {
      labelName: '其他',
      formType: 'custom-collapse-panel',
      isSetConfigName: true,
      key: 'customOther',
      collapsePanelColumnsConfigs: [
        {
          labelName: '清除',
          formType: 'switch',
          type: 'clearable',
          key: 'clearable'
        }
        // {
        //   labelName: '',
        //   formType: 'switch',
        //   type:'',
        //   key: ''
        // }
      ]
    }
  ],
  options: optionsConfig
}
