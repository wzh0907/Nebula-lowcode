/** 图标 */
let optionsConfig = {
  // 自定义属性
  text: '在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。',
  mode: 'horizontal',
  scrollable: true,
  showIcon: true,
  leftIcon: 'volume-o',
  color: '#ed6a0c',
  background: '#fffbe8',
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '文本',
    // 数据绑定
    bindDataKey: ''
  },
}
export default {
  type: 'van-design-notice-bar',
  name: '通知栏',
  icon: 'icongonggao',
  // img: button_img,
  component: {
    template: `
      <van-notice-bar
        :scrollable="options.scrollable"
        :left-icon="options.showIcon ? options.leftIcon : ''"
        :text="options.text"
        :mode="options.mode"
        :color="options.color"
        :background="options.background"
      />
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '文本内容',
      formType: 'input',
      key: 'text'
    }, {
      labelName: '文本颜色',
      formType: 'color-picker',
      key: 'color'
    }, {
      labelName: '背景颜色',
      formType: 'color-picker',
      key: 'background'
    }, {
      labelName: '是否滚动',
      formType: 'switch',
      key: 'scrollable'
    }, {
      labelName: '展示图标',
      formType: 'switch',
      key: 'showIcon'
    }, {
      labelName: '模式',
      formType: 'radio-button',
      key: 'mode',
      typeConfigs: [
        {
          label: '默认',
          value: 'horizontal'
        }, {
          label: '垂直',
          value: 'vertical'
        }
      ]
    }
  ],
  options: optionsConfig
}
