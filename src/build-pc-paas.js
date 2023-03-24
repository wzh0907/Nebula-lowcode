import DynamicComponent from '@/views/report/pc/generate-component/dynamic-component.vue'
import MakingFormPc from '@/views/report/pc/generate-component/index.vue'

import PageDataModelEngine from '@/views/report/utils/report-data-engine'

import {  message,Modal } from 'ant-design-vue'

import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import VueEditor from 'vue2-editor'

// import './iconfont/iconfont.css'
import './styles/cover.scss'
import './styles/index.scss'
import './styles/editor.scss'

const expire = 32472201599000

DynamicComponent.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  if (expire >= new Date().getTime()) {
    Vue.component(DynamicComponent.name, DynamicComponent)
  }
}
MakingFormPc.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  if (expire >= new Date().getTime()) {
    Vue.component(MakingFormPc.name, MakingFormPc)
  }
}

const components = [
  DynamicComponent,
  MakingFormPc
]

const install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  if (install.installed) return
  install.installed = true

  if (expire >= new Date().getTime()) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
  installDataModelEngine(window.Vue)
  window.Vue.prototype.$antdMessage = message
  window.Vue.prototype.$antdConfirm = Modal.confirm
  echarts.registerTransform(ecStat.transform.regression);
  window.Vue.prototype.$echarts = echarts
  window.Vue.prototype.$ecStat = ecStat
  window.Vue.prototype.$VueEditor = VueEditor
}

export {
  install,
  DynamicComponent,
  MakingFormPc
}

export default {
  install,
  DynamicComponent,
  MakingFormPc
}
function installDataModelEngine(Vue){
  if (Vue && !Vue.prototype.$pageDataModelEngine) {
    console.log('当前是渲染器模式：安装数据引擎...')
    Vue.prototype.$globalData = {
      modelDataPool: { // model变量池 MVC功能
        customData: {

        },
        component: {

        },
        interface: []
      }
    }
    Vue.prototype.$pageDataModelEngine = new PageDataModelEngine(Vue.prototype.$globalData)
  }
}