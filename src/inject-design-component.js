import VueI18n from 'vue-i18n'
import 'normalize.css/normalize.css'

// PC设计器

// 移动端设计器
// import MakingFormMobile from '@/views/report/mobile/index.vue'
import GenerateComponentMobile from '@/views/report/mobile/generate-component/index.vue'
// new pc
// import MakingFormPc from '@/views/report/pc/index.vue'
import GenerateComponentPc from '@/views/report/pc/generate-component/index.vue'
import webDesigner from '@/views/report/index.vue'
// 项目设计器
import projectDesign from '@/views/project-design/new-ui-index.vue'

import enUS from './lang/en-US'
import zhCN from './lang/zh-CN'

// import './iconfont/iconfont.css'
import './styles/cover.scss'
import './styles/index.scss'
import './styles/editor.scss'
import './styles/customChart.scss'
import './styles/antd-ui.scss'

const loadLang = function(Vue, lang, locale, i18n) {
  if (locale) {
    locale('en-US', { ...locale('en-US'), ...enUS })
    locale('zh-CN', { ...locale('zh-CN'), ...zhCN })
    Vue.config.lang = lang
  } else if (i18n) {
    i18n.setLocaleMessage('en-US', { ...i18n.messages['en-US'], ...enUS })
    i18n.setLocaleMessage('zh-CN', { ...i18n.messages['zh-CN'], ...zhCN })
    i18n.locale = lang
  } else {
    Vue.use(VueI18n)
    Vue.locale('en-US', { ...Vue.locale('en-US'), ...enUS })
    Vue.locale('zh-CN', { ...Vue.locale('zh-CN'), ...zhCN })
    Vue.config.lang = lang
  }
}

const expire = 32472201599000

// MakingForm.install = function(Vue, opts = {
//   lang: 'zh-CN',
//   locale: null,
//   i18n: null
// }) {
//   loadLang(Vue, opts.lang, opts.locale, opts.i18n)
//   if (expire >= new Date().getTime()) {
//     Vue.component(MakingForm.name, MakingForm)
//   }
// }
// MakingFormMobile.install = function(Vue, opts = {
//   lang: 'zh-CN',
//   locale: null,
//   i18n: null
// }) {
//   loadLang(Vue, opts.lang, opts.locale, opts.i18n)
//   if (expire >= new Date().getTime()) {
//     Vue.component(MakingFormMobile.name, MakingFormMobile)
//   }
// }
// MakingFormPc.install = function(Vue, opts = {
//   lang: 'zh-CN',
//   locale: null,
//   i18n: null
// }) {
//   loadLang(Vue, opts.lang, opts.locale, opts.i18n)
//   if (expire >= new Date().getTime()) {
//     Vue.component(MakingFormPc.name, MakingFormPc)
//   }
// }
projectDesign.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  if (expire >= new Date().getTime()) {
    Vue.component(projectDesign.name, projectDesign)
  }
}
webDesigner.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  if (expire >= new Date().getTime()) {
    Vue.component(webDesigner.name, webDesigner)
  }
}
GenerateComponentMobile.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  if (expire >= new Date().getTime()) {
    Vue.component(GenerateComponentMobile.name, GenerateComponentMobile)
  }
}
GenerateComponentPc.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  if (expire >= new Date().getTime()) {
    Vue.component(GenerateComponentPc.name, GenerateComponentPc)
  }
}

// GenerateForm.install = function(Vue, opts = {
//   lang: 'zh-CN',
//   locale: null,
//   i18n: null
// }) {
//   loadLang(Vue, opts.lang, opts.locale, opts.i18n)
//   if (expire >= new Date().getTime()) {
//     Vue.component(GenerateForm.name, GenerateForm)
//   }
// }

// GenerateAntdForm.install = function(Vue, opts = {
//   lang: 'zh-CN',
//   locale: null,
//   i18n: null
// }) {
//   loadLang(Vue, opts.lang, opts.locale, opts.i18n)
//   if (expire >= new Date().getTime()) {
//     Vue.component(GenerateAntdForm.name, GenerateAntdForm)
//   }
// }

const components = [
  // MakingForm,
  // GenerateForm,
  // GenerateAntdForm,
  // MakingFormMobile,
  // MakingFormPc,
  projectDesign,
  webDesigner,
  GenerateComponentMobile,
  GenerateComponentPc
]

const install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)

  if (expire >= new Date().getTime()) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// export {
//   install,
//   MakingForm,
//   GenerateForm,
//   GenerateAntdForm,
//   MakingFormMobile,
//   MakingFormPc,
//   projectDesign,
//   GenerateComponentMobile,
//   GenerateComponentPc
// }

export default {
  install,
  // MakingForm,
  // GenerateForm,
  // GenerateAntdForm,
  // MakingFormMobile,
  // MakingFormPc,
  projectDesign,
  webDesigner,
  GenerateComponentMobile,
  GenerateComponentPc
}
