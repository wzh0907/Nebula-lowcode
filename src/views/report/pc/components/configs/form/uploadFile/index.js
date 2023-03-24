/** 标签页 */
import layoutTemplate from './template.vue'
import optionsConfig from './options-config'
/**
 * TODO:: beforeCreate, beforeDestroy hook报错
 * 待修复，目前解决方法是删除beforeCreate, beforeDestroy方法
 */
// delete layoutTemplate.beforeCreate
// delete layoutTemplate.beforeDestroy

export default {
  type: 'van-design-upload-file',
  name: '附件上传',
  icon: 'iconupload',
  // img: button_img,
  component: layoutTemplate,
  configList: [
    {
      labelName: '最大上传数',
      formType: 'upload-input-number',
      key: 'size'
    },
    {
      labelName: '是否多选(开启后按住 ctrl 可选择多个文件)',
      formType: 'switch',
      key: 'isMultiple'
    }
  ],
  options: optionsConfig
}
