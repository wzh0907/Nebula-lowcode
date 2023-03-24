import fnCtrlC from './shortcut-ctrl-c'
import fnCtrlV from './shortcut-ctrl-v'
import fnCtrlUp from './shortcut-ctrl-up'
import fnCtrlDown from './shortcut-ctrl-down'
import fnCtrlD from './shortcut-ctrl-d'
import fnCtrlS from './shortcut-ctrl-s'
import fnCtrlP from './shortcut-ctrl-p'

/**
 * Ctrl+C、V 复制粘贴功能
 * @param {ref[Array]} componentList 页面全部组件
 * @param {ref[Object]} currentWidgetComponentConfig 当前选中组件
 * @param {ref[Object]} componentsConfigs 用于补全组件属性
 * @param {function} savePageFn 保存页面
 * @param {function} previewFn 预览页面
 * @todo 为什么是value，这里借鉴Vue3的ref思路
 */
export default function useReportCtrlCv(_vm, savePageFn, previewFn) {
  document.body.onkeydown = (ev) => {
    const componentList = _vm['componentList']
    const currentWidgetComponentConfig = _vm['currentWidgetComponentConfig']
    const componentsConfigs = _vm['componentsConfigs']

    // 所有的组件都有options属性，如果没有，说明它不是组件
    if (!currentWidgetComponentConfig.options) {
      // 如果没有选中组件，onkeydown事件不做任何处理
      return
    }

    // function to check the detection
    ev = ev || window.event;  // Event object 'ev'
    const key = ev.which || ev.keyCode; // Detecting keyCode
    // Detecting Ctrl
    const ctrl = ev.ctrlKey ? ev.ctrlKey : (key === 17);
    // console.log(key)

    if (ctrl) {
      if (key === 86) {
        fnCtrlV(currentWidgetComponentConfig, componentsConfigs, componentList)
      } else if (key === 67) {
        fnCtrlC(currentWidgetComponentConfig)
      } else if (key === 38) {
        fnCtrlUp(currentWidgetComponentConfig, componentList)
      } else if (key === 40) {
        fnCtrlDown(currentWidgetComponentConfig, componentList)
      } else if (key === 46) { // 68: d、46: delete 由于ctrl d 与浏览器快捷键冲突，这里用ctrl delete键临时替代
        fnCtrlD(_vm, currentWidgetComponentConfig, componentList)
      }

      // 页面级
      if (key === 83) {
        // fnCtrlS()
        savePageFn()
      } else if (key === 80) {
        // fnCtrlP()
        previewFn()
      }

      ev.preventDefault();
      return false;
    }
  }
  // document.body.addEventListener("keydown", (ev) => {
  //   const componentList = _vm['componentList']
  //   const currentWidgetComponentConfig = _vm['currentWidgetComponentConfig']
  //   const componentsConfigs = _vm['componentsConfigs']

  //   // function to check the detection
  //   ev = ev || window.event;  // Event object 'ev'
  //   const key = ev.which || ev.keyCode; // Detecting keyCode
  //   // Detecting Ctrl
  //   const ctrl = ev.ctrlKey ? ev.ctrlKey : (key === 17);
  //   // console.log(key)

  //   if (ctrl) {
  //     if (key === 86) {
  //       fnCtrlV(currentWidgetComponentConfig, componentsConfigs, componentList)
  //     } else if (key === 67) {
  //       fnCtrlC(currentWidgetComponentConfig)
  //     } else if (key === 38) {
  //       fnCtrlUp(currentWidgetComponentConfig, componentList)
  //     } else if (key === 40) {
  //       fnCtrlDown(currentWidgetComponentConfig, componentList)
  //     } else if (key === 68) { // 68 由于ctrl d 与浏览器快捷键冲突，这里用f键临时替代
  //       fnCtrlD(_vm, currentWidgetComponentConfig, componentList)
  //     }

  //     // 页面级
  //     if (key === 83) {
  //       // fnCtrlS()
  //       savePageFn()
  //     } else if (key === 80) {
  //       // fnCtrlP()
  //       previewFn()
  //     }

  //     ev.preventDefault();
  //     return false;
  //   }
  // }, false);
}
