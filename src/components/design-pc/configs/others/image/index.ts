import layoutTemplate from './template.vue'
import optionsConfig from './options-config'

export default {
  type: 'van-design-image',
  name: '图片',
  icon: 'iconicon_tupian-xian',
  isRefreshComponent: true, // 是否为可刷新组件
  component: layoutTemplate,
  options: optionsConfig,
  extraData: {
    columns: [] as any[]
  }
}
