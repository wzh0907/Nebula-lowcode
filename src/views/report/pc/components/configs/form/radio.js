let optionsConfig = {
  // 自定义属性
  value: '',
  direction: 'vertical',
  width: 80,
  label:'标题',
  enLabel: '',
  labelAlign: 'right',
  labelShow:true,
  columns: [],
  defaultTableData: [], // 默认值
  disabled: false,
  // columns: [
  //   {
  //     label: '列名',
  //     value: '列值'
  //   }
  // ]

  labelKey: '',
  valueKey: '',
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
  type: 'van-design-radio',
  name: '单选框',
  icon: 'icondanxuankuangxuanzhong',
  isMixinsCustomConfig:true,
  // img: button_img,
  component: {
    template: `
    <div class="custom_total_form_component">
      <label
        :style="{
          display:options.labelShow?'':'none',
          width:options.labelAlign=='top'?'100%':options.width+ 'px',textAlign:options.labelAlign=='top'?'left':options.labelAlign
        }"
      >
      {{label}}
      </label>
      <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}" v-if="options.contentDataSource==='radio-button-default'">
        <a-radio-group v-model="options.value" :icon-size="16" :disabled="options.disabled">
          <a-radio
            :value="item.value"
            style="margin-bottom: 8px;"
            :style="{display: options.direction === 'vertical' ? 'block' : 'inline-block'}"
            v-for="(item, key) in options.defaultTableData"
            :key="key"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </div>
      <div :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}" v-else>
        <a-radio-group v-model="options.value" :icon-size="16" :disabled="options.disabled">
          <a-radio
            :value="item[options.valueKey]"
            style="margin-bottom: 8px;"
            :style="{display: options.direction === 'vertical' ? 'block' : 'inline-block'}"
            v-for="(item, key) in options.interfaceDataConfig.tableData"
            :key="key"
          >
            {{ item[options.labelKey] }}
          </a-radio>
        </a-radio-group>
      </div>
    </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed: {
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
          icon:'iconzuoduiqi1'
        },{
          label: '顶部对齐',
          value: 'top',
          icon:'iconjuzhongduiqi'
        },{
          label: '右对齐',
          value: 'right',
          icon:'iconyouduiqi1'
        },
      ],
      setData:{
        width:'width', //宽度
        labelShow:'labelShow' //是否显示标签
      }
    },
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
