let optionsConfig = {
  value: '',
  type: 'primary',
  shape: 'round', // 按钮类型
  ghost: false,
  size: 'default', // 按钮大小
  customText:'重新发送',
  customTime:60,
  disabled:false,
  isDisabled:false,
  isShowTime:false,
  // icon: {
  //   fontClass: 'iconfont iconhome',
  //   unicode: 'e699'
  // },
  customtimageIcon: {
    fontClass: 'iconfont iconhome',
    unicode: 'e699'
  },
  iconPreShow:false,
  // iconShow: false,
  text: '确定',
  enText: '',
  backgroundColor: '',
  color: '',
  commonConfig:{
    topPaddingDistance: 5,
    bottomPaddingDistance: 5,
    leftPaddingDistance: 15,
    rightPaddingDistance: 15,
    borderStyle: {},
    shadow: ''
  }
}
export default {
  type: 'van-design-button',
  name: '按钮',
  icon: 'iconanniu1',
  component: {
    template: `
        <a-button
          ref="tree"
          v-model="options.value"
          :style="style"
          :type="options.type"
          :shape="options.shape==='round'?'':options.shape"
          :size="options.size"
          :ghost="options.ghost"
          :disabled="options.disabled"
          @click="onClickEvent"
          v-if="!options.countDown"
        >
          <slot>
            <i :class="options.customtimageIcon.fontClass" style="margin-right: 5px;" v-if="options.iconPreShow" />
          </slot>
          {{ text }}
        </a-button>
        <a-button
          ref="tree"
          v-model="options.value"
          :style="style"
          :type="options.type"
          :shape="options.shape"
          :size="options.size"
          :ghost="options.ghost"
          :disabled="options.isDisabled"
          @click="sendMessage"
          v-else
        >
          <slot>
            <i :class="options.customtimageIcon.fontClass" style="margin-right: 5px;" v-if="options.iconPreShow" />
          </slot>
          <template v-if="!options.isShowTime">
            {{ text }}
          </template>
          <template v-if="options.isShowTime">
            {{ options.customText +'('+ options.customTime +'s' +')'}}
          </template>
        </a-button>
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
        if (this.options.type == 'custom') {
          return {
            backgroundColor: this.options.backgroundColor,
            color: this.options.color
          }
        } else {
          return {}
        }
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
            if (this.options.customTime==0) {
              this.options.isShowTime = false
              clearInterval(clearTimes)
              this.options.customTime = tempTimes
              this.options.isDisabled = false
            }
        }, 1000);
      },
      onClickEvent(){
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
      labelName: '按钮图标',
      formType: 'custom-style-pre',
      noInput: true,
      setData:{
        key: 'customtimageIcon',//前置图标
        iconShow:'iconPreShow' //是否显示前置图标
      }
    },
    {
      labelName: '按钮类型',
      formType: 'custom-button-style',
      key: 'type',
      typeConfigs: [
        {
          label: '主按钮',
          value: 'primary'
        }, {
          label: '次按钮',
          value: ''
        }, {
          label: '虚线按钮',
          value: 'dashed'
        }, {
          label: '危险按钮',
          value: 'danger'
        }, {
          label: '链接按钮',
          value: 'link'
        }, {
          label: '自定义',
          value: 'custom'
        }
      ]
    },/* {
      labelName: '倒计时',
      formType: 'switch',
      key: 'countDown'
    },*/ {
      labelName: '',
      formType: 'customText',
      key: 'customText',
      relyOn: 'countDown', // 依赖
      relyOnCondition: true // 条件
    },{
      labelName: '',
      formType: 'customTime',
      key: 'customTime',
      relyOn: 'countDown', // 依赖
      relyOnCondition: true // 条件
    },{
      labelName: '按钮形状',
      formType: 'radio-button',
      key: 'shape',
      typeConfigs: [
        {
          label: '圆形',
          value: 'circle'
        }, {
          label: '方形',
          value: 'round'
        }, {
          label: '默认',
          value: 'default'
        }
      ]
    }, {
      labelName: '按钮大小',
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
    }/*, {
      labelName: '幽灵按钮',
      formType: 'switch',
      key: 'ghost'
    }*/
  ],
  options: optionsConfig
}
