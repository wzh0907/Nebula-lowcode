import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-steps',
  name: '步骤条',
  icon: 'iconbuzhoutiao1',
  component: layoutTemplate,
  configList: [
    {
      labelName: '当前步骤',
      formType: 'input-number',
      key: 'active'
    }, {
      labelName: '步骤',
      formType: 'columns-config',
      addBtnText: '添加步骤',
      key: 'steps'
    }, {
      labelName: '显示方向',
      formType: 'radio-button',
      key: 'direction',
      typeConfigs: [
        {
          label: '横向',
          value: 'horizontal'
        }, {
          label: '竖向',
          value: 'vertical'
        }
      ]
    }, {
      labelName: '激活颜色',
      formType: 'color-picker',
      key: 'color'
    }
  ],
  options: optionsConfig
}
