import DynamicCustomComponent from '@/views/report/mobile/generate-component/custom-component/index.vue'
// import MakingFormCustomMobile from '@/views/mobile-design/generate-component/index.vue'

// import './iconfont/iconfont.css'
import './styles/cover.scss'
import './styles/index.scss'
import './styles/editor.scss'

const expire = 32472201599000

DynamicCustomComponent.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  if (expire >= new Date().getTime()) {
    Vue.component(DynamicCustomComponent.name, DynamicCustomComponent)
  }
}
// MakingFormCustomMobile.install = function(Vue, opts = {
//   lang: 'zh-CN',
//   locale: null,
//   i18n: null
// }) {
//   if (expire >= new Date().getTime()) {
//     Vue.component(MakingFormCustomMobile.name, MakingFormCustomMobile)
//   }
// }

const components = [
  DynamicCustomComponent
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
}

export {
  install,
  DynamicCustomComponent
}

export default {
  install,
  DynamicCustomComponent
}
