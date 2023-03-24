// import button_img from '../../../../assets/images/asideImg/buttonImg/button.png'
let optionsConfig = {
  // 自定义属性
  text: '分享',
  src: 'https://localhost:40518/platform/api/images/moc4WE5vmOcO29Ny.png',
  // 事件配置
  // eventType: 'click',
  // operateEventType: 'event-operate-refresh',
  // operateRefresh: [],
  // operateHrefPageId: '',
  // operateHrefPageNative: '',
  // operateDialog: '',
  isDisabled: false,
  block: false,
  trigger: false,
  title: '',  //分享标题
  imageUrl: '', //分享图片
  commonConfigCompWidthUnit: "px",
  commonConfigCompWidth: "50",
  commonConfigCompHeightUnit: "px",
  commonConfigCompHeight:"50",
  // 弹窗
  // 公共属性（组件边距）
  commonConfig:{
    topSpaceDistance:0,
    bottomSpaceDistance:0,
    leftSpaceDistance:0,
    rightSpaceDistance:0,
  }
}
export default {
  type: 'van-design-share',
  name: '分享',
  icon: 'iconshare',
  // img: button_img,
  component: {
    template: `
      <van-image
        :width="imgWidth"
        :height="imgHeight"
        :src="options.src"
        :radius="options.radius"
        :fit="options.fit" />
<!--        <van-button-->
<!--          icon="iconshare"-->
<!--          :type="options.type"-->
<!--          :size="options.size"-->
<!--          :block="options.block"-->
<!--          :disabled="options.isDisabled"-->
<!--        >-->
<!--        {{ options.text }}-->
<!--        </van-button>-->
      `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed:{
      imgWidth(){
        if(this.options.commonConfigCompWidthUnit=='auto'){
          // return this.options.commonConfigCompWidth+this.options.commonConfigCompWidthUnit
          return '100%'
        }
        return this.options.commonConfigCompWidth+this.options.commonConfigCompWidthUnit
      },
      imgHeight(){
        if(this.options.commonConfigCompHeightUnit=='auto'){
          // return this.options.commonConfigCompWidth+this.options.commonConfigCompWidthUnit
          return '100%'
        }
        return this.options.commonConfigCompHeight+this.options.commonConfigCompHeightUnit
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
      labelName: '按钮图片',
      formType: 'img-upload',
      key: 'src'
    },
    {
      //分享信息
      labelName: '分享标题',
      formType: 'input',
      key: 'title',
    },
    {
      //分享信息
      labelName: '分享图片',
      formType: 'img-upload',
      key: 'imageUrl',
    },
  ],
  options: optionsConfig
}


