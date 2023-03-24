import { coverBigComponent } from "@/views/report/utils/common-const";
export default {
  coverBigComponent,
  fixDynamicComponentConfig: {
    isToRender: true,
    currentDragIndex: 9999,
    currentDragColIndex: 9999,
  },
  gutter: 0,
  layoutHeight: 46,
  type: false,
  justify: 'start',
  align: 'top',
  columnsSpanType: '24',
  columns: [
    {
      value: 24,
      componentList: []
    }
  ],
  labelAlign:'left',
  layoutMargin:0,
  layoutBorder:0,
  backgroundColor: '#fff', // 背景色
  backgroundOpacity:100,
  chooseItemIndex: 999,
  addItemIndex: -1,
  isChangeComponentConfig: false,
  isDialogFooterContainer: false, // 是否作为弹窗页脚容器（打开后该容器作为对话框下面的Footer渲染）
  // 公共属性（组件边距）
  commonConfig: {
    topPaddingDistance: 0,
    bottomPaddingDistance: 0,
    leftPaddingDistance: 0,
    rightPaddingDistance: 0,
    topSpaceDistance:0,
    bottomSpaceDistance:0,
    leftSpaceDistance:0,
    rightSpaceDistance:0,
  }
}
