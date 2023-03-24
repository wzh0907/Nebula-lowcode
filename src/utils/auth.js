// import Cookies from 'js-cookie'
import {getStorage,setStorage,removeStorage} from "@/util/storageUtil.js";
export function getToken() {
  return getStorage('token')
}

export function getPhoneNumber() {
  return getStorage('phoneNumber')
}

export function getUsername() {
  return getStorage('username')
}

export function getThirdUserId() {
  return getStorage('thirdUserId')
}


export function getMerchantList() {
  const str = getStorage('merchantList') || '[]'
  return JSON.parse(str)
}

export function getMerchantId() {
  return getStorage('merchantId')
}
export function getMerchantName() {
  return getStorage('merchantName')
}

export function setToken(token) {
  setStorage('token', token)
}

export function setPermissionList(permissionList) {
  const str = JSON.stringify(permissionList || [])
  setStorage('permissionList', str)
}

export function setPhoneNumber(phoneNumber) {
  setStorage('phoneNumber', phoneNumber)
}

export function setUsername(username) {
  setStorage('username', username)
}
export function setThirdUserId(thirdUserId) {
  setStorage('thirdUserId', thirdUserId)
}

export function setMerchantList(merchantList) {
  const str = JSON.stringify(merchantList || [])
  setStorage('merchantList', str)
}
export function setMerchantId(merchantId) {
  setStorage('merchantId', merchantId)
}
export function setMerchantName(merchantName) {
  setStorage('merchantName', merchantName)
}
export function removeToken() {
  removeStorage('token')
}
