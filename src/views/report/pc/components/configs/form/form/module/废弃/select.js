/** 图标 */
let optionsConfig = {
  value: '',
  width: 100,
  disabled: false,
  size: 'default',
  mode: 'default',
  placeholder: '',
  columns: [
    {
      label: '列名',
      value: '列值'
    }
  ]
}
export default {
  type: 'van-design-form-select',
  name: '选择器',
  icon: 'iconkaiguan',
  // img: button_img,
  component: {
    template: `
      <a-form-item :label="options.label">
        <a-select
          v-model="options.value"
          :size="options.size"
          :allow-clear="true"
          :mode="options.mode"
          :placeholder="options.placeholder"
          :style="{width: options.width + 'px'}"
        >
          <a-select-option :value="item.value" v-for="(item, key) in options.columns" :key="key">
            {{item.label}}
          </a-select-option>
        </a-select>
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
      labelName: '提示信息',
      formType: 'input',
      key: 'placeholder'
    }, {
      labelName: '宽度',
      formType: 'input-number',
      key: 'width'
    }, {
      labelName: '数据配置',
      formType: 'columns-values-config',
      key: 'columns'
    }, {
      labelName: '大小',
      formType: 'radio-button',
      key: 'size',
      typeConfigs: [
        {
          label: '大',
          value: 'large'
        }, {
          label: '中',
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
