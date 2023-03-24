/** 图标 */
let optionsConfig = {
  // 自定义属性
  value: 0,
  max: 80,
  min: 1,
  step: 1,
  integer: true,
  theme: false,
  selectedColor: '',
  contentDataSource: 'radio-button-default',
  contentDataEcho: '',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '',
  },
  interfaceDataEchoConfig:{
    id:''
  },
}
export default {
  type: 'van-design-stepper',
  name: '步进器',
  icon: 'iconjia',
  // img: button_img,
  component: {
    template: `
      <van-stepper
        v-model="options.value"
        :max="options.max"
        :min="options.min"
        :step="options.step"
        :integer="!options.integer"
        :theme="options.theme ? 'round' : ''"
        :decimal-length="!options.integer ? 0 : 1"
      />
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
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
      formType: 'input',
      key: 'step'
    }, {
      labelName: '小数支持',
      formType: 'switch',
      key: 'integer'
    }, {
      labelName: '圆角风格',
      formType: 'switch',
      key: 'theme'
    },
    {
      labelName: '选中颜色',
      formType: 'color-picker',
      key: 'selectedColor'
    }
  ],
  options: optionsConfig
}
