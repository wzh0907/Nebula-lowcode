import {getStorage,setStorage} from "@/util/storageUtil.js";
export const setChartsConfigData = (e) => {
  let tempObj = {}
  if (tempObj[e.name + '_' + e.seriesType] === undefined) {
    tempObj[e.name + '_' + e.seriesType] = []
  }
  tempObj[e.name + '_' + e.seriesType].push({ [e.seriesName]: e.value })
  let str = getStorage('_var_data_list_') || '{}'
  let obj = JSON.parse(str)
  Object.assign(obj, tempObj)
  setStorage('_var_data_list_', JSON.stringify(obj))
}
export const setChartsConfigDatas = (dataObj) => { // 区别折线图返回的数据格式
  for (let i in dataObj) {
    if (Array.isArray(dataObj[i])) {
      let map = new Map()
      dataObj[i].forEach(item => {
        const key = Object.keys(item)[0]
        if (!map.has(key)) {
          map.set(key, item)
        }
      })
      dataObj[i] = [...map.values()]
    }
  }
  let str = getStorage('_var_data_list_') || '{}'
  let objs = JSON.parse(str)
  Object.assign(objs, dataObj)
  setStorage('_var_data_list_', JSON.stringify(objs))
}
