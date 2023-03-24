/** 栅格 */
import formTemplate from './template.vue'
import optionsConfig from './options-config'
/**
 * TODO:: beforeCreate, beforeDestroy hook报错
 * 待修复，目前解决方法是删除beforeCreate, beforeDestroy方法
 */
// delete formTemplate.beforeCreate
// delete formTemplate.beforeDestroy

export default {
  type: 'van-design-form',
  name: '表单',
  icon: 'iconbiaodan',
  // img: button_img,
  component: formTemplate,
  // isFullCustomConfig: true,
  dataSourceConfig: {
    key: 'contentDataSource',
    typeConfigs: [
      {
        label: '数据表',
        value: 'radio-button-tables',
        formType: 'interface-chart-table'
      }
    ]
  },
  configList: [ 
    {
      labelName: '输入项配置',
      formType: 'form-config',
      addBtnText: '添加输入项',
      key: 'columns',
      addColumnConfig: {
        commonConfigAssignDisplay: true,
        type: 'input',
        label: '文字',
        required: false,
        placeholder: '',
        value: '',
        databaseField: '',
        options:{},
        componentConfig: {},
      },
      collapsePanelColumnsConfigs: [
        {
          labelName: '类型',
          formType: 'select',
          placeholder: '值',
          key: 'type',
          typeConfigs: [
            {
              label: '输入框',
              value: 'van-design-field'
            }, {
              label: '选择器',
              value: 'van-design-select'
            }, {
              label: '单选框',
              value: 'van-design-radio'
            }, {
              label: '时间选择器',
              value: 'van-design-datetime-picker'
            }, {
              label: '多选框',
              value: 'van-design-checkbox'
            },{
              label: '级联选择',
              value: 'van-design-cascade'
            }
          ]
        }, {
          labelName: 'label',
          formType: 'input',
          placeholder: '值',
          key: 'label'
        },
        // {
        //   labelName: 'placeholder',
        //   formType: 'input',
        //   placeholder: '值',
        //   key: 'placeholder'
        // },
        // {
        //   labelName: '字段',
        //   formType: 'input',
        //   placeholder: '值',
        //   key: 'databaseField'
        // }
      ]
    }
  ],
  options: optionsConfig
}
