/** 图标 */
let optionsConfig = {
  // 自定义属性
  value:"",
  columns: [],
  color: 'inherit',
  defaultTableData: [], // 默认值
  contentDataSource: 'radio-button-default',
  contentDataEcho: '',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    tableData: [{}]
  },
  interfaceDataEchoConfig:{
    id:''
  },
}
export default {
  type: 'van-design-dropdown-menu',
  name: '下拉菜单',
  icon: 'iconxialadanxuan',
  // img: button_img,
  component: {
    template: `
      <van-dropdown-menu>
        <van-dropdown-item get-container="#mobileCustomDialog" v-model="options.value" :options="options.columns" />
      </van-dropdown-menu>
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
          console.log("watch val",val);
          this.options.columns=[];
          val.forEach(item=>{
            this.options.columns.push({
              text:item.label,
              value:item.value
            })
          })
        },
        deep: true
     },
    },
  },
  configList: [
    
  ],
  options: optionsConfig
}
