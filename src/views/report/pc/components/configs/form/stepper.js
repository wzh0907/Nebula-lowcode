/** 步进器 */
let optionsConfig = {
  // 自定义属性
  value: 0,
  max: 80,
  min: 0,
  step: 1,
  integer: true,
  commonConfig:{
    borderStyle: {},
  }
}
export default {
  type: 'van-design-stepper',
  name: '步进器',
  icon: 'iconjia',
  // img: button_img,
  component: {
    template: `
      <a-input-number
        style="box-sizing: border-box"
        :style="width"
        v-model="options.value"
        :max="options.max"
        :min="options.min"
        :step="options.step"
        :precision="!options.integer ? 0 : 1"
      />
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed: {
      width() {
        const margin = this.$data.options.commonConfig.leftSpaceDistance + this.$data.options.commonConfig.rightSpaceDistance + 'px'
        return `width: calc(100% - ${margin})`
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
    },
  ],
  options: optionsConfig
}
