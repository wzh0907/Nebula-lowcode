import foundIndexByList from './utils/found-index-by-list'

export default function fnCtrlD(_vm, currentWidgetComponentConfig, componentList) {
    const { currentIndex, currentList } = foundIndexByList(componentList, currentWidgetComponentConfig)
    let arr = currentList.splice(currentIndex, 1);
    let componentConfigItem = arr[0] || {}
    // 保存操作记录（删除）
    _vm.$globalData.operateStack.push({
        uuid: componentConfigItem.uuid,
        componentConfig: componentConfigItem,
        componentList: currentList,
        componentIndex: index,
        isDelete: true
    })
}
