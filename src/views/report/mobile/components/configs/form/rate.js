let optionsConfig = {
  value: 0,
  count: 5,
  icon: 'star',
  color: '#ee0a24',
  allowHalf: false
}
export default {
  type: 'van-design-rate',
  name: '评分',
  icon: 'iconpingfen2',
  component: {
    template: `
      <van-rate v-model="options.value" :count="options.count" :icon="options.icon" :void-icon="options.icon + '-o'" :color="options.color" :allow-half="options.allowHalf" />
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '图标数',
      formType: 'input-number',
      key: 'count'
    },
    {
      labelName: '图标',
      formType: 'custom-component-config',
      subFormType: 'rate-icon-config'
    },
    // {
    //   labelName: '图标',
    //   formType: 'icon-upload',
    //   isShowLineEntityIcon: true,
    //   key: 'icon'
    // }, {
    //   labelName: '图标颜色',
    //   formType: 'color-picker',
    //   key: 'color'
    // },
    {
      labelName: '允许半选',
      formType: 'switch',
      key: 'allowHalf'
    }, {
      labelName: '默认值',
      formType: 'input-number',
      key: 'value'
    }
  ],
  options: optionsConfig
}
