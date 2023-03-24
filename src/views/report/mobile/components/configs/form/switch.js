/** 图标 */
let optionsConfig = {
  // formInputItemConfig: {}, // 通过form组件注入
  // 自定义属性
  // label: 'test',
  // value: true,
  // required: false,
  value: true,
  size: 20,
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
      <van-field name="switch" :label="options.label" :name="options.databaseField">
        <template #input>
          <van-switch v-model="options.value" :size="options.size" />
        </template>
      </van-field>
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
      formType: 'input-number',
      key: 'size'
    }
  ],
  options: optionsConfig
}
