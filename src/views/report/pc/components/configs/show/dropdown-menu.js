/** 下拉菜单 */
let optionsConfig = {
  // 自定义属性
  title: '菜单名称',
  menus: [
    {
      value: '菜单名称'
    }
  ]
}

export default {
  type: 'van-design-dropdown-menu',
  name: '下拉菜单',
  icon: 'iconswipeCell',
  component: {
    template: `
      <a-dropdown>
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          {{ options.title }} <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item v-for="(item, index) in options.menus" :key="index">
            <a
              target="_blank"
              rel="noopener noreferrer"
              :href="item.pageUrl || '/'"
            >{{ item.value }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '组件提示',
      formType: 'input',
      key: 'title'
    }, {
      labelName: '菜单项',
      formType: 'columns-config',
      addBtnText: '添加菜单项',
      key: 'menus'
    }
  ],
  options: optionsConfig
}
