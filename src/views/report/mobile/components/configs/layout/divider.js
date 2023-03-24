let optionsConfig = {
  title: '文本',
  contentPosition: 'center',
  borderConfig: {
    color: '#ebedf0',
    size: 1,
    style: 'solid'
  },
}
export default {
  type: 'van-design-divider',
  name: '分割线',
  icon: 'iconfengexian',
  component: {
    template: `
      <van-divider
        :content-position="options.contentPosition"
        :style="{ borderColor: options.borderConfig.color, borderStyle: options.borderConfig.style }"
        v-if="options.title"
      >
        <span style="transform: scaleY(1)">{{ options.title }}</span>
      </van-divider>
      <van-divider
        :content-position="options.contentPosition"
        :style="{ borderColor: options.borderConfig.color, borderStyle: options.borderConfig.style }"
        v-else
      ></van-divider>
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
      key: 'contentPosition',
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
