import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getParameterByName } from '@/utils/validate'
import {getStorage,setStorage} from "@/util/storageUtil.js";
// import { getToken } from '@/utils/auth'
// import config from './configUrl'
// import store from '@/store'
// import { getStorage } from '@/utils/storage'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

if (getParameterByName('projectSource')) {
  setStorage('token', getParameterByName('token'))
  setStorage('fullName', getParameterByName('userName'))
  setStorage('phoneNumber', getParameterByName('userName'))
  setStorage('projectId', getParameterByName('projectId'))
  setStorage('merchantId', getParameterByName('merchantId'))
}

// request interceptor
service.interceptors.request.use(
  async config => {
    // if (store.getters.token) {
    // config.headers['X-AUTH-TOKEN'] = await getStorage('token')
    // config.headers['X-AUTH-KEY'] = await getStorage('username')
    // }

    // if (store.getters.merchantList && store.getters.merchantList.length) {
    //   config.headers['X-MERCHANT-ID'] = store.getters.merchantList[0].id
    // }
    // if (config.url.indexOf('/role/list') !== -1) {
    //   config.headers['X-AUTH-SOURCE'] = 'PAAS'
    // }
    if (store.getters.merchantId) {
      config.headers['X-MERCHANT-ID'] = store.getters.merchantId
    } else {
      config.headers['X-MERCHANT-ID'] = process.env.VUE_APP_LIB ? getStorage('merchantId') || '' : '';
    }

    if (store.getters.token) {
      config.headers['X-AUTH-TOKEN'] = store.getters.token
      config.headers['X-AUTH-KEY'] = store.getters.phoneNumber
      config.headers['X-AUTH-SOURCE'] = process.env.VUE_APP_LIB ? 'PORTAL_PC' : (getParameterByName('projectSource') ? '' : 'PAAS')
      if (store.getters.projectId) {
        config.headers['X-PROJECT-ID'] = store.getters.projectId
      }else{
        config.headers['X-PROJECT-ID'] =  getStorage('projectId') ;
      }
    } else {
      config.headers['X-AUTH-SOURCE'] = process.env.VUE_APP_LIB ? 'PORTAL_PC' : '';
      config.headers['X-AUTH-TOKEN'] = process.env.VUE_APP_LIB ? getStorage('token') : '';
      config.headers['X-AUTH-KEY'] = process.env.VUE_APP_LIB ? getStorage('phoneNumber') : '';
      config.headers['X-PROJECT-ID'] = process.env.VUE_APP_LIB ? getStorage('projectId') : '';
    }

    if (store.getters.username) {
      config.headers['x-login-username'] = encodeURI(store.getters.username)
      config.headers['x-login-code'] = store.getters.thirdUserId
    }

    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.config && response.config.url.includes('v1/data/api')) {
      let interfaceList = JSON.parse(getStorage('interfaceList')) || []
      if (JSON.stringify(interfaceList).length > 5000000) {
        interfaceList = [];
      }
      // 防止大量查询数据 塞入 localStorage
      if (JSON.stringify(response.data).length < 100000) {
        interfaceList.unshift(response)
        if (interfaceList.length > 20) {
          interfaceList = interfaceList.slice(0, 20)
        }
        setStorage('interfaceList', JSON.stringify(interfaceList))
      }

    }
    if (res.code !== 0) {
      if (res.code === 50000) {
        // eslint-disable-next-line no-undef
        MessageBox.confirm('登录过期,请重新登录', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          // window.location.href = config.host
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.message || '请求失败',
          type: 'error',
          duration: 5 * 1000
        })
      }

      // 接口异常状态处理
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('登录过期，请重新登录', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('********');
    console.log(error);
    console.log('********');
    let interfaceList = JSON.parse(getStorage('interfaceList')) || []
    interfaceList.unshift(error)
    if (interfaceList.length > 20) {
      interfaceList = interfaceList.slice(0, 20)
    }
    setStorage('interfaceList', JSON.stringify(interfaceList))

    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
