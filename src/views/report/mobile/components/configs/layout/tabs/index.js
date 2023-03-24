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
  type: 'van-design-tabs',
  name: '标签页',
  icon: 'icontab1',
  // img: button_img,
  component: layoutTemplate,
  configList: [
    {
      labelName: '标签项',
      formType: 'columns-config',
      panelLabelPosition: 'left',
      panelLabelPositionWidth: '70px',
      addBtnText: '添加标签项',
      key: 'columns',
      addColumnConfig: {
        value: 'tab',
        pullRefresh: true,
        componentList: []
      }
    }, {
      labelName: '标签风格',
      formType: 'radio-button',
      key: 'type',
      typeConfigs: [
        {
          label: '线条',
          value: 'line'
        }, {
          label: '卡片',
          value: 'card'
        }
      ]
    },{
      labelName: '位置',
      formType: 'radio-button',
      key: 'position',
      typeConfigs: [
        {
          label: '上',
          value: 'top'
        }, {
          label: '下',
          value: 'bottom'
        }, {
          label: '左',
          value: 'left'
        },{
          label: '右',
          value: 'right'
        }
      ]
    }, {
      labelName: '下拉刷新',
      formType: 'switch',
      key: 'pullRefresh'
    }, {
      labelName: '滚动导航',
      formType: 'switch',
      key: 'scrollspy'
    }, {
      labelName: '顶部固定',
      formType: 'switch',
      key: 'fixed'
    }
  ],
  options: optionsConfig
}
