/** 文本宫格 */
let optionsConfig = {
  // 自定义属性
  contentDataSource: 'radio-button-default',
  // interfaceDataConfig: {
  //   id: '',
  //   key: '',
  //   value: 0,
  // },
  columnNum: '4',
  gutter: '0',
  border: true,
  direction: 'vertical',
  // 宫格项配置
  collapsePanelColumns: [
    {
      topText: '上方文本',
      text: '下方文本',
      interfaceDataConfig: {
        id: '',
        key: '',
        value: '标题',
      }
    }
  ]
}

export default {
  type: 'van-design-grid-text',
  isAsideMenuHide: true,
  name: '文本宫格',
  icon: 'iconicon-test',
  component: {
    template: `
    <van-grid
      :column-num="options.columnNum"
      :gutter="options.gutter"
      :border="options.border"
      :direction="options.direction"
    >
      <van-grid-item v-for="(col, key) in options.collapsePanelColumns" :key="key">
        <template slot="default">
          <span style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">{{ col.topText }}</span>
          <span>{{ col.text }}</span>
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
        topText: '上方文本',
        text: '文本',
        interfaceDataConfig: {
          id: '',
          key: '',
          value: '标题',
        }
      },
      collapsePanelColumnsConfigs: [
        // {
        //   labelName: '上方文本',
        //   formType: 'radio-button',
        //   key: 'contentDataSource',
        //   typeConfigs: [
        //     {
        //       label: '默认值',
        //       value: 'radio-button-default'
        //     }, {
        //       label: '后端服务',
        //       value: 'radio-button-interface'
        //     }
        //   ]
        // },
        {
          labelName: '上方文本',
          formType: 'input',
          placeholder: '值',
          key: 'topText'
        },
        {
          labelName: '下方文本',
          formType: 'input',
          placeholder: '值',
          key: 'text'
        }
      ]
    }
  ],
  options: optionsConfig
}
