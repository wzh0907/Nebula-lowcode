<template>
  <div>
    <!-- 日历组件 -->
    <van-calendar
      v-model="isShowVantCalendar"
      @confirm="onCalendarConfirm"
      :type="calendarType"
      :min-date="calendarMinDate"
      :max-date="calendarMaxDate"
    />
    <!-- 时间组件 -->
    <van-popup v-model="isShowVantDatetimePicker" position="bottom">
      <van-datetime-picker
        @confirm="onDatetimePickerConfirm"
        @cancel="onDatetimePickerCancel"
        type="time"
        title="选择时间"
        :min-date="datetimePickerMinDate"
        :max-date="datetimePickerMaxDate"
      />
    </van-popup>
    <!-- 弹窗组件 -->
    <van-popup v-model="isShowPopup" :style="popupConfig.widthHeightConfig" :position="popupConfig.position || ''">
      <p class="popup-title" v-if="popupConfig.title">{{ popupConfig.title }}</p>
      <div style="overflow: hidden;">
        <div v-for="(item, key) in popupSubPageConfigList" :key="key">
          <DynamicComponent
            :componentConfig="item"
            :key="key"
            :elIndex="key"
          />
        </div>
      </div>
      <!-- <div style="text-align: center; padding: 10px 0px;">
        <van-button type="default" size="small" @click="isShowPopup = false">取 消</van-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button type="default" size="small" @click="isShowPopup = false">确 定</van-button>
      </div> -->
    </van-popup>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import WatchPageEvent from '@/views/report/utils/deal-component-event/watch-page-event'
// import { componentDeepClone } from '@/views/report/utils/deal-component-data/component-deep-clone'
import { transformComponentListTreeToPlan } from '@/views/report/utils/deal-component-data/transform-component-list'
import { removeLocalData, saveAndUpdateLocalData } from '@/views/report/utils/deal-data-cache/index'
import DynamicComponent from "./dynamic-component.vue";
// import {
//   getProcesseDataList,
//   getOpenDatasetResult,
//   getOpenDataTableResult
// } from '@/api/chartsData.js'
import {
  dataSaveV4Service
} from "@/api/database";

