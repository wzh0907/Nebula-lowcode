export default {
  value: null,
  defaultValueType: '', //'Today' 'Monday' 'MonthStart'
  rangeType: 'day', // day、week、month、Q、year
  selectRange: '',
  forbidRange: '', // before、after
  dateType: 'date',
  size: 'default',
  format: 'YYYY-MM-DD',
  disabled: false,
  labelShow: true,
  placeholder: '请选择日期',
  enPlaceHolder: '',
  width: 80,
  label: '标题',
  enLabel: '',
  labelAlign: 'right',
  clearable: true,
  required: false,
  contentDataSource: 'radio-button-default',
  contentDataEcho: '',
  interfaceDataConfig: {
    versions: '1.0.0',
    id: '',
    key: '',
    value: null,
  },
  interfaceDataEchoConfig: {
    id: ''
  }
}
