const state = {
    reportId: 0,
    chooseSubpageIndex: 0,
    pageMap:new Map(),
    componentList:[],
}
const mutations = {
    setChooseSubpageIndex: (state, id) => {
        state.chooseSubpageIndex = id
    },
    setPageMap: (state, pageMap) => {
        console.log("setPageMap",pageMap)
        var id=pageMap.id
        var pageInfo = pageMap.pageInfo;
        state.pageMap.set(id,pageInfo);
    },
 
    setReportId: (state, reportId) => {
        state.reportId = reportId
    },
    setComponentList: (state, componentList) => {
        state.componentList = componentList
    },

}
const actions = {
    setChooseSubpageIndex({ commit }, id) {
        return new Promise((resolve, reject) => {
            commit('setChooseSubpageIndex', id)
            resolve()
        })
    },
    setPageMap({ commit }, pageMap) {
        return new Promise((resolve, reject) => {
            commit('setPageMap', pageMap)
            resolve()
        })
    },
    setReportId({ commit }, reportId) {
        return new Promise((resolve, reject) => {
            commit('setReportId', reportId)
            resolve()
        })
    },
    setComponentList({ commit }, componentList) {
        return new Promise((resolve, reject) => {
            commit('setComponentList', componentList)
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
