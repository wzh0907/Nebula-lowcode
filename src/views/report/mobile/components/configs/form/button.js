// import button_img from '../../../../assets/images/asideImg/buttonImg/button.png'
let optionsConfig = {
  // 自定义属性
  text: '按钮文本',
  enText: '',
  iconShow: false,
  iconPosition: 'left',
  icon: {
    fontClass: 'iconfont ant-search',
    name: 'search',
    unicode: 'e9a1'
  },
  type: 'primary',
  // 事件配置
  // eventType: 'click',
  // operateEventType: 'event-operate-refresh',
  // operateRefresh: [],
  // operateHrefPageId: '',
  // operateHrefPageNative: '',
  // operateDialog: '',
  shape: 'square',
  size: 'small',
  customText: '重新发送',
  customTime: 60,
  isDisabled: false,
  isShowTime: false,
  block: false,
  trigger: false,
  countDown: false,
  // 颜色
  backgroundColor: '#1890ff',
  fontColor: '#FFF',
  activeColor: '#126CBF',
  activeFontColor: '#FFF',
  // 弹窗
  // dialogConfigTitle: 'title-test',
  // dialogConfigMessage: '弹窗内容',
  // 公共属性（组件边距）
  commonConfig: {
    topPaddingDistance: 4,
    bottomPaddingDistance: 4,
    leftPaddingDistance: 15,
    rightPaddingDistance: 15,
  },
  styleEditorConfig: {
    textHtmlSize: 14,
  }
}
export default {
  type: 'van-design-button',
  name: '按钮',
  icon: 'iconanniu1',
  // img: button_img,
  component: {
    template: `
        <van-button
          :color="options.backgroundColor"
          :plain="options.shape === 'plain'"
          :round="options.shape === 'round'"
          :type="options.type"
          :size="options.size"
          :block="options.block"
          @click="onClickEvent"
          v-if="!options.countDown"
        >
        <div style="display: flex; align-items: center" :style="style">
          <i v-if="options.iconShow" :class="options.icon.fontClass" :style="{fontSize: options.size + 'px', color: options.fontColor}"></i>
          <span :style="{color: options.fontColor,fontSize: options.styleEditorConfig.textHtmlSize + 'px'}">{{ text }}</span>
        </div>
        </van-button>
        <van-button
          :icon="options.iconShow ? options.icon : ''"
          :plain="options.shape === 'plain'"
          :round="options.shape === 'round'"
          :type="options.type"
          :size="options.size"
          :block="options.block"
          :disabled="options.isDisabled"
          @click="sendMessage"
          v-else
        >
          <template v-if="!options.isShowTime">
            {{ text }}
          </template>
          <template v-if="options.isShowTime">
            {{ options.customText +'('+ options.customTime +'s' +')'}}
          </template>
        </van-button>
      `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed: {
      text() {
        let language = navigator.language.substr(0, 2)
        if (language == 'zh') {
          return this.options.text || this.options.enText
        } else {
          return this.options.enText || this.options.text
        }
      },
      style() {
        let fontSize = `font-size: ${this.options.styleEditorConfig.textHtmlSize*2}rpx;`
        switch (this.options.iconPosition) {
          case 'left':
            return fontSize +'flex-direction: row'
          case 'right':
            return fontSize +'flex-direction: row-reverse'
          case 'top':
            return fontSize +'flex-direction: column'
          case 'bottom':
            return fontSize +'flex-direction: column-reverse'
        }
        return ''
      }
    },
    methods: {
      // 倒计时功能
      sendMessage() {
        let tempTimes = this.options.customTime
        let clearTimes = setInterval(() => {
          this.options.isShowTime = true
          this.options.isDisabled = true
          this.options.customTime--
          if (this.options.customTime == 0) {
            this.options.isShowTime = false
            clearInterval(clearTimes)
            this.options.customTime = tempTimes
            this.options.isDisabled = false
          }
        }, 1000);
      },
      onClickEvent() {
        let operateEvent = new CustomEvent(`${this.options.commonConfigAssignSign}-on-click-button`)
        window.dispatchEvent(operateEvent)
      }
    }
  },
  configList: [
    {
      labelName: '按钮名称',
      formType: 'i18nInput',
      key: 'text',
      enKey: 'enText'
    },
    {
      // labelName: '按钮样式',
      isSetConfigName: true,
      formType: 'custom-component-config',
      subFormType: 'button-pattern-config'
    },
    {
      labelName: '按钮颜色',
      formType: 'custom-component-config',
      subFormType: 'button-color-config'
    },
    // {
    //   labelName: '按钮颜色',
    //   formType: 'custom-component-config',
    //   key: 'backgroundColor'
    // },
    // {
    //   labelName: '文字颜色',
    //   formType: 'color-picker',
    //   key: 'fontColor'
    // },
    {
      labelName: '按钮形状',
      formType: 'radio-button',
      key: 'shape',
      typeConfigs: [
        {
          label: '圆形',
          value: 'round'
        }, {
          label: '方形',
          value: 'square'
        }
      ]
    },
    {
      labelName: '字体大小',
      formType: 'styleEditorConfig',
      key: 'textHtmlSize'
    }, {
      labelName: '按钮大小',
      formType: 'radio-button',
      key: 'size',
      typeConfigs: [
        {
          label: '大',
          value: 'large',
          commonConfig: {
            topPaddingDistance: 15,
            bottomPaddingDistance: 15
          },
          styleEditorConfig: {
            textHtmlSize: 18
          }
        }, {
          label: '中',
          value: 'normal',
          commonConfig: {
            topPaddingDistance: 10,
            bottomPaddingDistance: 10
          },
          styleEditorConfig: {
            textHtmlSize: 16
          }
        }, {
          label: '小',
          value: 'small',
          commonConfig: {
            topPaddingDistance: 7,
            bottomPaddingDistance: 7
          },
          styleEditorConfig: {
            textHtmlSize: 14
          }
        }
      ]
    },
    {
      labelName: '按钮图标',
      formType: 'custom-component-config',
      subFormType: 'button-icon-config'
    },
    {
      labelName: '图标位置',
      formType: 'radio-button',
      key: 'iconPosition',
      typeConfigs: [
        {
          label: '左',
          value: 'left'
        },{
          label: '右',
          value: 'right'
        },
        {
          label: '上',
          value: 'top'
        }, {
          label: '下',
          value: 'bottom'
        },
      ]
    },
    // {
    //   labelName: '显示图标',
    //   formType: 'switch',
    //   key: 'iconShow'
    // }, {
    //   labelName: '按钮图标',
    //   formType: 'icon-upload',
    //   isShowLineEntityIcon: true,
    //   key: 'icon'
    // },
    // {
    //   labelName: '倒计时',
    //   formType: 'switch',
    //   key: 'countDown'
    // },
    {
      labelName: '',
      formType: 'customText',
      key: 'customText',
      relyOn: 'countDown', // 依赖
      relyOnCondition: true // 条件
    },
    {
      labelName: '',
      formType: 'customTime',
      key: 'customTime',
      relyOn: 'countDown', // 依赖
      relyOnCondition: true // 条件
    }, {
      labelName: '自适应',
      formType: 'switch',
      key: 'block'
    }
  ],
  options: optionsConfig
}


