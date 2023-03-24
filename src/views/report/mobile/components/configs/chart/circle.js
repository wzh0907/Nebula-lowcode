/** 图标 */
let optionsConfig = {
  // 自定义属性
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: 0,
  },
  modelValue: 10,
  isShowRateText: true,
  rate: 80,
  value: 0,
  text: '文本文字',
  size: 100
}
export default {
  type: 'van-design-circle',
  name: '环形进度条',
  isAsideMenuHide: false,
  icon: 'iconhuanxingtu-hollow',
  // img: button_img,
  component: {
    template: `
      <van-circle v-model="options.modelValue" v-if="options.interfaceDataConfig && options.interfaceDataConfig.value" :rate="(options.interfaceDataConfig && options.interfaceDataConfig.value) || 0" :speed="100" :size="options.size">
        <slot name="default">
          <div class="van-circle__text">
            <span style="font-size: 16px; font-weight: bold;" v-show="options.isShowRateText">{{ (options.interfaceDataConfig && options.interfaceDataConfig.value) || 0 }} %</span>
            <br v-show="options.isShowRateText" />
            <span>{{ options.text }}</span>
          </div>
          
        </slot>
      </van-circle>
      <van-circle v-else v-model="options.modelValue"  :rate="(options.value) || 0" :speed="100" :size="options.size">
        <slot name="default">
          <div class="van-circle__text">
            <span style="font-size: 16px; font-weight: bold;" v-show="options.isShowRateText">{{ options.value || 0 }} %</span>
            <br v-show="options.isShowRateText" />
            <span>{{ options.text }}</span>
          </div>
        </slot>
      </van-circle>
     
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
        key: 'modelValue'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-text-title'
      }
    ]
  },
  configList: [
    // {
    //   labelName: '当前进度',
    //   formType: 'input-number',
    //   key: 'rate'
    // },
    // {
    //   labelName: '当前进度',
    //   formType: 'data-source-api-config',
    //   key: 'contentDataSource',
    //   typeConfigs: [
    //     {
    //       label: '默认值',
    //       value: 'radio-button-default',
    //       formType: 'input',
    //       key: 'modelValue'
    //     }, {
    //       label: '后端服务',
    //       value: 'radio-button-interface',
    //       formType: 'interface-text-title'
    //     }
    //   ]
    // },
    // {
    //   labelName: '当前进度',
    //   formType: 'radio-button',
    //   key: 'value',
    //   typeConfigs: [
    //     {
    //       label: '静态数据',
    //       value: 50
    //     }, {
    //       label: '后端数据',
    //       value: 30
    //     }
    //   ]
    // },
    {
      labelName: '初始值',
      formType: 'input-number',
      key: 'value'
    }, {
      labelName: '文字',
      formType: 'input',
      key: 'text'
    }, {
      labelName: '进度值显示',
      formType: 'switch',
      key: 'isShowRateText'
    }, {
      labelName: '圆环直径',
      formType: 'input-number',
      key: 'size'
    }
  ],
  options: optionsConfig
}
