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
  scrollspy: false,
  fixed: false,
  active: '', // TODO: 选择值
  position:'top', // 标签页位置
  selectIndex:0, // 当前标签的索引
  columns: [
    {
      value: 'Tab 1',
      pullRefresh: true,
      componentList: []
    },
    {
      value: 'Tab 2',
      pullRefresh: true,
      componentList: []
    }
  ],
  pullRefresh: true, // 在标签页内是否支持下拉刷新
  // template 属性
  // currentColumns: {},
  chooseItemIndex: 999,
  addItemIndex: -1,
  isChangeComponentConfig: false
}
