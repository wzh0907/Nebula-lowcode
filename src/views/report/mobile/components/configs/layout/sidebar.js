/** 侧边导航 */
let optionsConfig = {
  // 自定义属性
  activeKey: '',
  columns: [
    {
      value: '菜单名称'
    }
  ]
}

export default {
  type: 'van-design-sidebar',
  name: '侧边导航',
  icon: 'iconswipeCell',
  // img: button_img,
  component: {
    template: `
    <van-sidebar v-model="options.activeKey">
      <van-sidebar-item :title="col.value" v-for="(col, key) in options.columns" :key="key" />
    </van-sidebar>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '菜单项',
      formType: 'columns-config',
      addBtnText: '添加菜单项',
      key: 'columns'
    }
  ],
  options: optionsConfig
}
