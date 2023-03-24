
const state = {
  globalVariables: [],
}

const mutations = {
  SET_GLOBAL_VARIABLES: (state, globalVariables) => {
    state.globalVariables = globalVariables
  }
}

const actions = {
  setGlobalVariables({ commit }, globalVariables) {
    return new Promise((resolve, reject) => {
      commit('SET_GLOBAL_VARIABLES', globalVariables)
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

