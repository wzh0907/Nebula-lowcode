// ts类型
import { componentConfigItemType } from '@/views/report/type'
import commonConfig from './common'
import eventConfig from './common/event'
import { layoutComponents } from './layout'
import { showComponents } from './show'
import { formComponents } from './form'
import { chartComponents } from './chart'
import { oldConfigComponents } from './old-config/index.js'
import groupComponent from './group-component'
layoutComponents.push(groupComponent)

const components = [
  layoutComponents,
  chartComponents,
  showComponents,
  formComponents,
  oldConfigComponents // 该分类下的组件不会再侧边栏展示出来
] as componentConfigItemType[][]
/**
 * TODO::: 注意！！！
 *
 * config内的options与component.data引用的是同一个对象
 * 如果没有引用同一对象，组件将不能响应式的改变dom样式
 */
components.forEach(componentsItems => {
  // 为所有组件配置添加公共属性
  componentsItems.forEach(component => {
    // TODO::: 使用低版本数据配置
    if (component.options.interfaceDataConfig) {
      // delete component.options.interfaceDataConfig.versions
    }
    // 高级公共属性
    if (component.options.commonConfig) {
      component.options.commonConfig = Object.assign(JSON.parse(JSON.stringify(commonConfig)), component.options.commonConfig)
    } else {
      component.options.commonConfig = commonConfig
    }
    // 事件属性
    if (component.options.eventConfig) {
      component.options.eventConfig = Object.assign(JSON.parse(JSON.stringify(eventConfig)), component.options.eventConfig)
    } else {
      component.options.eventConfig = eventConfig
    }
    // 基础公共属性
    // component.options.commonConfigAssignDisplay = true
    component.options.commonConfigAssignSpanCol === undefined && component.configList.unshift({
      labelName: '高度',
      formType: 'common-config-size',
      key: 'commonConfigCompHeightUnit',
      typeConfigs: [
        {
          label: '默认',
          value: 'auto'
        },
        {
          label: '%',
          value: '%'
        }, {
          label: 'px',
          value: 'px'
        }
      ],
      setData: {
        size:'commonConfigCompHeight', //宽度
      }
    })
    component.options.commonConfigAssignSpanCol === undefined && component.configList.unshift({
      labelName: '宽度',
      formType: 'common-config-size',
      key: 'commonConfigCompWidthUnit',
      typeConfigs: [
        {
          label: '默认',
          value: 'auto'
        },
        {
          label: '%',
          value: '%'
        },
        {
          label: 'px',
          value: 'px'
        }
      ],
      setData: {
        size:'commonConfigCompWidth', //宽度
      }
    })
    component.options.commonConfigAssignSpanCol === undefined && component.configList.unshift({
      labelName: '容器',
      formType: 'slider',
      key: 'commonConfigAssignSpanCol',
      checkKey:"commonConfigAssignIsCol"
    })
    if( component.options.commonConfigAssignSpanCol === undefined){
      component.options.commonConfigAssignIsCol=true;
    }
    component.options.commonConfigAssignName === undefined && component.configList.unshift({
      labelName: '组件名称',
      formType: 'input',
      // isInputDisable: true,
      key: 'commonConfigAssignName'
    })
    let publicAttribute = component.configList[component.configList.length - 1] || {}
    publicAttribute.formType !== 'custom-collapse-panel' && component.configList.push({
      labelName: '其他',
      formType: 'custom-collapse-panel',
      isSetConfigName:true,
      key:'customOther',
      collapsePanelColumnsConfigs: []
    })
    component.options.commonConfigAssignSpanCol = 24
    component.options.commonConfigAssignSign = ''
    component.options.commonConfigAssignName = component.name || ''
    // component.options.commonConfigAssignHide = false // 组件隐藏功能
    component.options.commonConfigAssignRights = [] // 2021.04.28 该属性已废弃，使用commonConfigAssignIsPermission属性替代
    component.options.commonConfigAssignIsPermission = false
    component.options.commonConfigAssignCustomClass = ''

  })
})

export default components
