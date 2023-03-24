let optionsConfig = {
  value: '',
  fontSize: 12,  
  style:'default',
  btnList: [
    {
      label: '默认',
      value: ''
    }
  ],
  defaultTableData: [{
    label: '默认',
    value: ''
  }], // 默认值
  contentDataSource: 'radio-button-default',
  activeIndex: 0,
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    tableData: [{}]
  },
}
export default {
  type: 'van-design-segment',
  name: '按钮选择器',
  icon: 'iconfenduanqi',
  component: {
    template: `
      <div style="background-color: #f8f8f8; display: flex;  text-align: center;line-height:32px">
        <p
          style="flex: 1; margin: 0px; border-radius: 3px; cursor: pointer;"
          :style="{fontSize: options.fontSize + 'px', backgroundColor: options.value === item.value ? '#fff' : ''}"
          v-for="(item, index) in options.btnList"
          :key="index"
          @click="options.value = item.value"
        >
          {{ item.label }}
        </p>
      </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    watch:{
      'options.defaultTableData':{
        handler:function(val){
          // 这么处理的原因是 移动端和PC端 使用的字段不统一，这边操作是 对PC数据结构的拉平
          this.options.btnList=val;
        },
        deep: true
     },
    },
    methods: {
    
    },

  },
  configList: [
    {
      labelName: '字体大小',
      formType: 'input-number',
      key: 'fontSize'
    },
    {
      labelName: '风格',
      formType: 'select',
      key: 'style',
      typeConfigs: [
        {
          label: '默认',
          value: 'default'
        }, {
          label: '简约',
          value: 'simple'
        }, {
          label: '卡片',
          value: 'card'
        }
      ]
    },
    // {
    //   labelName: '按钮配置',
    //   formType: 'columns-values-config',
    //   // isSetConfigName: true,
    //   addBtnText: '添加按钮',
    //   key: 'btnList',
    //   addColumnConfig: {
    //     label: '名称',
    //     value: ''
    //   },
     
    // }
  ],
  options: optionsConfig
}
