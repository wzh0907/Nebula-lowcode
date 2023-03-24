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
  type: 'van-design-upload-img',
  name: '图片上传',
  icon: 'iconupload',
  // img: button_img,
  component: layoutTemplate,
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
    {
      labelName: '背景图片',
      formType: 'icon-upload',
      key: 'icon'
    }, 
    {
      labelName: '最大上传数',
      formType: 'upload-input-number',
      key: 'size'
    },
    {
      labelName: '是否多选(开启后按住 ctrl 可选择多个文件)',
      formType: 'switch',
      key: 'isMultiple'
    },
    {
      labelName: '头像上传',
      formType: 'switch',
      key: 'showUploadList'
    }
  ],
  options: optionsConfig
}
