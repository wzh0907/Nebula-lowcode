/** 图标 */
const optionsConfig = {
  // 自定义属性
  value: '',
  type: 'text',
  placeholder: '请输入',
  maxlength: 20,
  clearable: false,

  size: 'default',
  suffixIcon: '',
  customtimageIcon: '',
  addonAfter: '',
  addonBefore: '',
  disabled: false
}
export default {
  type: 'van-design-field',
  name: '输入框',
  icon: 'icondanhangshurukuang',
  // img: button_img,
  component: {
    template: `
      <a-input
        v-model="options.value"
        :placeholder="options.placeholder"
        :size="options.size"
        :disabled="options.disabled"
        :addon-after="options.addonAfter"
        :addon-before="options.addonBefore"
        :max-length="options.maxLength"
        :allowClear="options.clearable"
      >
        <span v-if="options.customtimageIcon" slot="prefix">
          <i :class="options.customtimageIcon" />
        </span>
        <span v-if="options.suffixIcon" slot="suffix">
          <i :class="options.suffixIcon" />
        </span>
      </a-input>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '前置标签',
      formType: 'input',
      key: 'addonBefore'
    }, {
      labelName: '后置标签',
      formType: 'input',
      key: 'addonAfter'
    }, {
      labelName: '输入提示',
      formType: 'input',
      key: 'placeholder'
    }, {
      labelName: '最大字数',
      formType: 'input',
      key: 'maxlength'
    }, {
      labelName: '默认值',
      formType: 'input',
      key: 'value'
    }, {
      labelName: '控件大小',
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
    }, {
      labelName: '是否禁用',
      formType: 'switch',
      key: 'disabled'
    }, {
      labelName: '清除按钮',
      formType: 'switch',
      key: 'clearable'
    }
  ],
  options: optionsConfig
}
