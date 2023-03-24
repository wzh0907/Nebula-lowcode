/** 图标 */
const optionsConfig = {
  value: '',
  type: 'text',
  placeholder: '请输入',
  maxlength: 20,
  width: 100,
  clearable: false,
  labelAlign: 'right',
  size: 'default',
  suffixIcon: '',
  customtimageIcon: '',
  disabled: false
}
export default {
  type: 'van-design-form-field',
  name: '输入框',
  icon: 'icondanhangshurukuang',
  isMixinsCustomConfig: true,
  // img: button_img,
  component: {
    template: `
    <div class="custom_total_form_component">
        <label :style="{width:options.labelAlign=='top'?'':options.width+ 'px',textAlign:options.labelAlign=='top'?'left':options.labelAlign}"
        >
        {{options.label}}
        </label>
        <div :style="{marginLeft:options.labelAlign=='top'?'':options.width+ 'px'}">
          <a-input
            v-model="options.value"
            :placeholder="options.placeholder"
            :size="options.size"
            :disabled="options.disabled"
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
      </div>
    </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    // {
    //   labelName: '前置标签',
    //   formType: 'input',
    //   key: 'addonBefore'
    // }, {
    //   labelName: '后置标签',
    //   formType: 'input',
    //   key: 'addonAfter'
    // },
     {
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
      labelName: '标签对齐',
      formType: 'radio-button',
      key: 'labelAlign',
      typeConfigs: [
        {
          label: '左对齐',
          value: 'left',
          icon: 'iconzuoduiqi1'
        }, {
          label: '右对齐',
          value: 'right',
          icon: 'iconyouduiqi1'
        }, {
          label: '顶部对齐',
          value: 'top',
          icon: 'iconjuzhongduiqi'
        }
      ]
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
