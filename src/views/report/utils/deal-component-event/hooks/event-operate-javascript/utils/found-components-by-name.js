/**
 * 通过组件名称获取所有匹配到的组件
 * @param {String} componentName 
 * @param {Array} uuidComponentList 非组件树，所有组件都在一维数组内 
 * @returns {Array} componentList
 */
export default function foundComponentsByName(componentName, uuidComponentList) {
    const matchComponentList = []
    deepHandleFn(uuidComponentList)

    function deepHandleFn(uuidComponentList) {
        uuidComponentList.forEach((componentItem, componentIndex) => {
            if (componentItem.options.commonConfigAssignName === componentName) {
                matchComponentList.push(componentItem)
            }
        })
    }

    return matchComponentList
}
