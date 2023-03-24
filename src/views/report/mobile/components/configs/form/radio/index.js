import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-radio',
  name: '单选框',
  icon: 'icondanxuankuangxuanzhong',
  isMixinsCustomConfig: true,
  component: layoutTemplate,
  // dataSourceConfig: {
  //   key: 'contentDataSource',
  //   typeConfigs: [
  //     {
  //       label: '默认值',
  //       value: 'radio-button-default',
  //       formType: 'default',
  //       key: 'value',
  //       addColumnConfig: {
  //         label: '',
  //         value: ''
  //       }
  //     }, {
  //       label: '数据表',
  //       value: 'radio-button-tables',
  //       formType: 'interface-chart-table'
  //     }, {
  //       label: '数据集',
  //       value: 'radio-button-dataset',
  //       formType: 'interface-chart-table'
  //     }, {
  //       label: '后端服务',
  //       value: 'radio-button-interface',
  //       formType: 'interface-chart-table'
  //     }
  //   ],
  // },
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
          icon:'iconzuoduiqi1'
        },  {
          label: '右对齐',
          value: 'right',
          icon:'iconyouduiqi1'
        },{
          label: '顶部对齐',
          value: 'top',
          icon:'iconjuzhongduiqi'
        },
      ],
      setData: {
        width:'labelWidth', //宽度
        labelShow: 'labelShow' //是否显示标签
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
    },
    {
      labelName: '选中颜色',
      formType: 'color-picker',
      key: 'selectedColor'
    },
    {
      labelName: '样式',
      formType: 'radio-button',
      key: 'radioStyleType',
      typeConfigs: [
        {
          label: '方框',
          value: 'square'
        }, {
          label: '按钮',
          value: 'round'
        },
        {
          label: '文本按钮',
          value: 'textRound'
        }
      ]
    },
    // {
    //   labelName: '数据配置',
    //   formType: 'columns-values-config',
    //   key: 'columns'
    // }
  ],
  options: optionsConfig
}
