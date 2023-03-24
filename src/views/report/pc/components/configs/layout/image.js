/** 图片 */
let optionsConfig = {
  src: require('@/assets/pic.png'),
  columns: [],
  width: '100',
  widthPercent:false,
  height: '100',
  heightPercent:false,
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    tableData: [{}]
  },
  commonConfig: {
    leftSpaceDistance: 0,
    rightSpaceDistance: 0,
    bottomSpaceDistance: 0,
    topSpaceDistance: 0
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
  isMixinsCustomConfig:true,
  component: {
    template: `
    <div v-if="options.contentDataSource==='radio-button-interface'" :style="{display:'flex'}">
      <img
        v-for='item in options.columns'
        :src="item.value"
        :style="{width:imgWidth, height: imgHeight}"

      />
    </div>
      <img
        v-else
        :src="options.src"
        :style="{width:imgWidth, height: imgHeight}"
      />
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    computed:{
      imgWidth(){
        const margin = this.options.commonConfig.leftSpaceDistance + this.options.commonConfig.rightSpaceDistance + 'px'
        let width = this.options.commonConfigCompWidth+this.options.commonConfigCompWidthUnit
        if(this.options.commonConfigCompWidthUnit=='auto'){
          return `calc(100% - ${margin})`
        }
        return `calc(${width} - ${margin})`
      },
      imgHeight(){
        if(this.options.commonConfigCompHeightUnit=='auto'){
          return '100%'
        }
        return this.options.commonConfigCompHeight+this.options.commonConfigCompHeightUnit
      }
    }
  },
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '静态图片',
        value: 'radio-button-default',
        formType: 'img-upload',
        key: 'src'
      }, {
        label: '后端服务',
        value: 'radio-button-interface',
        formType: 'interface-chart-table'
      }
    ]
  },
  configList: [
    {
      labelName: '图片',
      formType: 'img-upload',
      key: 'src'
    }
  ],
  options: optionsConfig
}
