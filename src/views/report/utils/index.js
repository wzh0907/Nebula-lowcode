export const generateUUID = (prefix) => {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16)
  })
  return (prefix || 'van-') + uuid // 为什么要加van-？因为需要支持自定义class功能，html的class不支持数字开头
}

export const loadJsScript = (scriptText) => {
  return new Promise((resolve, reject) => {
    let scriptDom = document.createElement('script');
    scriptDom.type = 'text/javascript'
    scriptDom.innerHTML = scriptText
    document.body.appendChild(scriptDom)
    scriptDom.onload = () => {
      resolve()
    }
  })
}

export const loadCssStyle = (cssText) => {
  return new Promise((resolve, reject) => {
    let styletDom = document.createElement('style');
    styletDom.innerHTML = cssText
    document.body.appendChild(styletDom)
    styletDom.onload = () => {
      resolve()
    }
  })
}
