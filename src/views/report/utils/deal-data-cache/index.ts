// import Vue from 'vue'
import {getStorage,setStorage} from "@/util/storageUtil.js";
/**
 * 保存或更新本地缓存
 * @param key key
 * @param value value
 */
export function saveAndUpdateLocalData(key, value) {
  let str = getStorage('_var_data_list_') || '{}'
  let obj = JSON.parse(str)
  obj[key] = value
  setStorage('_var_data_list_', JSON.stringify(obj))
  // Vue.$globalData._var_data_list_ = {}
}

export function saveAndUpdatePageLocalData(key, value, dataType) {
  let str = getStorage('_page_data_list_') || '[]'
  let pageDataList = JSON.parse(str)
  let exist = false;
  pageDataList.forEach(pageItem => {
    if (key === pageItem.key) {
      pageItem.value = value;
      pageItem.dataType = dataType;
      exist = true;
    }
  })
  if (!exist) {
    let newPageData = {
      key: key,
      value: value,
      dataType: dataType
    }
    pageDataList.push(newPageData);
  }
  setStorage('_page_data_list_', JSON.stringify(pageDataList))
}


/**
 * 获取本地缓存
 */
export function getLocalData() {
  let str = getStorage('_var_data_list_') || '{}'
  let obj = JSON.parse(str)
  return obj
}
export function getPageLocalData() {
  let str = getStorage('_page_data_list_') || '{}'
  let obj = JSON.parse(str)
  return obj
}

/**
 * 根据key获取本地缓存中的一条
 * @param key key
 */
export function getLocalDataByKey(key) {
  let str = getStorage('_var_data_list_') || '{}'
  let obj = JSON.parse(str)
  return obj[key]
}

/**
 * 删除本地缓存
 */
export function removeLocalData() {
  setStorage('_var_data_list_', '{}')
  return {}
}
export function removePageLocalData() {
  setStorage('_page_data_list_', '[]')
  return {}
}


export function saveAndUpdateTagData(treeId, treeJsonData) {
  let str = getStorage('_current_tag_list_') || '[]'
  let list = JSON.parse(str)
  let existFlag = false;
  list.forEach(item => {
    if (item.treeId === treeId) {
      existFlag = true;
      item.treeJsonData = treeJsonData;
    }
  });
  if (!existFlag) {
    list.push({ treeId: treeId, treeJsonData: treeJsonData });
  }

  setStorage('_current_tag_list_', JSON.stringify(list))
  // Vue.$globalData._var_data_list_ = {}
}
export function getTagDataByTreeId(treeId) {
  let str = getStorage('_current_tag_list_') || '[]'
  let list = JSON.parse(str)
  let treeIndex = -1
  list.forEach((item, index) => {
    if (item.treeId == treeId) {
      treeIndex = index;
    }
  });
  return treeIndex == -1 ? "" : list[treeIndex].treeJsonData;
}

export function removeTagDataByTreeId(treeId) {
  let str = getStorage('_current_tag_list_') || '[]'
  let list = JSON.parse(str)
  let treeIndex = -1
  list.forEach((item, index) => {
    if (item.treeId == treeId) {
      treeIndex = index;
    }
  });
  if (treeIndex != -1) {
    list.splice(treeIndex, 1)
  }
  setStorage('_current_tag_list_', JSON.stringify(list))
}


export function clearTagData() {
  setStorage('_current_tag_list_', '[]')
}