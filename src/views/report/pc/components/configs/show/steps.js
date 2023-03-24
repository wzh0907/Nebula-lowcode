/** 图标 */
let optionsConfig = {
  // 自定义属性
  active: 1,
  direction: 'horizontal',
  size:'default',
  steps: [    
  {value:'登录',description:'用户登录'},
  {value:'验证',description:'验证身份'},
  {value:'付款',description:'支付款项'},
  {value:'完成',description:'完成交易'}]
}
export default {
  type: 'van-design-steps',
  name: '步骤条',
  icon: 'iconbuzhoutiao1',
  // img: button_img,
  component: {
    template: `
      <a-steps :current="options.active" :direction="options.direction" :size="options.size">
        <a-step v-for="(step, index) in options.steps" :key="index" :title="step.value" :description="step.description" />
      </a-steps>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '当前步骤',
      formType: 'input-number',
      key: 'active'
    }, {
      labelName: '步骤',
      formType: 'columns-config',
      columnsConfigType: 'steps-columns-config',
      addBtnText: '添加步骤',
      key: 'steps'
    }, {
      labelName: '显示方向',
      formType: 'radio-button',
      key: 'direction',
      typeConfigs: [
        {
          label: '横向',
          value: 'horizontal'
        }, {
          label: '竖向',
          value: 'vertical'
        }
      ]
    }, {
      labelName: '步骤条大小',
      formType: 'radio-button',
      key: 'size',
      typeConfigs: [
        {
          label: '常规',
          value: 'default'
        }, {
          label: '小',
          value: 'small'
        }
      ]
    }
  ],
  options: optionsConfig
}
