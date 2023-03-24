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
  type: 'van-design-workflow',
  name: '审批流',
  icon: 'iconliuchengshuoming',
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

  ],
  options: optionsConfig
}
