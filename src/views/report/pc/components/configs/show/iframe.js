import {getStorage,setStorage} from "@/util/storageUtil.js";
/** 分割线 */
let optionsConfig = {
  // 自定义属性
  url: '',
  commonConfigCompWidthUnit: "%",
  commonConfigCompWidth: "100",
  commonConfigCompHeightUnit: "px",
  commonConfigCompHeight: "100",
  commonConfig: {
    leftSpaceDistance: 0,
    rightSpaceDistance: 0,
    bottomSpaceDistance: 0,
    topSpaceDistance: 0
  },
}
export default {
  type: 'van-design-iframe',
  name: 'iframe',
  icon: 'iconhtml',
  // img: button_img,
  component: {
    template: `

      <iframe v-if="options._isGenerateComponent"
              width="100%"
              height="100%"
              :src="options.url + '&token=' + token">
      </iframe>
      <iframe v-else
              width="100%"
              height="100%"
              style="pointer-events: none"
              :src="options.url">
      </iframe>
    `,
    computed: {
      token() {
        return getStorage('token')
      }
    },
    data() {
      return {
        options: optionsConfig
      }
    }
  },
  configList: [
    {
      labelName: '地址',
      formType: 'input',
      key: 'url'
    }
  ],
  options: optionsConfig
}
