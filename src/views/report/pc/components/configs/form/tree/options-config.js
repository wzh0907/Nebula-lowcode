export default {
  // 自定义属性
  value: '',  ////组件输出的value值
  outputLabel: '',  //组件输出的label值
  pathValue: '', //包含父节点信息的value,节点信息用-连接
  pathLabel: '', //包含父节点信息的label,节点信息用-连接
  type: 'text',
  label:'标题',
  enLabel: '',
  containPath: false,
  multiple: false,
  width:80,
  labelShow:true,
  treeData: [],
  placeholder: '请选择',
  enPlaceHolder: '',
  // allowClear: true,
  expandAll: false,
  labelAlign: 'right',
  size: 'default',
  disabled: false,
  clearable: false,
  //层级数据
  setOptions:{
    value:'',
    name:'',
    id:'',
    parentId:''
  },
  // 配置
  contentDataSource: 'radio-button-default',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    tableData:[]
  },
  interfaceDataEchoConfig:{
    id:''
  },
  contentDataEcho: '',
}
