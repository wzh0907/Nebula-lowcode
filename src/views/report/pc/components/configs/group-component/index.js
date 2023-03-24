/** 栅格 */
import layoutTemplate from './template.vue'
import optionsConfig from './options-config'
/**
 * TODO:: beforeCreate, beforeDestroy hook报错
 * 待修复，目前解决方法是删除beforeCreate, beforeDestroy方法
 */
// delete layoutTemplate.beforeCreate
// delete layoutTemplate.beforeDestroy

export default {
  type: 'van-design-group-component',
  isAsideMenuHide: true,
  name: '复合组件',
  icon: 'iconmokuai',
  component: layoutTemplate,
  configList: [],
  options: optionsConfig
}
