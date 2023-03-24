import foundComponentsByName from '../utils/found-components-by-name.js'

export default class ComponentFunction {
    // 通过组件名获取组件引用
    static getComponents(componentName, uuidComponentList) {
        const componentList = foundComponentsByName(componentName, uuidComponentList)
        componentList.forEach(componentItem => {
            componentItem.getValue = function () { return ComponentFunction.getComponentValue(this) }
            componentItem.setValue = function (value) { return ComponentFunction.setComponentValue(this, value) }
            componentItem.toggle = function () { return ComponentFunction.toggleComponentDisplay(this) }
            componentItem.show = function () { return ComponentFunction.showComponentDisplay(this) }
            componentItem.hide = function () { return ComponentFunction.hideComponentDisplay(this) }
        })
        return componentList
    }
    // 获取组件值
    static getComponentValue(componentObj) {
        if (componentObj.type === 'van-design-table') {
            return componentObj.options.interfaceDataConfig.tableData
        } else {
            return componentObj.options.value
        }
    }
    // 设置组件值
    static setComponentValue(componentObj, value) {
        if (componentObj.type === 'van-design-table') {
            if (!Array.isArray(value)) throw Error('表格组件只能接收Array类型的值')

            return componentObj.options.interfaceDataConfig.tableData = value
        } else {
            return componentObj.options.value = value
        }
    }

    // 设置组件显示隐藏
    static toggleComponentDisplay(componentObj) {
        componentObj.options.commonConfig.displayHide = !componentObj.options.commonConfig.displayHide;
        return true
    }
    static showComponentDisplay(componentObj) {
        componentObj.options.commonConfig.displayHide = false;
        return true
    }
    static hideComponentDisplay(componentObj) {
        componentObj.options.commonConfig.displayHide = true;
        return true
    }
}
