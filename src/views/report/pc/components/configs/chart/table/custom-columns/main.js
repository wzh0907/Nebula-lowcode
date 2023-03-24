import { deepClone } from './deep-clone.js'
const _uniqueKey = 'title' // columns内可以作为唯一判断的key（遍历匹配使用）

/**
 * 生成columnsMap用于通过key快速查找columns里的项
 * @param {Array} columns
 * @returns Object
 */
export function generateColumnsMap (columns) {
    let columnByKeyMap = {}
    columns.forEach(item => {
        let obj = deepClone(item)
        obj._isChecked = true
        columnByKeyMap[item[_uniqueKey]] = obj
    })

    return columnByKeyMap
}

/**
 * 通过本地存储的columns生成可用的columns
 * @param {Array} columns
 * @returns Array
 */
export function generateLocalColumns (columns) {
    let list = []
    columns.forEach(v => {
        v._isChecked !== false && list.push(v)
    })
    return list
}
/**
 * 通过columns生成用于重新加载Table的columns
 * @param {String} columnsStr
 * @param {Object} columnByKeyMap
 * @returns Array
 */
export function generateReloadColumns (columnsStr, columnByKeyMap) {
    let _dataList = JSON.parse(columnsStr)
    let fullColumns = completeColumnsRender(_dataList, columnByKeyMap)

    let list = []
    fullColumns.forEach(v => {
        v._isChecked !== false && list.push(v)
    })

    return list
}
/**
 * 补全columns的Render函数
 * @todo 由于通过拷贝出来的columns没有Render函数，不能直接用于渲染Table，故需要通过下面方法补全
 * @param {Array} columns
 * @param {Object} columnByKeyMap
 * @returns Array
 */
export function completeColumnsRender (columns, columnByKeyMap) {
    let fullColumns = []
    columns.forEach(v => {
        let obj = columnByKeyMap[v[_uniqueKey]]
        if (obj) {
            obj = deepClone(obj)
            obj._isChecked = v._isChecked
            fullColumns.push(obj)
        }
    })
    return fullColumns
}
