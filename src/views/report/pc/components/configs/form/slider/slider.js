import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-slider',
  name: '滑动条',
  icon: 'iconsliders',
  // img: button_img,
  // isMixinsCustomConfig:true,
  component: layoutTemplate,
  configList: [
    {
      labelName: '标签名称',
      formType: 'i18nInput',
      key: 'label',
      enKey: 'enLabel'
    },
    {
      labelName: '标签',
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
      labelName: '最小值',
      formType: 'input-number',
      key: 'min'
    }, {
      labelName: '最大值',
      formType: 'input-number',
      key: 'max'
    }, {
      labelName: '步长',
      formType: 'input-number',
      key: 'step'
    }, {
      labelName: '竖向显示',
      formType: 'switch',
      key: 'vertical'
    }, {
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
        }
      ]
    }
  ],
  options: optionsConfig
}
