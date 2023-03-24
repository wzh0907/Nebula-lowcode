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
  isFullCustomConfig: true,
  configList: [
    // {
    //   labelName: '数据表',
    //   formType: 'select',
    //   key: 'dataTable',
    //   typeConfigs: [
    //     {
    //       label: '表一',
    //       value: 'top'
    //     },
    //     {
    //       label: '表2',
    //       value: 'center'
    //     }, {
    //       label: '表3',
    //       value: 'bottom'
    //     }
    //   ]
    // },
    // {
    //   labelName: '主键',
    //   formType: 'input',
    //   key: 'primaryKey'
    // }, 
    // 输入项配置
    {
      labelName: '输入项配置',
      formType: 'form-config',
      addBtnText: '添加输入项',
      key: 'inputItemConfigs',
      addColumnConfig: {
        commonConfigAssignDisplay: true,
        type: 'input',
        label: '文字',
        required: false,
        placeholder: '',
        value: '',
        databaseField: '',
        componentConfig: {}
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
              value: 'input'
            }, {
              label: '开关',
              value: 'switch'
            }, {
              label: '单选框',
              value: 'radio'
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
