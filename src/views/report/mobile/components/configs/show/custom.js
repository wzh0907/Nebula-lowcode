let optionsConfig = {
  // 自定义属性
  value: '',
  name: '',
  width: 0,
  height: 100,
  customId: 0,
}
import placeholderImg from '@/assets/images/asideImg/flexImg/place_holder.png'
export default {
  type: 'van-design-custom',
  name: '自定义组件',
  icon: 'iconzhanweifu',
  component: {
    template: `
      <div :style="{width: '100%', height: options.height + 'px'}">
        <img src="${placeholderImg}" alt="" style="width: 100%; height: 100%;">
      </div>
    `,
    data() {
      return {
        options: optionsConfig
      }
    },
    methods: {}
  },
  dataSourceConfig: {
    key: 'contentDataSource',

  },
  _isSpecialConfig: true,
  configList: [

  ],
  options: optionsConfig
}
