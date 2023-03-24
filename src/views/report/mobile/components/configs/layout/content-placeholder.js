let optionsConfig = {
  // 自定义属性
  value: '',
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    id: '',
    key: '',
    value: ''
  },
  name: '',
  width: 0,
  height: 100
}
import placeholderImg from '@/assets/images/asideImg/flexImg/place_holder.png'
export default {
  type: 'van-design-placeholder',
  name: '占位符',
  isAsideMenuHide: true,
  icon: 'iconzhanweifu',
  component: {
    template: `
      <div :style="{width: '100%', height: options.height + 'px'}">
        <img src="${placeholderImg}" alt="" style="width: 100%; height: 100%;">
      </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    methods: {
     
    }
  },
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
      labelName: '名称',
      formType: 'input',
      key: 'name'
    },
    {
      labelName: '高度',
      formType: 'input-number',
      key: 'height'
    },
    // {
    //   labelName: '数据配置',
    //   isSetConfigName:true, // 不启用labelWidth
    //   formType: 'data-source-api-config',
    //   key: 'contentDataSource',
    //   typeConfigs: [
    //     {
    //       label: '默认值',
    //       value: 'radio-button-default',
    //       formType: 'input',
    //       key: 'value'
    //     }, {
    //       label: '后端服务',
    //       value: 'radio-button-interface',
    //       formType: 'interface-text-title'
    //     }
    //   ]
    // }
  ],
  options: optionsConfig
}
