// @ts-nocheck
export function deepClone (obj, valueType = {}, isDeleteAttr = false) {
  let target = valueType;
  // 遍历 复制数组或对象
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] && typeof obj[key] === 'object') {
        let container = {}
        if (typeof obj[key].push === 'function') {
          container = []
        }
        target[key] = deepClone(obj[key], container, isDeleteAttr);
      } else {
        target[key] = obj[key];
      }
    }
  }
  // 组件data与options引用同一对象
  // TODO::: 待优化，可能有bug，没有深层过滤，需要移到上面的循环中过滤
  // if (target && target.component && target.options && (target.component.data || target.component.template)) {
  //   target.component.data = () => {
  //     return {
  //       options: target.options
  //     };
  //   };
  // }
  return target;
}
