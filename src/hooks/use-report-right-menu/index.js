import componentsConfigsMobile from "@/views/report/mobile/components/configs/index";
import componentsConfigsPc from "@/views/report/pc/components/configs/index";

const commonComponentTypesPc = [
  "van-design-layout",
  "van-design-text",
  "van-design-icon",
  "van-design-button",
  "van-design-field",
  "van-design-select",
  "van-design-calendar",
  "van-design-image",
  "van-design-tabs",
];
const commonComponentTypesMobile = [
  "van-design-text",
  "van-design-icon",
  "van-design-image",
  "van-design-button",
  "van-design-layout",
  "van-design-list",
  "van-design-segment",
  "van-design-tabs",
  "van-design-field",
  "van-design-calendar",
  "van-design-select"
];

export default function useReportRightMenu(reportType) {
  const componentsConfigs = (reportType === 'pc' ? componentsConfigsPc : componentsConfigsMobile)
  const commonComponentTypes = (reportType === 'pc' ? commonComponentTypesPc : commonComponentTypesMobile)

  let commonComponentConfigs = []
  commonComponentTypes.forEach(type => {
    componentsConfigs.forEach(components => {
      components.forEach(item => {
        if (type === item.type) {
          commonComponentConfigs.push(item);
        }
      });
    });
  });

  function commonComponentListFn(componentList) {
    let list = []
    for (const element of commonComponentConfigs) {
      list.push({
        label: element.name,
        onClick: () => {
          componentList.splice(componentList.length, 0, element) // 页面底部插入
        }
      })
    }
    return list
  }

  return {
    commonComponentListFn
  }

  // return function rightClickMenu(event) {
  //   // this.chooseItemIndex()  //先模拟单击，选中组件
  //   this.$nextTick(function () {
  //     // @ts-ignore
  //     this.$contextmenu({
  //       items: [
  //         {
  //           label: "复制",
  //           onClick: () => {
  //             this.$emit('copyItemIndex')
  //           }
  //         },
  //         {
  //           label: "粘贴",
  //           onClick: () => {
  //             this.$emit('pasteItemIndex')
  //           }
  //         },
  //         {
  //           label: "事件",
  //           children: [
  //             {
  //               label: "点击事件",
  //               onClick: () => {
  //                 // EventBus.$emit('pcEventHandler', 'click')
  //               }
  //             },
  //             {
  //               label: "值变化事件",
  //               onClick: () => {
  //                 // EventBus.$emit('pcEventHandler', 'change')
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           label: "插入",
  //           children: commonComponentList
  //         }
  //       ],
  //       event,
  //       //x: event.clientX,
  //       //y: event.clientY,
  //       customClass: "class-a",
  //       zIndex: 3,
  //       minWidth: 200
  //     });
  //   })
  //   return false;
  // }
}