export default {
  name: "generate-preload-component",
  props: [
    'isGenerateModel',
    'componentList',
    'subpageList',
    'generateComponentsUUID'
  ],
  components: {
    DynamicComponent
  },
  data() {
    return {
      preloadEventUUID: '',
      calendarType: 'single',
      isShowVantCalendar: false,
      isShowVantDatetimePicker: false,
      isShowPopup: false,
      calendarMinDate: new Date(2020, 1, 1),
      calendarMaxDate: new Date(2022, 1, 1),
      datetimePickerMinDate: new Date(1970, 1, 1),
      datetimePickerMaxDate: new Date(3000, 10, 1),
      uuidComponentList: [],
      popupSubPageConfigList: [],
      popupConfig: {
        title: '',
        position: '',
        widthHeightConfig: {
          width: '',
          height: '30%'
        }
      }
    };
  },
  created() {
    window.addEventListener('on-preload-change-calendar', (res: any) => {
      let value = res.detail.value
      this.preloadEventUUID = res.detail.preloadEventUUID
      this.isShowVantCalendar = value
    })
    window.addEventListener('on-preload-change-calendar-type', (res: any) => {
      let value = res.detail.value
      this.preloadEventUUID = res.detail.preloadEventUUID
      this.calendarType = value
    })
    window.addEventListener('on-preload-change-datetime-picker', (res: any) => {
      let value = res.detail.value
      this.preloadEventUUID = res.detail.preloadEventUUID
      this.isShowVantDatetimePicker = value
    })
    if (this.isGenerateModel) {
      this.onHandleAllEvent()
    }
    // 获取组件uuid: obj列表
    let tempArr = []
    this.transformComponentListTreeToPlan(this.componentList, tempArr)
    this.uuidComponentList = tempArr
  },
  mounted() {},
  beforeDestroy(){
    this.onRemoveAllEvent()
  },
  methods: {
    onCalendarConfirm(date){
      this.isShowVantCalendar = false
      let operateEventNameA = new CustomEvent(`${this.preloadEventUUID}-on-preload-change-calendar-get-response-data`, {detail: {value: date}})
      window.dispatchEvent(operateEventNameA)
      // EventBus.$emit('on-preload-change-calendar-get-response-data', date)
    },
    onDatetimePickerConfirm(date){
      this.isShowVantDatetimePicker = false
      let operateEventNameA = new CustomEvent(`${this.preloadEventUUID}-on-preload-change-datetime-picker-get-response-data`, {detail: {value: date}})
      window.dispatchEvent(operateEventNameA)
      // EventBus.$emit('on-preload-change-datetime-picker-get-response-data', date)
    },
    onDatetimePickerCancel(){
      this.isShowVantDatetimePicker = false
    },
    // 监听所有操作类型的事件
    onHandleAllEvent(){
      window.addEventListener(`${this.generateComponentsUUID}-on-preload-handle-btn-confirm`, this.handleEventFunc)
      window.addEventListener(`${this.generateComponentsUUID}-on-preload-handle-form-confirm`, this.handleFormConfirmEventFunc)
      // input搜索功能
      window.addEventListener(`${this.generateComponentsUUID}-on-preload-handle-btn-search`, this.handleSearchEventFunc)
    },
    handleFormConfirmEventFunc(resData){
      let eventDataPackage = resData.detail.data
      dataSaveV4Service(eventDataPackage).then(res => {
      })
    },

    handleSearchEventFunc(resData) {
      let eventDataPackage = resData.detail.data
      this.delSearchData(this.uuidComponentList,eventDataPackage)
    },
    // 处理搜索数据'
    delSearchData(data,options) {
      let arr = [] as any
      data.forEach(item => {
        if (options.searchDataList.indexOf(item.uuid) !==-1) {
           //默认值
           if (item.options.contentDataSource === 'radio-button-default') {
              if (item.options.columns && item.options.columns.length) {
                  item.options.columns.forEach(params => {
                      if (params.label.indexOf(options.value) > -1) {
                        this.$set(params, 'isHide', false)
                      } else {
                        this.$set(params, 'isHide', true)
                      }
                  })
              }
           } else {
              if (item.options.interfaceDataConfig.tableData && item.options.interfaceDataConfig.tableData.length) {
                item.options.interfaceDataConfig.tableData.forEach(params => {
                    if (params[item.options.labelKey].indexOf(options.value) > -1) {
                       this.$set(params, 'isHide', false)
                    } else {
                       this.$set(params, 'isHide', true)
                    }
                })
              }
           }
        }
      })
    },
    // savePageParamsLocalData(hrefPageParams){
    //   if (!hrefPageParams || !hrefPageParams.length) return false
    //   let objTemp = {}
    //   hrefPageParams.forEach(hrefPageParamItem => {
    //     let operateHrefPageParamName = hrefPageParamItem.operateHrefPageParamName || ''
    //     let operateHrefPageParamValue = hrefPageParamItem.operateHrefPageParamValue || ''
    //     objTemp[operateHrefPageParamName] = operateHrefPageParamValue
    //   })
    //   removeLocalData()
    //   saveAndUpdateLocalData('hrefPageParams', objTemp)
    // },
    handleEventFunc(resData){
      let watchPageEvent = new WatchPageEvent(this, this.componentsConfigs, this.subpageList, this.uuidComponentList, this.popupConfig, 'MOBILE')
      watchPageEvent.init(resData)
    },
    transformComponentListTreeToPlan,
    // 移除所有事件
    onRemoveAllEvent(){
      window.removeEventListener(`${this.generateComponentsUUID}-on-preload-handle-btn-confirm`, this.handleEventFunc)
      window.removeEventListener(`${this.generateComponentsUUID}-on-preload-handle-form-confirm`, this.handleFormConfirmEventFunc)
      window.removeEventListener(`${this.generateComponentsUUID}-on-preload-handle-form-confirm`, this.handleSearchEventFunc)
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-title {
  margin: 0;
  padding: 10px 0px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>
