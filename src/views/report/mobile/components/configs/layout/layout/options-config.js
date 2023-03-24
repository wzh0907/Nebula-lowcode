import { coverBigComponent } from "@/views/report/utils/common-const";
export default {
  coverBigComponent,
  fixDynamicComponentConfig: {
    isToRender: true,
    currentDragIndex: 9999,
    currentDragColIndex: 9999,
  },
  layoutHeight: 25,
  gutter: '0',
  type: false,
  justify: 'start',
  align: 'top',
  fixBottom: false,
  columnsSpanType: '24',
  columns: [
    {
      value: 24,
      componentList: []
    }
  ],
  chooseItemIndex: 999,
  addItemIndex: -1,
  isChangeComponentConfig: false,
  backgroundColor: '#fff', // 背景色
  // 背景图片的相关属性
  backgroundImage: '',
  backgroundRepeat: '',
  backgroundSize: 'contain',
  backgroundSizeWidth: '',
  backgroundSizeHeight: '',
  backgroundPositionX: '',
  backgroundPositionY: '',
  backgroundAttachment: '',
  backgroundOpacity:100,
  layoutMargin:0,
  layoutBorder:0,
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
