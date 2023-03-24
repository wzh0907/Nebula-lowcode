import { componentCopyConfig } from '@/hooks/use-report-shortcuts/utils/copy-component-config'
import { generateUUID } from "@/views/report/utils/index.js";
import foundIndexByList from './utils/found-index-by-list'
import {getStorage,setStorage} from "@/util/storageUtil.js";
/**
 * Ctrl+V快捷键
 * 把已复制的组件粘贴到当前所选中组件的下方
 * @param {*} currentWidgetComponentConfig 
 * @param {*} componentsConfigs 
 * @param {*} componentList 
 */
export default function fnCtrlV(currentWidgetComponentConfig, componentsConfigs, componentList) {
    // console.log("Ctrl+V is pressed.");
    let parseInfo = JSON.parse(getStorage("clipboard"))
    let newEl = componentCopyConfig(componentsConfigs, parseInfo.type, parseInfo.options)
    newEl.uuid = generateUUID()
    newEl.options.commonConfigAssignSign = newEl.uuid

    const { currentIndex, currentList } = foundIndexByList(componentList, currentWidgetComponentConfig)
    currentList.splice(currentIndex + 1, 0, newEl)
}
