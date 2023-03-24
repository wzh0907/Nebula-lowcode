/** 图标 */
let optionsConfig = {
  // 自定义属性
  name: 'chat-o',
  color: 'inherit',
  size: '20',
}
export default {
  type: 'van-design-card',
  isAsideMenuHide: true,
  icon: 'iconOnebuttonalarm',
  // img: button_img,
  component: {
    template: `
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
      />
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '触发操作',
      formType: 'radio-button',
      key: 'operate',
      typeConfigs: [
        {
          label: '页面跳转',
          value: 'aaa'
        }, {
          label: '接口调用',
          value: 'bbb'
        }
      ]
    }, {
      labelName: '图标颜色',
      formType: 'color-picker',
      key: 'color'
    }, {
      labelName: '图标大小',
      formType: 'input-number',
      key: 'size'
    }
  ],
  options: optionsConfig
}
