import moment from "moment";

let optionsConfig = {
  value: '',
  defaultValueType: '', //'Today' 'Monday' 'MonthStart'
  dateType: 'date',
  size: 'default',
  format: '',
  disabled: false,
  labelShow: true,
  placeholder: '请选择日期',
  enPlaceHolder: '',
  width: 80,
  label: '标题',
  enLabel: '',
  labelAlign: 'right',
  clearable: true,
  required: false,
  contentDataSource: 'radio-button-default',
  contentDataEcho: '',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '',
  },
  interfaceDataEchoConfig: {
    id: ''
  },
}
export default {
  type: 'van-design-calendar',
  name: '日期选择器',
  icon: 'iconriqi',
  isMixinsCustomConfig: true,
  component: {
    template: `
    <div class="custom_total_form_component">
      <label
        :class="options.required ? 'required' : ''"
        :style="{
          display:options.labelShow?'':'none',
          width:options.labelAlign=='top'?'100%':options.width+ 'px',textAlign:options.labelAlign=='top'?'left':options.labelAlign,
          lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'
        }"
      >
      {{label}}
      </label>
      <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}">
        <div>
          <a-date-picker
            v-if="options.dateType === 'date'"
            :size="options.size"
            :format="options.format"
            :valueFormat="options.format"
            :placeholder="placeholder"
            :disabled="options.disabled"
            :allowClear="options.clearable"
            :defaultValue="ndefaultValue"
            :value="defaultValue"
            @change="onChange"
          />
          <a-range-picker
            v-if="options.dateType === 'range' || options.dateType === 'timeRange'"
            v-model="options.value"
            :size="options.size"
            :format="options.format"
            :disabled="options.disabled"
            :allowClear="options.clearable"
            :defaultValue="defaultValue"
            @change="onChange"
          />
          <a-month-picker
            v-if="options.dateType === 'month'"
            v-model="options.value"
            :placeholder="placeholder"
            :allowClear="options.clearable"
            :defaultValue="defaultValue"
            @change="onChange"
          />
          <a-week-picker
            v-if="options.dateType === 'week'"
            v-model="options.value"
            :placeholder="placeholder"
            :allowClear="options.clearable"
            :defaultValue="defaultValue"
            @change="onChange"
          />
          </div>
      </div>
  </div>
    `,
    data() {
      return {
        moment: moment,
        options: optionsConfig
      }
    },
    computed: {
      placeholder() {
        let language = navigator.language.substr(0, 2)
        if (language == 'zh') {
          return this.options.placeholder || this.options.enPlaceHolder
        } else {
          return this.options.enPlaceHolder || this.options.placeholder
        }
      },
      label() {
        let language = navigator.language.substr(0, 2)
        if (language == 'zh') {
          return this.options.label || this.options.enLabel
        } else {
          return this.options.enLabel || this.options.label
        }
      },
      defaultValue() {
        return this.options.value.length > 0 ? moment(this.options.value, this.options.format) : null
      },
      ndefaultValue: {
        get() {
          if (this.options.interfaceDataConfig.uuid && this.options.interfaceDataConfig.uuid != '') {
            this.options.value=this.options.interfaceDataConfig.value;
            return this.options.interfaceDataConfig.value.length > 0 ? moment(this.options.interfaceDataConfig.value, this.options.format) : null
          }
          return this.options.value.length > 0 ? moment(this.options.value, this.options.format) : null
        },
        set(val) {
        }
      }

      // return this.options.value.length > 0 ? moment(this.options.value, this.options.format) : null
    },
    mounted() {
      let day = new Date()
      //getDate表示几号，getDay表示周几
      let today = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
      let monday = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + (day.getDate() - day.getDay() + 1)
      let monthStart = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + '1'
      if (this.options.defaultValueType == 'Today') {
        this.options.value = today
      } else if (this.options.defaultValueType == 'Monday') {
        this.options.value =  monday
      } else if (this.options.defaultValueType == 'MonthStart') {
        this.options.value = monthStart
      }
    },
    methods: {
      onChange(time, timeString) {
        this.options.value = timeString
        console.log(time, timeString);
      },
    }
  },
  configList: [
    {
      labelName: '标签名称',
      formType: 'i18nInput',
      key: 'label',
      enKey: 'enLabel'
    },
    {
      labelName: '标签显示',
      formType: 'custom-style-label',
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
        },
      ],
      setData: {
        width: 'width', //宽度
        labelShow: 'labelShow' //是否显示标签
      }
    },
    {
      labelName: '提示信息',
      formType: 'i18nInput',
      key: 'placeholder',
      enKey: 'enPlaceHolder'
    },
    {
      labelName: '尺寸',
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
      labelName: '清除按钮',
      formType: 'switch',
      key: 'clearable'
    }, {
      labelName: '校验',
      formType: 'custom-component-config',
      key: 'mix-custom-text-content',
      isSetConfigName: true,
    }, {
      labelName: '其他',
      formType: 'custom-collapse-panel',
      isSetConfigName: true,
      key: 'customOther',
      collapsePanelColumnsConfigs: [
        {
          labelName: '禁用',
          formType: 'switch',
          type: 'disabled',
          key: 'disabled'
        }
      ]
    }
  ],
  options: optionsConfig
}
