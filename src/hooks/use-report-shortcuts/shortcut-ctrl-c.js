/**
 * Ctrl+C快捷键
 * 复制当前选中的组件
 * @param {*} currentWidgetComponentConfig 
 */
export default function fnCtrlC(currentWidgetComponentConfig) {
  // console.log("Ctrl+C is pressed.");
  // 直接把 这个le 放到storage里面
  setStorage("clipboard", JSON.stringify(currentWidgetComponentConfig))
}
