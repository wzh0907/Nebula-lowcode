import { coverBigComponent } from "@/views/report/utils/common-const";
export default {
  coverBigComponent,
  // 自定义属性
  fixDynamicComponentConfig: {
    isToRender: true,
    currentDragIndex: 9999,
    currentDragColIndex: 9999,
  },
  active: [], // TODO: 选择值
  accordion:false,
  columns: [
    {
      title:'标题',
      // content:'内容',
      componentList: []
    }
  ],
  // template 属性
  // currentColumns: {},
  chooseItemIndex: 999,
  addItemIndex: -1,
  isChangeComponentConfig: false
}