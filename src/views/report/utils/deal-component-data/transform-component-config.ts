import { coverBigComponent } from "@/views/report/utils/common-const";
import { componentDeepClone } from '@/views/report/utils/deal-component-data/deep-clone-component-config'

/**
 * 接口返回的配置数据是不能直接使用的，需要通过该方法处理一下，组装成可以直接用来渲染页面的配置数据
 * @param componentConfigSimpleList 接口返回的组件配置list。作用：这个配置数据不全，不能用来直接使用
 * @param componentConfigFullList 处理之后可以直接渲染页面的组件配置list
 * @param componentsConfigs 本地组件配置list。作用：需要读取本地配置来补全接口返回的配置
 * @param permissionIdList 权限id列表
 * @param generateComponentsUUID
 */
export function transformComponentConfigSimpleToFull (componentConfigSimpleList, componentConfigFullList, componentsConfigs, permissionIdList, generateComponentsUUID){
  componentConfigSimpleList.forEach(item => {
    let componentObj = {} as any
    let type = item.type
    let uuid = item.uuid
    let componentOptions = item.options
    // if (componentOptions.commonConfigAssignIsPermission) {
    //   let forbidden = true
    //   if (permissionIdList.indexOf(uuid) !== -1) {
    //     forbidden = false
    //   }
    //   if (forbidden) {
    //     return false
    //   }
    // }
    /**
     * 老版角色管理，现在应该已经弃用了
     */
    // if (componentOptions.commonConfigAssignRights && componentOptions.commonConfigAssignRights.length) {
    //   let forbidden = true
    //   componentOptions.commonConfigAssignRights.forEach(rightItem => {
    //     if (permissionIdList.indexOf(rightItem) !== -1) {
    //       forbidden = false
    //     }
    //   })
    //   if (forbidden) {
    //     return false
    //   }
    // }
    if (coverBigComponent.indexOf(type) !== -1 && item.options.columns && item.options.columns.length) {
      item.options.columns.forEach(columns => {
        if (columns.componentList && columns.componentList.length) {
          let tempComponentList = []
          transformComponentConfigSimpleToFull(columns.componentList, tempComponentList, componentsConfigs, permissionIdList, generateComponentsUUID)
          columns.componentList = tempComponentList
        }
      })
    } else if (type === "van-design-group-component") {
      let tempComponentList = [];
      transformComponentConfigSimpleToFull(
        item.options.componentList,
        tempComponentList,
        componentsConfigs,
        permissionIdList,
        generateComponentsUUID
      );
      item.options.componentList = tempComponentList;
    }
    componentsConfigs.forEach(configItems => {
      configItems.forEach(configItem => {
        if (configItem.type === type) {
          let newConfigItem = componentDeepClone(configItem)
          if (newConfigItem.options) { // 对options进行处理，如果模板有某个属性而当前组件没有，则给当前组件添加改属性，并赋值默认值
            for(let newConfigKey in newConfigItem.options) {
              if (componentOptions[newConfigKey] === undefined) {
                componentOptions[newConfigKey] = newConfigItem.options[newConfigKey]
              }
            }
          }
          newConfigItem.options = componentOptions
          componentObj = componentDeepClone(newConfigItem)
          componentObj.uuid = uuid
        }
      })
    })
    componentObj.generateComponentsUUID = generateComponentsUUID
    componentObj.options && (componentObj.options.generateComponentsUUID = generateComponentsUUID)
    componentConfigFullList.push(componentObj)
  })
}
