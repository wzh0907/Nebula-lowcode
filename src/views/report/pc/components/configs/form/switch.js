/** 图标 */
let optionsConfig = {
  // formInputItemConfig: {}, // 通过form组件注入
  // 自定义属性
  // label: 'test',
  // value: true,
  // required: false,
  value: true,
  size: 'default',
  contentDataSource: 'radio-button-default',
  // interfaceDataConfig: {
  //   versions: '1.0.0',
  //   id: '',
  //   key: '',
  //   value: '',
  // },
}
export default {
  type: 'van-design-switch',
  name: '开关',
  icon: 'iconkaiguan',
  // img: button_img,
  component: {
    template: `
      <div>
        <a-switch v-model="options.value" :size="options.size" />
      </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '默认值',
      formType: 'switch',
      key: 'value'
    }, {
      labelName: '大小',
      formType: 'radio-button',
      key: 'size',
      typeConfigs: [
        {
          label: '默认',
          value: 'default'
        }, {
          label: '小尺寸',
          value: 'small'
        }
      ]
    }
  ],
  options: optionsConfig
}
