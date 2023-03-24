import QRCode from './qrcode/qrcode'

let optionsConfig = {
  // 自定义属性
  value: 'https://img.yzcdn.cn/vant/cat.jpeg',
  contentDataSource: 'radio-button-default',
  width: '100',
  height: '100',
  color:'#000000',
  interfaceDataConfig: {
    id: '',
    key: '',
    color: '#000000',
    value: '文本',
  },
}

export default {
  type: 'van-design-qrcode',
  name: '二维码',
  icon: 'iconQRcode',
  component: {
    template: `
    <div :name="options.commonConfigAssignSign" :style="{width: options.width + 'px', height: options.height + 'px'}" ref="qrcode"></div>
    `,
    data() {
      return {
        options: optionsConfig,
        qrcode:{},
      }
    },
    watch: {      
      options: {
        deep: true,
        handler(val) {
          this.$nextTick(() => {
            this.createQrcode();
          });
        },
      },
    },
    computed: {
      
     
    },
    mounted() {
      this.$nextTick(() => {
        this.createQrcode()
      })
    },
    methods: {
      getDisplayText() {
        let displayText = ''
        const options = this.options

        if (options.contentDataSource === 'radio-button-default') {
          displayText = options.value
        } else {
          displayText = options.interfaceDataConfig.value
        }

        return displayText || '暂无数据'
      },
      createQrcode(){
        if(this.qrcode){
          this.$refs.qrcode.innerHTML = ''
          this.qrcode  = new QRCode(this.options.commonConfigAssignSign, {
            width: this.options.width,
            height: this.options.height, // 高度
            text:this.options.value, // 二维码内容
            render: 'canvas',   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            colorDark : this.options.color,
            colorLight : "#ffffff",
          });
        }else{
              this.qrcode  = new QRCode(this.options.commonConfigAssignSign, {
                width: this.options.width,
                height: this.options.height, // 高度
                text:this.options.value, // 二维码内容
                render: 'canvas',   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                colorDark : this.options.color,
                colorLight : "#ffffff",
              });
        }
        }
      }
  },
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '默认值',
        value: 'radio-button-default',
        formType: 'input',
        key: 'value'
      }, {
        label: '后端服务',
        value: 'radio-qrCode-interface',
        formType: 'interface-qrcode-src'
      }
    ]
  },
  configList: [
    {
      labelName: '宽度',
      formType: 'input-number',
      key: 'width'
    }, {
      labelName: '高度',
      formType: 'input-number',
      key: 'height'
    },
    
    // {
    //   labelName: '二维码内容',
    //   isSetConfigName:true, // 不启用labelWidth
    //   formType: 'custom-qrcode-content',
    //   key: 'contentDataSource',
    //   typeConfigs: [
    //     {
    //       label: '默认值',
    //       value: 'radio-button-default',
    //       formType: 'input',
    //       key: 'value'
    //     }, {
    //       label: '后端服务',
    //       value: 'radio-qrCode-interface',
    //       formType: 'interface-qrcode-src'
    //     }
    //   ]
    // },
  ],
  options: optionsConfig
}
