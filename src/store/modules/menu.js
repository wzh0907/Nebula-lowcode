const state = {
  menus: [
    {
      name: '表单管理',
      permissionSetting: 'form_setting'
    }, {
      name: '应用管理',
      permissionSetting: 'apply_setting'
    }
  ]
}

const mutations = {
  CHANGE_MENU: (state, menu) => {
    state.menu = menu
  }
}

const actions = {
  changeMenu({ commit }, menu) {
    commit('CHANGE_MENU', menu)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
