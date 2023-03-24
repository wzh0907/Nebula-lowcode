import { coverBigComponent } from "@/views/report/utils/common-const";
export default {
  coverBigComponent,
  // 自定义属性
  fixDynamicComponentConfig: {
    isToRender: true,
    currentDragIndex: 9999,
    currentDragColIndex: 9999,
  },
  type: 'line',
  tabPosition: 'top',
  // scrollspy: false,
  // fixed: false,
  active: 0, // TODO: 选择值
  columns: [
    {
      value: 'Tab 1',
      componentList: []
    }
  ],
  // template 属性
  // currentColumns: {},
  chooseItemIndex: 999,
  addItemIndex: -1,
  isChangeComponentConfig: false
}
