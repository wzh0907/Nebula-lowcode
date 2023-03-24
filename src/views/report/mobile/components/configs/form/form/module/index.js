// import rate from './rate';
// import slider from './slider';
import vantInput from '../../input/index';
import vantSwitch from '../../switch';
import vantRadio from '../../radio/index';

const formComponents = [
  vantInput,
  vantSwitch,
  vantRadio
]

const components = [
  // layoutComponents,
  // chartComponents,
  // showComponents,
  formComponents
]
/**
 * TODO::: 注意！！！
 * 
 * config内的options与component.data引用的是同一个对象
 * 如果没有引用同一对象，组件将不能响应式的改变dom样式
 */
components.forEach(componentsItems => {
  // 为所有组件配置添加公共属性
  componentsItems.forEach(component => {
    // 高级公共属性
    // if (component.options.commonConfig) {
    //   component.options.commonConfig = Object.assign(JSON.parse(JSON.stringify(commonConfig)), component.options.commonConfig)
    // } else {
    //   component.options.commonConfig = commonConfig
    // }
    // 事件属性
    // if (component.options.eventConfig) {
    //   component.options.eventConfig = Object.assign(JSON.parse(JSON.stringify(eventConfig)), component.options.eventConfig)
    // } else {
    //   component.options.eventConfig = eventConfig
    // }
    // 基础公共属性
    // component.options.commonConfigAssignDisplay = true
    // component.uuid = component.options.commonConfigAssignSign
    // component.options.commonConfigAssignName = component.name || ''
    // component.options.commonConfigAssignRights = []
    // component.configList.unshift({
    //   labelName: '组件名称',
    //   formType: 'input',
    //   // isInputDisable: true,
    //   key: 'commonConfigAssignName'
    // })
    // component.configList.unshift({
    //   labelName: '组件ID',
    //   formType: 'input',
    //   isInputDisable: true,
    //   key: 'commonConfigAssignSign'
    // })
  })
})

export default components
