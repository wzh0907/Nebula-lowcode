/** 标签页 */
import layoutTemplate from './template.vue'
import optionsConfig from './options-config'
/**
 * TODO:: beforeCreate, beforeDestroy hook报错
 * 待修复，目前解决方法是删除beforeCreate, beforeDestroy方法
 */
// delete layoutTemplate.beforeCreate
// delete layoutTemplate.beforeDestroy

export default {
  type: 'van-design-field',
  name: '输入框',
  icon: 'iconwenbenkuang',
  isMixinsCustomConfig:true,
  component: layoutTemplate,
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '默认值',
        value: 'radio-button-default',
        formType: 'input',
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
          icon:'iconzuoduiqi1'
        },{
          label: '顶部对齐',
          value: 'top',
          icon:'iconjuzhongduiqi'
        },{
          label: '右对齐',
          value: 'right',
          icon:'iconyouduiqi1'
        },
      ],
      setData:{
        width:'width', //宽度
        labelShow:'labelShow' //是否显示标签
      }
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
        }
      ]
    },
    {
      labelName: '前置',
      formType: 'custom-style-pre',
      setData:{
        key: 'customtimageIcon',//前置图标
        iconShow:'iconPreShow' //是否显示前置图标
      }
    },
    {
      labelName: '后置',
      formType: 'custom-style-pos',
      setData:{
        key: 'suffixIcon',//后置图标
        iconShow:'iconPosShow' //是否显示后置图标
      }
    },
    {
      labelName: '最大字数',
      formType: 'input',
      key: 'maxlength'
    },
    {
      labelName: '控件大小',
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
    },
    {
      labelName: '是否密码',
      formType: 'password',
      key: 'isPassword'
    },
    {
      labelName: '校验',
      formType: 'custom-component-config',
      key:'mix-custom-text-content',
      isSetConfigName: true,
    },
    {
      labelName: '其他',
      formType: 'custom-collapse-panel',
      isSetConfigName:true,
      key:'customOther',
      collapsePanelColumnsConfigs:[
        {
          labelName: '禁用',
          formType: 'switch',
          type:'disabled',
          key: 'disabled'
        }, {
          labelName: '清除',
          formType: 'switch',
          type:'clearable',
          key: 'clearable'
        }
      ]
    }
  ],
  options: optionsConfig
}
