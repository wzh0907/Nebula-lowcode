// 接口状态
const serviceReadyStatusMap = {
  queryReductionItemServiceStatus: false,
  queryDataTableInfoServiceStatus: false
}

// 注册事件
let readyQueryReductionItemServiceEvent = new Event('readyQueryReductionItemServiceEvent')
let readyQueryDataTableInfoEvent = new Event('readyQueryDataTableInfoEvent')
let previewDataButtonEvent = new Event('previewDataButtonEvent') // 点击预览数据按钮事件
let saveDataButtonEvent = new Event('saveDataButtonEvent') // 点击预览数据按钮事件

// 监听事件
window.addEventListener('readyQueryReductionItemServiceEvent', () => {
  serviceReadyStatusMap.queryReductionItemServiceStatus = true
})
window.addEventListener('readyQueryDataTableInfoEvent', () => {
  serviceReadyStatusMap.queryDataTableInfoServiceStatus = true
})

export {
  serviceReadyStatusMap,
  readyQueryReductionItemServiceEvent,
  readyQueryDataTableInfoEvent,
  previewDataButtonEvent,
  saveDataButtonEvent
}
