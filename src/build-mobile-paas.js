import DynamicComponent from '@/views/report/mobile/generate-component/dynamic-component.vue'
import MakingFormMobile from '@/views/report/mobile/generate-component/index.vue'

import PageDataModelEngine from '@/views/report/utils/report-data-engine'

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
MakingFormMobile.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  if (expire >= new Date().getTime()) {
    Vue.component(MakingFormMobile.name, MakingFormMobile)
  }
}

const components = [
  DynamicComponent,
  MakingFormMobile
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
}

export {
  install,
  DynamicComponent,
  MakingFormMobile
}

export default {
  install,
  DynamicComponent,
  MakingFormMobile
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
