import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import menu from './modules/menu'
import project from './modules/project'
import varible from './modules/var'
import report from './modules/report'
import global from './modules/global'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    menu,
    project,
    varible,
    report,
    global
  },
  getters
})

export default store
