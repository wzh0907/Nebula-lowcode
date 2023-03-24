import { coverBigComponent } from "@/views/report/utils/common-const";

/**
 * 通过页面全部组件获取当前正在操作的组件，及它所在的ComponentList
 * @param {*} componentList 
 * @param {*} currentWidgetComponentConfig 
 * @returns 
 */
export default function foundIndexByList(componentList, currentWidgetComponentConfig) {
    const currentUUID = currentWidgetComponentConfig.uuid
    let currentList = []
    let currentIndex = undefined
    deepHandleFn(componentList, currentUUID, currentWidgetComponentConfig.type)
    return { currentList, currentIndex }

    function deepHandleFn(componentList, currentUUID, currentType) {
        componentList.forEach((componentItem, componentIndex) => {
            if (componentItem.uuid === currentUUID) {
                currentList = componentList
                currentIndex = componentIndex
            } else if (coverBigComponent.indexOf(componentItem.type) !== -1) {
                let childrenComponentColumn = componentItem.options.columns
                let childrenComponentGroup = componentItem.options.componentList
                if (currentType === 'van-design-group-component' && childrenComponentGroup.length) {
                    // 复合组件特殊处理
                    let deepList = componentItem.options.componentList
                    deepHandleFn(deepList, currentUUID)
                } else if (childrenComponentColumn && childrenComponentColumn.length) {
                    // 其他通用嵌套组件
                    childrenComponentColumn.forEach(columns => {
                        if (columns.componentList && columns.componentList.length) {
                            deepHandleFn(columns.componentList, currentUUID)
                        }
                    })
                }
            }
        })
    }
}
