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
  type: 'van-design-collapse',
  name: '折叠面板',
  icon: 'iconfuhao-zhediemianban',
  // img: button_img,
  component: layoutTemplate,
  configList: [
    // 宫格项配置
    {
      labelName: '折叠项',
      formType: 'columns-config',
      addBtnText: '添加折叠项',
      key: 'columns',
      addColumnConfig: {
        title:'标题',
        // content:'内容',
        componentList: []
      },
      inputValueKey: 'title'
    },
    {
      labelName: '手风琴',
      formType: 'switch',
      key: 'accordion'
    }
  ],
  options: optionsConfig
}
