/** 图标 */
const optionsConfig = {
  // 自定义属性
  value: '',
  direction: 'vertical',
  radioColumns: [
    {
      label: '列名',
      value: '列值'
    }
  ]
}
export default {
  type: 'van-design-form-radio',
  name: '单选框',
  icon: 'icondanxuankuangxuanzhong',
  // img: button_img,
  component: {
    template: `
      <a-form-item :label="options.label">
        <a-radio-group v-model="options.value" :direction="options.direction" :icon-size="16">
          <a-radio
            :value="item.value"
            style="margin-bottom: 8px;"
            :style="{display: options.direction === 'vertical' ? 'block' : 'inline-block'}"
            v-for="(item, key) in options.radioColumns" :key="key"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '布局方式',
      formType: 'radio-button',
      key: 'direction',
      typeConfigs: [
        {
          label: '竖向',
          value: 'vertical'
        }, {
          label: '横向',
          value: 'horizontal'
        }
      ]
    }, {
      labelName: '数据配置',
      isSetConfigName: true, // 不启用labelWidth
      formType: 'columns-values-config',
      key: 'radioColumns'
    }
  ],
  options: optionsConfig
}
