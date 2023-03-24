let optionsConfig = {
  value: undefined,
  width: 80,
  label:'标题',
  enLabel: '',
  labelAlign: 'right',
  labelShow:true,
  size: 'default',
  mode: 'default',
  placeholder: '请选择',
  enPlaceHolder: '',
  labelKey: '',
  valueKey: '',
  required: false,
  disabled: false,
  columns: [],
  defaultTableData: [], // 默认值
  contentDataSource: 'radio-button-default',
  contentDataEcho: '',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    tableData: [{}]
  },
  interfaceDataEchoConfig:{
    versions: '1.0.0',
    id:''
  },
}
export default {
  type: 'van-design-select',
  name: '选择器',
  icon: 'icondanchu',
  isMixinsCustomConfig:true,
  component: {
    template: `
    <div class="custom_total_form_component">
      <label :class="options.required ? 'required' : ''" :style="{width:options.labelAlign=='top'?'100%':options.width+ 'px',
      display:options.labelShow?'':'none',
      textAlign:options.labelAlign=='top'?'left':options.labelAlign,lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'}"
      >
      {{label}}
      </label>
      <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}" v-if="options.contentDataSource==='radio-button-default'">
        <a-select
            v-model="options.value"
            :size="options.size"
            :allow-clear="true"
            :mode="options.mode"
            :placeholder="placeholder"
            style="width: 100%"
            :disabled="options.disabled"
          >
            <a-select-option :value="item.value" v-for="(item, key) in options.defaultTableData" :key="key">
              {{ item.label }}
            </a-select-option>
          </a-select>
      </div>
      <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}" v-else>
        <a-select
            v-model="options.value"
            :size="options.size"
            :allow-clear="true"
            :mode="options.mode"
            :placeholder="placeholder"
            style="width: 100%"
            :disabled="options.disabled"
            @change="changeSelect"
          >
            <a-select-option :value="item[options.valueKey]" v-for="(item, key) in options.interfaceDataConfig.tableData" :key="key">
              {{ item[options.labelKey] }}
            </a-select-option>
          </a-select>
      </div>
    </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    methods:{
      changeSelect(){
        this.$forceUpdate();
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
      }
    }
  },
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '默认值',
        value: 'radio-button-default',
        formType: 'default',
        key: 'value',
        addColumnConfig: {
          label: '',
          value: ''
        }
      }, {
        label: '数据表',
        value: 'radio-button-tables',
        formType: 'interface-chart-table'
      }, {
        label: '数据集',
        value: 'radio-button-dataset',
        formType: 'interface-chart-table'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-chart-table'
      }
    ],
    echoTypeConfigs: [
      {
        label: '回显服务',
        value: 'radio-button-interface-echo',
        formType: 'interface-chart-echo'
      }
    ]
  },
  configList: [
    // {
    //   labelName: '标签索引',
    //   formType: 'input',
    //   key: 'labelKey'
    // },
    // {
    //   labelName: '列值索引',
    //   formType: 'input',
    //   key: 'valueKey'
    // },
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
        width: 'width',
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
      labelName: '模式',
      formType: 'radio-button',
      key: 'mode',
      typeConfigs: [
        {
          label: '默认',
          value: 'default'
        }, {
          label: '多选',
          value: 'multiple'
        }
      ]
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
    },
    {
      labelName: '校验',
      formType: 'custom-component-config',
      key:'mix-custom-text-content',
      isSetConfigName: true,
    }, {
      labelName: '其他',
      formType: 'custom-collapse-panel',
      isSetConfigName:true,
      key:'customOther',
      collapsePanelColumnsConfigs:[
        {
          labelName: '禁用',
          formType: 'switch',
          type:'disabled',
          key: 'disabled'
        }
      ]
    }
  ],
  options: optionsConfig
}
