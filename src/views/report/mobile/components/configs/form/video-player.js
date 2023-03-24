/** 视频播放器 */
let optionsConfig = {
  // 自定义属性
  src: '',
  radius: '0',
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: '文本',
    // 数据绑定
    bindDataKey: ''
  },
  commonConfig: {
    topSpaceDistance: 0,
    bottomSpaceDistance: 0,
    leftSpaceDistance: 0,
    rightSpaceDistance: 0,
  },
  commonConfigCompWidthUnit: "px",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "auto",
  commonConfigCompHeight: "",
}
export default {
  type: 'van-design-video-player',
  name: '视频播放器',
  icon: 'iconicon_tupian-xian',
  component: {
    template: `
      <video :src="videoSrc" style="width: 100%; height: 100%"></video>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed: {
      videoSrc() {
        if (this.options.contentDataSource  === 'radio-button-interface') {
          return this.options.interfaceDataConfig.value
        } else if (this.options.contentDataSource  === 'radio-button-bind') {
          return this.options._interfaceTableDataItem[this.options.interfaceDataConfig.bindDataKey]
        } else {
          return this.options.src
        }
      }
    }
  },
  configList: [],
  options: optionsConfig
}
