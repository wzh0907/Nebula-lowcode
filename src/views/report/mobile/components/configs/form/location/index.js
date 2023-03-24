import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-location',
  name: '定位',
  icon: 'iconlocation',
  component: layoutTemplate,
  configList: [
    {
      labelName: '取值方式',
      formType: 'radio-button',
      key: 'valueType',
      typeConfigs: [
        {
          label: '地址名称',
          value: 'address'
        },
        {
          label: '经度纬度',
          value: 'coordinate'
        }
      ],
    },
    {
      labelName: '地址格式',
      formType: 'select',
      key: 'valueFormat',
      typeConfigs: [
        {
          label: '默认',
          value: 'default'
        },
        {
          label: '省',
          value: 'province'
        },
        {
          label: '省市',
          value: 'city'
        },
        {
          label: '省市区',
          value: 'district'
        },
        {
          label: '省市区街道',
          value: 'street'
        },
        {
          label: '市区',
          value: 'city-district'
        },
      ],
    },
    {
      labelName: '样式',
      isSetConfigName:true, // 不启用labelWidth
      formType: 'custom-text-content',
      key: 'locationEditorConfig'
    }
  ],
  options: optionsConfig
}
