/** 分割线 */
let optionsConfig = {
  // 自定义属性
  type: 'horizontal', // vertical
  title: '文本',
  orientation: 'center',
  borderConfig: {
    color: '',
    size: 1,
    style: ''
  },
}
export default {
  type: 'van-design-divider',
  name: '分割线',
  icon: 'iconicon_fengexian',
  // img: button_img,
  component: {
    template: `
      <a-divider
        :type="options.type"
        :orientation="options.orientation"
        :style="{ borderColor: options.borderConfig.color, borderStyle: options.borderConfig.style }"
        v-if="options.title"
      >
        {{ options.title }}
      </a-divider>
      <a-divider
        :type="options.type"
        :orientation="options.orientation"
        :style="{ backgroundColor: '#fff', borderColor: 'options.borderConfig.color', borderStyle: options.borderConfig.style }"
        v-else
      ></a-divider>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '标题',
      formType: 'input',
      key: 'title'
    }, {
      labelName: '文案位置',
      formType: 'radio-button',
      key: 'orientation',
      typeConfigs: [
        {
          label: '左侧',
          value: 'left',
          icon:'iconzuoduiqi1'
        }, {
          label: '居中',
          value: 'center',
          icon:'iconjuzhongduiqi'
        }, {
          label: '右侧',
          value: 'right',
          icon:'iconyouduiqi1'
        }
      ]
    }, {
      labelName: '样式',
      formType: 'border-config',
      key: 'borderConfig'
    }
  ],
  options: optionsConfig
}
