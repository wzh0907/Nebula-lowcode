let optionsConfig = {
  // 自定义属性
  title: '标题',
  leftText: '左侧标题',
  rightText: '右侧标题',
  leftArrow: false,
  fixed: false
}

export default {
  type: 'van-design-nav-bar',
  isAsideMenuHide: true,
  name: '导航栏',
  icon: 'iconall',
  // img: button_img,
  component: {
    template: `
      <van-nav-bar
        :title="options.title"
        :left-text="options.leftText"
        :right-text="options.rightText"
        :left-arrow="options.leftArrow"
        :fixed="options.fixed"
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
      labelName: '标题',
      formType: 'input',
      key: 'title'
    }, {
      labelName: '左侧标题',
      formType: 'input',
      key: 'leftText'
    }, {
      labelName: '右侧标题',
      formType: 'input',
      key: 'rightText'
    }, {
      labelName: '左侧箭头',
      formType: 'switch',
      key: 'leftArrow'
    }, {
      labelName: '顶部固定',
      formType: 'switch',
      key: 'fixed'
    }
  ],
  options: optionsConfig
}
