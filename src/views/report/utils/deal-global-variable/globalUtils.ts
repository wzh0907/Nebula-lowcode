
import { getStorage, setStorage } from "@/util/storageUtil.js";
import { getVarTreeService } from "@/api/globalVariable";

export function initVariable() {
    getVarTreeService().then(res => {
        setStorage('globalVariable', res.dataList);
    })
}
export function saveVariable(scopeId, variableKey, value) {
    let scpoeList = getStorage("globalVariable");
    scpoeList && scpoeList.forEach(scopeItem => {
        if (scopeId == scopeItem['scopeId']) {
            let children: Array<GlobalVariableVO> = scopeItem['children'];
            children.forEach(variableItem => {
                if (variableItem.variableKey == variableKey) {
                    variableItem.value = value
                }
            })
        }

    })
    setStorage('globalVariable', scpoeList);
}
export function getVariable(scopeId, variableKey) {
    let value: string=""
    let scpoeList = getStorage("globalVariable");
    scpoeList && scpoeList.forEach(scopeItem => {
        if (scopeId == scopeItem['scopeId']) {
            let children: Array<GlobalVariableVO> = scopeItem['children'];
            children.forEach(variableItem => {
                if (variableItem.variableKey == variableKey) {
                    value = variableItem.value || variableItem.defaultValue
                }
            })
        }
    })
    return value;
}
export function getAllVariable() {
    let scpoeList = getStorage("globalVariable");
    return scpoeList;
}

export function getVariableByScopeName(scopeName, variableKey) {
    let value: string=""
    let scpoeList = getStorage("globalVariable");
    scpoeList && scpoeList.forEach(scopeItem => {
        if (scopeName == scopeItem['scopeName']) {
            let children: Array<GlobalVariableVO> = scopeItem['children'];
            children.forEach(variableItem => {
                if (variableItem.variableKey == variableKey) {
                    value = variableItem.value || variableItem.defaultValue
                }
            })
        }
    })
    return value;
}
export function saveVariableByScopeName(scopeName, variableKey, value) {
    let scpoeList = getStorage("globalVariable");
    scpoeList && scpoeList.forEach(scopeItem => {
        if (scopeName == scopeItem['scopeName']) {
            let children: Array<GlobalVariableVO> = scopeItem['children'];
            children.forEach(variableItem => {
                if (variableItem.variableKey == variableKey) {
                    variableItem.value = value
                }
            })
        }

    })
    setStorage('globalVariable', scpoeList);
}
class GlobalVariableVO {
    id: number
    scopeId: number
    variableKey: string
    defaultValue: string
    value: string
}