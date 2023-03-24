import swapArray from './utils/swap-list'
import foundIndexByList from './utils/found-index-by-list'

export default function fnCtrlDown(currentWidgetComponentConfig, componentList) {
    const { currentIndex, currentList } = foundIndexByList(componentList, currentWidgetComponentConfig)

    if (currentIndex + 1 != currentList.length) {
        swapArray(currentIndex, currentIndex + 1, currentList);
    }
}
