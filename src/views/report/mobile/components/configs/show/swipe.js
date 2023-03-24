/** 图标 */
let optionsConfig = {
  // 自定义属性
  swipeImgList: [
    {
      value: 'https://localhost:40518/platform/api/images/2MKbwKqLp7QAe7Nf.jpg'
    }
  ],
  commonConfig:{
    topSpaceDistance:0,
    bottomSpaceDistance:0,
    leftSpaceDistance:0,
    rightSpaceDistance:0,
  },
  commonConfigCompWidthUnit: "%",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "auto",
  commonConfigCompHeight:"",
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '',
  },
}
export default {
  type: 'van-design-swipe',
  name: '轮播图',
  icon: 'iconlunbotu1',
  // img: button_img,
  component: {
    template: `
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in options.swipeImgList" :key="index">
          <img :src="item.value" style="width: 100%;" />
        </van-swipe-item>
      </van-swipe>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    methods:{
    }
  },
  configList: [
    // {
    //   labelName: '轮播图片',
    //   formType: 'columns-config',
    //   columnsConfigType: 'img',
    //   addBtnText: '添加图片',
    //   key: 'swipeImgList'
    // }
  ],
  options: optionsConfig
}
