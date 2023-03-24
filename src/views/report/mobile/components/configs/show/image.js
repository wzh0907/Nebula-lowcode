/** 图片 */
let optionsConfig = {
  // 自定义属性
  src: require('@/assets/pic.png'),
  fit: 'fill',
  radius: '0',
  round: false,
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '文本',
    // 数据绑定
    bindDataKey: ''
  },
  commonConfig:{
    topSpaceDistance:0,
    bottomSpaceDistance:0,
    leftSpaceDistance:0,
    rightSpaceDistance:0,
  },
  commonConfigCompWidthUnit: "px",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "auto",
  commonConfigCompHeight:"",
}
export default {
  type: 'van-design-image',
  name: '图片',
  icon: 'iconicon_tupian-xian',
  // img: button_img,
  component: {
    template: `
      <van-image :width="imgWidth" :height="imgHeight" :src="imageUrl" :radius="options.round ? '' : options.radius" :round="options.round" :fit="options.fit" />
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed:{
      imageUrl() {
        if (this.options.contentDataSource  === 'radio-button-interface') {
          return this.options.interfaceDataConfig.value
        } else if (this.options.contentDataSource  === 'radio-button-bind') {
          return this.options._interfaceTableDataItem[this.options.interfaceDataConfig.bindDataKey]
        } else {
          return this.options.src
        }
      },
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
    }
  },
  configList: [
    {
      labelName: '图片',
      formType: 'img-upload',
      key: 'src'
    }, {
      labelName: '填充模式',
      formType: 'select',
      key: 'fit',
      typeConfigs: [
        {
          label: 'contain',
          value: 'contain'
        }, {
          label: 'cover',
          value: 'cover'
        }, {
          label: 'fill',
          value: 'fill'
        }, {
          label: 'none',
          value: 'none'
        }, {
          label: 'scale-down',
          value: 'scale-down'
        }
      ]
    }, {
      labelName: '圆角',
      formType: 'input-number',
      key: 'radius'
    }, {
      labelName: '圆形显示',
      formType: 'switch',
      key: 'round'
    }
  ],
  options: optionsConfig
}
