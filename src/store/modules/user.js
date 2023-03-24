import { login, logout, getInfo } from '@/api/user'
import {
  getToken,
  getPhoneNumber,
  getUsername,
  getThirdUserId,
  getMerchantList,
  getMerchantId,
  getMerchantName,
  setToken,
  setPhoneNumber,
  setUsername,
  setThirdUserId,
  setMerchantList,
  setMerchantId,
  setMerchantName,
  removeToken,
  setPermissionList
} from '@/utils/auth'
import store from '@/store'
import {getStorage,setStorage} from "@/util/storageUtil.js";

let resetRouter = {}
if (!process.env.VUE_APP_LIB) {
  resetRouter = require('@/router/index.js').resetRouter;
} else {
  resetRouter = require('@/router/index.lib.js').resetRouter;
}

const state = {
  phoneNumber: getPhoneNumber(),
  token: getToken(),
  username: getUsername(),
  thirdUserId: getThirdUserId(),
  merchantList: getMerchantList(),
  merchantId: getMerchantId(),
  merchantName: getMerchantName(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_PHONE_NUMBER: (state, phoneNumber) => {
    state.phoneNumber = phoneNumber
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_THIRD_USER_ID: (state, thirdUserId) => {
    state.thirdUserId = thirdUserId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_MERCHANT_LIST: (state, merchantList) => {
    state.merchantList = merchantList
  },
  SET_MERCHANT_ID: (state, merchantId) => {
    state.merchantId = merchantId
  },
  SET_MERCHANT_NAME: (state, merchantName) => {
    state.merchantName = merchantName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phoneNumber, password, source } = userInfo
    return new Promise((resolve, reject) => {
      login({ phoneNumber, password, source }).then(response => {
        const { data } = response
        commit('SET_USERNAME', data.fullName)
        commit('SET_THIRD_USER_ID', data.thirdUserId)
        commit('SET_TOKEN', data.token)
        commit('SET_PHONE_NUMBER', data.phoneNumber)
        commit('SET_MERCHANT_LIST', data.merchantList)
        commit('SET_MERCHANT_ID', data.merchantId)
        commit('SET_MERCHANT_NAME', data.merchantName)
        setToken(data.token)
        setPermissionList(data.permissionList)
        setPhoneNumber(data.phoneNumber)
        setUsername(data.fullName)
        setThirdUserId(data.thirdUserId)
        setMerchantList(data.merchantList)
        setMerchantId(data.merchantId)
        setMerchantName(data.merchantName)
        setStorage("workMode", "MERCHANT")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        store.dispatch('project/setProjectId', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  setMerchantId({ commit }, id) {
    return new Promise((resolve, reject) => {
      commit('SET_MERCHANT_ID', id)
      setMerchantId(id)
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

