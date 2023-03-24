import {getStorage,setStorage} from "@/util/storageUtil.js";
const hasPermission = {
  install(Vue, options) {
    Vue.directive('has', {
      inserted: (el, binding, vnode) => {
        filterGlobalPermission(el, binding, vnode);
      }
    });
  }
};

/**
 * 全局权限控制
 */
export function filterGlobalPermission(el, binding, vnode) {
  const str = getStorage('permissionList') || '[]'
  let permissions = JSON.parse(str)
  if (!permissions.includes(binding.value)) {
    el.parentNode.removeChild(el);
  }
}

export default hasPermission;
