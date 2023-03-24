/** 图标 */
let optionsConfig = {
  // 自定义属性
  title: '标题',
  border: true,
  // 单元项配置
  collapsePanelColumns: [
    {
      title: '标题',
      value: '内容',
      label: '',
      icon: {
        fontClass: 'iconfont iconlunbotu',
        unicode: 'e699'
      },
      url: '',
      isLink: false
    }
  ]
}
export default {
  type: 'van-design-cell-group',
  name: '单元格',
  isAsideMenuHide: true,
  icon: 'iconxialaliebiaokuang',
  // img: button_img,
  component: {
    template: `
      <van-cell-group :title="options.title" :border="options.border">
        <van-cell
          v-for="(item, key) in options.collapsePanelColumns"
          :key="key"
          :title="item.title"
          :label="item.label"
          :url="item.url"
          :isLink="item.isLink"
        >
          <template slot="icon">
            <i :class="item.icon.fontClass" style="font-size: 16px; margin-right: 4px;" />
          </template>
        </van-cell>
      </van-cell-group>
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
      labelName: '显示边框',
      formType: 'switch',
      key: 'border'
    },
    // 宫格项配置
    {
      labelName: '单元项配置',
      formType: 'collapse-panel',
      addBtnText: '添加单元项',
      key: 'collapsePanelColumns',
      addColumnConfig: {
        title: '标题',
        value: '内容',
        label: '',
        icon: {
          fontClass: 'iconfont iconlunbotu',
          unicode: 'e699'
        },
        url: '',
        isLink: false
      },
      collapsePanelColumnsConfigs: [
        {
          labelName: '左侧标题',
          formType: 'input',
          placeholder: '值',
          key: 'title'
        }, {
          labelName: '右侧内容',
          formType: 'input',
          key: 'value'
        }, {
          labelName: '下方详情',
          formType: 'input',
          placeholder: '值',
          key: 'label'
        }, {
          labelName: '左侧图标',
          formType: 'icon-upload',
          key: 'icon'
        }, {
          labelName: '跳转',
          formType: 'select',
          key: 'url',
          typeConfigs: [
            {
              label: '//www.xxx.com',
              value: '//www.xxx.com'
            }, {
              label: '//www.yyy.com',
              value: '//www.yyy.com'
            }
          ]
        }, {
          labelName: '显示箭头',
          formType: 'switch',
          key: 'isLink'
        }
      ]
    }
  ],
  options: optionsConfig
}
