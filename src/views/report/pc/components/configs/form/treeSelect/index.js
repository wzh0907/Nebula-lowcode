/** 标签页 */
import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-tree-select',
  name: '树形选择器',
  icon: 'icontree',
  component: layoutTemplate,
  isMixinsCustomConfig: true,
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
      typeConfigs: [{
        label: '左对齐',
        value: 'left',
        icon: 'iconzuoduiqi1'
      }, {
        label: '顶部对齐',
        value: 'top',
        icon: 'iconjuzhongduiqi'
      }, {
        label: '右对齐',
        value: 'right',
        icon: 'iconyouduiqi1'
      }, ],
      setData: {
        width: 'width', //宽度
        labelShow: 'labelShow' //是否显示标签
      }
    },
    {
      labelName: '输入提示',
      formType: 'i18nInput',
      key: 'placeholder',
      enKey: 'enPlaceHolder'
    },
    {
      labelName: '控件大小',
      formType: 'radio-button',
      key: 'size',
      typeConfigs: [{
        label: '大',
        value: 'large'
      }, {
        label: '中',
        value: 'default'
      }, {
        label: '小',
        value: 'small'
      }]
    },
    {
      labelName: '是否多选',
      formType: 'switch',
      key: 'multiple',
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
