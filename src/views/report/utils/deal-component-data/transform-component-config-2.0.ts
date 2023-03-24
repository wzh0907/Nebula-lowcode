import { coverBigComponent } from "@/views/report/utils/common-const";
import { componentDeepClone } from '@/views/report/utils/deal-component-data/deep-clone-component-config'
import { generateUUID } from "@/views/report/utils/index.js";

/**
 * 接口返回的配置数据是不能直接使用的，需要通过该方法处理一下，组装成可以直接用来渲染页面的配置数据
 * 与transform-component-config.ts的区别：两种互不兼容，这个方法做了一些特殊处理
 * @param componentConfigList 接口返回的组件配置list。作用：这个配置数据不全，不能用来直接使用
 * @param componentList 处理之后可以直接渲染页面的组件配置list
 * @param componentsConfigs 本地组件配置list。作用：需要读取本地配置来补全接口返回的配置
 * @param isResetUUID 是否需要重新生成uuid
 */
export function transformComponentConfigSimpleToFullV2(componentConfigList, componentList, componentsConfigs, isResetUUID = false,origin_uuid?:string) {
  componentConfigList.forEach((item) => {
    let groupComponentOriginUUID = "";

    // fixFourBorderRadiusValueToZero(item) // TODO::: 临时修复borderRadius，会把所有组件borderRadius重置为0
    if (isResetUUID) {
      groupComponentOriginUUID = item.uuid;
      item.uuid = generateUUID();
      item.options && (item.options.commonConfigAssignSign = item.uuid)
    }
    if (item.groupComponentOriginUUID) groupComponentOriginUUID = item.groupComponentOriginUUID
    let componentObj = {} as any;
    let type = item.type;
    let uuid = item.uuid;
    let componentOptions = item.options;

    if (
      coverBigComponent.indexOf(type) !== -1 &&
      item.options.columns &&
      item.options.columns.length
    ) {
      item.options.columns.forEach((columns) => {
        if (columns.componentList && columns.componentList.length) {
          let tempComponentList = [];
          transformComponentConfigSimpleToFullV2(
            columns.componentList,
            tempComponentList,
            componentsConfigs,
            isResetUUID,
            origin_uuid
          );
          columns.componentList = tempComponentList;
        }
      });
    } else if (type === "van-design-group-component") {
      let tempComponentList = [];
      transformComponentConfigSimpleToFullV2(
        item.options.componentList,
        tempComponentList,
        componentsConfigs,
        isResetUUID,
        origin_uuid
      );
      item.options.componentList = tempComponentList;
    }
    componentsConfigs.forEach((configItems) => {
      configItems.forEach((configItem) => {
        if (configItem.type === type) {
          let newConfigItem = componentDeepClone(configItem);
          if (newConfigItem.options) {
            // 对options进行处理，如果模板有某个属性而当前组件没有，则给当前组件添加改属性，并赋值默认值
            for (let newConfigKey in newConfigItem.options) {
              if (componentOptions[newConfigKey] === undefined) {
                componentOptions[newConfigKey] =
                  newConfigItem.options[newConfigKey];
              }
            }
          }
          newConfigItem.options = componentOptions;
          componentObj = componentDeepClone(newConfigItem);
          componentObj.uuid = uuid;
        }
      });
    });
    if (componentObj.type === "van-design-group-component") {

    }
    if(origin_uuid){
      componentObj.options._data_origin_component_uuid=origin_uuid
    }
    if (groupComponentOriginUUID) {
      componentObj.groupComponentOriginUUID = groupComponentOriginUUID;
    }
    componentList.push(componentObj);
  });
}
