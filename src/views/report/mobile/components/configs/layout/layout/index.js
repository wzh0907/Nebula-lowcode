import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-layout',
  name: '布局容器',
  icon: 'iconzhage',
  component: layoutTemplate,
  isMixinsCustomConfig: true,
  configList: [
    {
      labelName: '栅格高度',//布局
      formType: 'input-number',
      key: 'layoutHeight'
    },
    {
      labelName: '布局',
      formType: 'custom-component-config',
      subFormType: 'grid-layout-config'
    }, {
      labelName: '列配置项',
      formType: 'columns-config',
      key: 'columns'
    },
    {
      labelName: '水平对齐',
      formType: 'radio-button',
      key: 'labelAlign',
      typeConfigs: [
        {
          label: '左对齐',
          value: 'left',
          icon: 'iconzuoduiqi1'
        },
        {
          label: '居中对齐',
          value: 'center',
          icon: 'iconjuzhongduiqi'
        },
        {
          label: '右对齐',
          value: 'right',
          icon: 'iconyouduiqi1'
        },
      ],
    },
    {
      labelName: '垂直对齐',
      formType: 'radio-button',
      key: 'labelVerticalAlign',
      typeConfigs: [
        {
          label: '上对齐',
          value: 'flex-start',
          icon: 'icondingbuduiqi'
        },
        {
          label: '居中对齐',
          value: 'center',
          icon: 'iconchuizhijuzhong'
        },
        {
          label: '下对齐',
          value: 'flex-end',
          icon: 'icondibuduiqi'
        },
      ],
    },
    // {
    //   labelName: '边距',
    //   formType: 'radio-button',
    //   key: 'layoutMargin',
    //   typeConfigs: [
    //     {
    //       label: '无',
    //       value: '0',
    //     },
    //     {
    //       label: '小',
    //       value: '4',
    //     },
    //     {
    //       label: '中',
    //       value: '12',
    //     },
    //     {
    //       label: '大',
    //       value: '16',
    //     },
    //   ],
    // },
    // {
    //   labelName: '圆角',
    //   formType: 'radio-button',
    //   key: 'layoutBorder',
    //   typeConfigs: [
    //     {
    //       label: '无',
    //       value: '0',
    //     },
    //     {
    //       label: '小',
    //       value: '4',
    //     },
    //     {
    //       label: '中',
    //       value: '8',
    //     },
    //     {
    //       label: '大',
    //       value: '10',
    //     },
    //   ],
    // },
    {
      labelName: '固定底部',
      formType: 'switch',
      key: 'fixBottom'
    },
    // {
    //   labelName: '对齐方式',
    //   formType: 'select',
    //   key: 'commonConfig',
    //   childKey: 'textAlign',
    //   typeConfigs: [
    //     { label: '左对齐', value: 'left' },
    //     { label: '居中对齐', value: 'center' },
    //     { label: '右对齐', value: 'right' },
    //   ]
    // },
    // {
    //   labelName: '背景图片',
    //   formType: 'img-upload',
    //   key: 'backgroundImage'
    // },
    // {
    //   labelName: '背景色',
    //   formType: 'color-picker',
    //   key: 'backgroundColor'
    // },
    {
      labelName: ' ',
      formType: 'custom-component-config',
      subFormType: 'bg-image-config',
      isSetConfigName: true
    }
  ],
  options: optionsConfig
}
