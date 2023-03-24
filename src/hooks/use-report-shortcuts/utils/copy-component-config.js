import { componentDeepClone } from '@/views/report/utils/deal-component-data/deep-clone-component-config'
import { generateUUID } from "@/views/report/utils/index.js";
import { coverBigComponent } from "@/views/report/utils/common-const";

// TODO::: 与@/views/report/utils/deal-component-data/copy-component-config的方法没有太大区别（删除了TS类型、及 vue this）

/**
 * 
 * @param componentsConfigs 组件的本地配置（没有options的静态模板）
 * @param type 组件类型
 * @param options 组件options
 * @returns 新组件
 */
export function componentCopyConfig(componentsConfigs, type, options) {
  let componentObj = {}
  componentsConfigs.forEach(configItems => {
    configItems.forEach(configItem => {
      if (configItem.type === type) {
        let newConfigItem = componentDeepClone(configItem)
        newConfigItem.options = componentDeepClone(options)
        // 如果是嵌套组件要遍历它的所有子组件
        if (coverBigComponent.indexOf(type) !== -1) {
          let childrenComponentColumn = newConfigItem.options.columns
          let childrenComponentGroup = newConfigItem.options.componentList
          if(type === 'van-design-group-component' && childrenComponentGroup.length) {
            // 复合组件特殊处理
            let xxxxxxList = newConfigItem.options.componentList
            xxxxxxList.forEach((cItem, columnIndex) => {
              let obj = componentCopyConfig(componentsConfigs, cItem.type, cItem.options)
              xxxxxxList[columnIndex] = obj
            })
          } else if (childrenComponentColumn && childrenComponentColumn.length) {
            // 其他通用嵌套组件
            childrenComponentColumn.forEach(columns => {
              if (columns.componentList && columns.componentList.length) {
                let tempComponentList = []
                columns.componentList.forEach(cItem => {
                  let obj = componentCopyConfig(componentsConfigs, cItem.type, cItem.options)
                  tempComponentList.push(obj)
                })
                columns.componentList = tempComponentList
              }
            })
          }
        }
        componentObj = componentDeepClone(newConfigItem)
      }
    })
  })
  componentObj.uuid = generateUUID()
  componentObj.options.commonConfigAssignSign = componentObj.uuid
  return componentObj
}
