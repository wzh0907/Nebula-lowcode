let optionsConfig = {
  title: '标题',
  subTitle: '副标题'
}

export default {
  type: 'van-design-page-header',
  name: '页头',
  icon: 'iconall',
  // img: button_img,
  component: {
    template: `
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="options.title"
        :sub-title="options.subTitle"
        @back="() => null"
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
      labelName: '副标题',
      formType: 'input',
      key: 'subTitle'
    }
  ],
  options: optionsConfig
}
