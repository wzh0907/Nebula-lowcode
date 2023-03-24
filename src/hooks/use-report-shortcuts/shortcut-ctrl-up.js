import swapArray from './utils/swap-list'
import foundIndexByList from './utils/found-index-by-list'

export default function fnCtrlUp(currentWidgetComponentConfig, componentList) {
    const { currentIndex, currentList } = foundIndexByList(componentList, currentWidgetComponentConfig)

    if (currentIndex - 1 >= 0) {
        swapArray(currentIndex, currentIndex - 1, currentList);
    }
}
