import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
/** antd */
import Antd from 'ant-design-vue'
import {  message,Modal } from 'ant-design-vue'
import VueEditor from 'vue2-editor'
import VueI18n from 'vue-i18n'
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
// import vcolorpicker from 'vcolorpicker'
import 'element-ui/lib/theme-chalk/index.css'


import 'ant-design-vue/dist/antd.css'

import '@/styles/mainIndex.scss' // global css

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import '@/components' // 注册全局

import App from './App'
import store from './store'

import '@/icons' // icon
import '@/router/permission' // permission control
import Vant from 'vant'
import 'vant/lib/index.css'
import hasPermission from '@/utils/hasPermission'
import {getStorage,setStorage} from "@/util/storageUtil.js";



import vcolorpicker from '@/views/report/modules/colorPicker'
import ContextMenu from 'vue-contextmenujs'

// 注册设计器的数据管理引擎
import PageDataModelEngine from '@/views/report/utils/report-data-engine'

echarts.registerTransform(ecStat.transform.regression);

let vueRouter = {}
if (!process.env.VUE_APP_LIB) {
  vueRouter = require('@/router/index.js').default;
} else {
  vueRouter = require('@/router/index.lib.js').default;
}

Vue.use(Antd)
Vue.use(Vant)
Vue.use(hasPermission)
Vue.use(getStorage)
Vue.use(setStorage)
// import { NavBar, Col, Row, GridItem, Grid, Tab, Tabs, Divider, Sidebar, SidebarItem, ActionSheet, Icon, Image as VanImage, Button } from 'vant';
// Vue.use(NavBar)
// Vue.use(Col)
// Vue.use(Row)
// Vue.use(GridItem)
// Vue.use(Grid)
// Vue.use(Tab)
// Vue.use(Tabs)
// Vue.use(Divider)
// Vue.use(Sidebar)
// Vue.use(SidebarItem)
// Vue.use(ActionSheet)
// 展示
// Vue.use(Icon)
// Vue.use(VanImage)
// 表单
// Vue.use(Button)

Vue.use(VueI18n)
Vue.use(VueEditor)
// Vue.use(ElementUI)
Vue.use(ElementUI, { zIndex: 300 })
Vue.use(vcolorpicker)
Vue.use(ContextMenu)

Vue.locale('en-US', { ...enLocale })
Vue.locale('zh-CN', { ...zhLocale })
Vue.config.lang = 'zh-CN'

Vue.prototype.$antdMessage = message
Vue.prototype.$antdConfirm = Modal.confirm
Vue.prototype.$deviceDesignType = 'PC'
Vue.prototype.$echarts = echarts
Vue.prototype.$ecStat = ecStat
Vue.prototype.$globalData = {
  modelDataPool: { // model变量池 MVC功能
    customData: {

    },
    component: {

    },
    interface: []
  },
  operateStack: [], // 添加组件操作记录，撤消功能
  operateRepealStack: [] // 撤销操作记录，重做功能
  // isCollectOperateStack: true // 撤消功能
}
Vue.prototype.$pageDataModelEngine = new PageDataModelEngine(Vue.prototype.$globalData)

import FormMaking from './inject-design-component'
Vue.use(FormMaking)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router: vueRouter,
  store,
  render: h => h(App)
})
