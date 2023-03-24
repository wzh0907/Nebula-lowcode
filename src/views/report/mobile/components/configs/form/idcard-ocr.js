/** 图片 */
let optionsConfig = {
  // 自定义属性
  src: 'https://localhost:40518/platform/api/images/3sqGYRMvg2ybTMI2.png',
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
  ocrName:{
  },
  ocrIdcard:{

  },
  ocrGender:{},
  ocrBirth:{},
  ocrNation:{},
  ocrAddress:{},
  commonConfigCompWidthUnit: "px",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "auto",
  commonConfigCompHeight:"",
}
export default {
  type: 'van-design-idcard-ocr',
  name: '身份证识别',
  icon: 'iconicon_tupian-xian',
  // img: button_img,
  component: {
    template: `
      <van-image style="width:100%" v-if="options.contentDataSource === 'radio-button-bind' && options._isGenerateComponent" :width="options.width" :height="options.height" :src="options._interfaceTableDataItem[options.interfaceDataConfig.bindDataKey]" :radius="options.round ? '' : options.radius" :round="options.round" :fit="options.fit" />
      <van-image v-else-if="options.contentDataSource === 'radio-button-bind'" :width="options.width" :height="options.height" :src="options.interfaceDataConfig.value" :radius="options.round ? '' : options.radius" :round="options.round" :fit="options.fit" />
      <van-image v-else :width="imgWidth" :height="imgHeight" :src="options.src" :radius="options.round ? '' : options.radius" :round="options.round" :fit="options.fit" />
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
    },
    {
      labelName: '姓名',
      formType: 'value-select',
      key: 'ocrName'
    },
    {
      labelName: '身份证',
      formType: 'value-select',
      key: 'ocrIdcard'
    },
    {
      labelName: '性别',
      formType: 'value-select',
      key: 'ocrGender'
    },
    {
      labelName: '出生',
      formType: 'value-select',
      key: 'ocrBirth'
    },
    {
      labelName: '民族',
      formType: 'value-select',
      key: 'ocrNation'
    },
    {
      labelName: '住址',
      formType: 'value-select',
      key: 'ocrAddress'
    }
  ],
  options: optionsConfig
}
