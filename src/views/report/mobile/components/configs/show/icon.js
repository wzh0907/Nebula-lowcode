/** 图标 */
let optionsConfig = {
  // 自定义属性
  icon: {
    fontClass: 'iconfont ant-smile',
    name: 'smile',
    unicode: 'e78f'
  },
  color: '#000',
  size: '32',
}
export default {
  type: 'van-design-icon',
  name: '图标',
  icon: 'icontubiao',
  // img: button_img,
  component: {
    // template: `<van-icon :name="options.name" :color="options.color" :size="options.size" />`,
    template: `<i :class="options.icon.fontClass" :style="{fontSize: options.size + 'px', color: options.color}"></i>`,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    // {
    //   labelName: '图标',
    //   formType: 'icon-upload',
    //   key: 'icon'
    // },
    {
      labelName: '按钮图标',
      formType: 'custom-component-config',
      subFormType: 'icon-style-config'
    },
    {
      labelName: '图标颜色',
      formType: 'color-picker',
      key: 'color'
    },
    {
      labelName: '图标大小',
      formType: 'input-number',
      key: 'size'
    }
  ],
  options: optionsConfig
}
