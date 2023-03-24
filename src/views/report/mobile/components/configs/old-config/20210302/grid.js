/** 宫格 */
let optionsConfig = {
  // 自定义属性
  columnNum: '4',
  iconSize: '28',
  gutter: '0',
  border: true,
  direction: 'vertical',
  // 宫格项配置
  collapsePanelColumns: [
    {
      text: '文字',
      icon: {
        fontClass: 'iconfont iconlunbotu',
        unicode: 'e699'
      },
      url: ''
    }
  ]
}

export default {
  type: 'van-design-grid',
  isAsideMenuHide: true,
  name: '宫格',
  icon: 'icongrid1',
  // img: button_img,
  component: {
    template: `
    <van-grid
      :column-num="options.columnNum"
      :icon-size="options.iconSize + 'px'"
      :gutter="options.gutter"
      :border="options.border"
      :direction="options.direction"
    >
      <van-grid-item :text="col.text" :url="col.url" v-for="(col, key) in options.collapsePanelColumns" :key="key">
        <template slot="icon">
          <i :class="col.icon.fontClass" style="font-size: 28px;" />
        </template>
      </van-grid-item>
    </van-grid>
    `,
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '列数',
      formType: 'input-number',
      key: 'columnNum'
    }, {
      labelName: '图标大小',
      formType: 'input-number',
      key: 'iconSize'
    }, {
      labelName: '格子间距',
      formType: 'input-number',
      key: 'gutter'
    }, {
      labelName: '边框',
      formType: 'switch',
      key: 'border'
    }, {
      labelName: '排列方向',
      formType: 'radio-button',
      key: 'direction',
      typeConfigs: [
        {
          label: '横向',
          value: 'horizontal'
        }, {
          label: '竖向',
          value: 'vertical'
        }
      ]
    },
    // 宫格项配置
    {
      labelName: '宫格项配置',
      formType: 'collapse-panel',
      addBtnText: '添加宫格项',
      key: 'collapsePanelColumns',
      addColumnConfig: {
        text: '文字',
        icon: {
          fontClass: 'iconfont iconlunbotu',
          unicode: 'e699'
        },
        url: ''
      },
      collapsePanelColumnsConfigs: [
        {
          labelName: '文字',
          formType: 'input',
          placeholder: '值',
          key: 'text'
        }, {
          labelName: '图标',
          formType: 'icon-upload',
          key: 'icon'
        }, {
          labelName: '页面跳转',
          formType: 'input',
          placeholder: '跳转地址',
          key: 'url'
        }
      ]
    }
  ],
  options: optionsConfig
}
