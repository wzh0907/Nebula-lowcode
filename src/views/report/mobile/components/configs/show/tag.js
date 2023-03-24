/** 标签 */
let optionsConfig = {
  // 自定义属性
  contentDataSource: 'radio-button-default',
  value: '标签',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '标签',
  },
  size: '10',
  color: '#ee0a24',
  textColor: '#fff',
  round: false
}
export default {
  type: 'van-design-tag',
  name: '标签',
  icon: 'iconbiaoqian',
  component: {
    template: `
      <van-tag type="primary" :color="options.color" :round="options.round" :text-color="options.textColor" :style="{fontSize: options.size + 'px'}">
        {{ (options.contentDataSource === 'radio-button-default' ? options.value : options.interfaceDataConfig.value) || '暂无数据' }}
      </van-tag>
    `,
    data() {
      return {
        options: optionsConfig
      }
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
    // {
    //   labelName: '标签名称',
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
    // },
    {
      labelName: '标签尺寸',
      formType: 'input-number',
      key: 'size'
    }, {
      labelName: '标签颜色',
      formType: 'color-picker',
      key: 'color'
    }, {
      labelName: '文本颜色',
      formType: 'color-picker',
      key: 'textColor'
    }, {
      labelName: '是否圆角',
      formType: 'switch',
      key: 'round'
    }
  ],
  options: optionsConfig
}
