import { getProjectListService } from '@/api/project'
import {getStorage,setStorage} from "@/util/storageUtil.js";
const state = {
  projectId: 0,
  projectList: [],
}

const mutations = {
  SET_PROJECT_ID: (state, id) => {
    state.projectId = id
  },
  SET_PROJECT_LIST: (state, projectList) => {
    state.projectList = projectList
  }
}

const actions = {
  getProjectList({ commit, state }, isSetLastItem) {
    return new Promise((resolve, reject) => {
      let params = { workMode: getStorage("workMode") }
      console.log(getStorage("workMode"))
      getProjectListService(params).then(response => {
        const { dataList } = response
        // if (dataList && dataList.length) {
        if (dataList) {
          commit('SET_PROJECT_LIST', dataList || [])
          let lastItemIndex = dataList.length - 1
          let lastItem = dataList[lastItemIndex]
          // commit('SET_PROJECT_ID', lastItem.id)
          if (!state.projectId || isSetLastItem) {
            commit('SET_PROJECT_ID', lastItem.id)
          }
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  setProjectId({ commit }, id) {
    return new Promise((resolve, reject) => {
      commit('SET_PROJECT_ID', id)
      resolve()
    })
  },
  removeProjectId({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_PROJECT_ID', 0)
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

