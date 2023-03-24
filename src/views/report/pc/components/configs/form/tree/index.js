/** 标签页 */
import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-tree',
  name: '树形组件',
  icon: 'icontree',
  component: layoutTemplate,
  isMixinsCustomConfig: true,
  configList: [
    // {
    //   labelName: '控件大小',
    //   formType: 'radio-button',
    //   key: 'size',
    //   typeConfigs: [{
    //     label: '大',
    //     value: 'large'
    //   }, {
    //     label: '中',
    //     value: 'default'
    //   }, {
    //     label: '小',
    //     value: 'small'
    //   }]
    // },
    {
      labelName: '默认展开',
      formType: 'switch',
      key: 'expandAll',
    },
    {
      labelName: '是否多选',
      formType: 'switch',
      key: 'multiple',
    },
    {
      labelName: 'PATH信息',
      formType: 'switch',
      key: 'containPath',
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
