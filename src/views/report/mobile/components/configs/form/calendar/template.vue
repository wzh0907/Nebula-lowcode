<template>
  <div>
    <van-cell-group :border="false">
      <van-field
        v-model="options.value"
        @focus="touchDialog"
        :border="false"
        :label="label"
        :label-width="options.labelWidth+'px'"
        :placeholder="placeholder"
        :required="options.required"
        :labelAlign="options.labelAlign"
        :input-align="options.valueAlign"
        :style="{ display: options.labelAlign === 'top' ? 'block' : '' }"
        :class="[options.labelShow ? '' : 'make_custom_label_title']"
        :clearable="options.clearable"
      />
    </van-cell-group>
  </div>

</template>

<script>
import optionsConfig from "./options-config";
import { generateUUID } from "@/views/report/utils/index";

export default {
  name: "calendarTemplate",
  components: {},
  data() {
    return {
      options: optionsConfig,
    };
  },
  computed: {
    placeholder() {
      let language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.placeholder || this.options.enPlaceHolder
      } else {
        return this.options.enPlaceHolder || this.options.placeholder
      }
    },
    label() {
      let language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.label || this.options.enLabel
      } else {
        return this.options.enLabel || this.options.label
      }
    },
  },
  watch: {},
  created() {
    let nowDate = new Date(); // 当前日期
    let nowMonth = nowDate.getMonth(); // 当前月
    let nowYear = nowDate.getFullYear(); // 当前年
    var nowTime = nowDate.getTime();
    var nowDay = nowDate.getDay();
    var oneDayTime = 24 * 60 * 60 * 1000;
    let MondayTime = nowTime - (nowDay - 1) * oneDayTime; // 周一
    let SundayTime =  nowTime + (7 - nowDay) * oneDayTime; // 周日
    // 本月的开始时间
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    // 本月的结束时间
    let monthEndDate = new Date(nowYear, nowMonth + 1, 0);
    // 本周一
    let MondayDate = new Date(MondayTime);
    // 本周日
    let SundayDate = new Date(SundayTime);
    // console.log('xxxx', this.options.defaultValueType, MondayDate)
    // 判断类型显示日期
    if (this.options.defaultValueType === 'Today') {
      this.options.value = this.formatDate(new Date())
    } else if (this.options.defaultValueType === 'Monday') {
      this.options.value = this.formatDate(MondayDate)
    } else if (this.options.defaultValueType === 'Sunday') {
      this.options.value = this.formatDate(SundayDate)
    } else if (this.options.defaultValueType === 'MonthStart') {
      this.options.value = this.formatDate(monthStartDate)
    } else if (this.options.defaultValueType === 'MonthEnd') {
      this.options.value = this.formatDate(monthEndDate)
    }
  },
  mounted() {},
  methods: {
    touchDialog() {
      let preloadEventUUID = generateUUID();
      let operateEventNameA = new CustomEvent(
        "on-preload-change-calendar-type",
        { detail: { value: this.options.calendarType, preloadEventUUID } }
      );
      let operateEventNameB = new CustomEvent("on-preload-change-calendar", {
        detail: { value: true, preloadEventUUID },
      });
      window.dispatchEvent(operateEventNameA);
      window.dispatchEvent(operateEventNameB);

      // EventBus.$emit('on-preload-change-calendar-type', this.options.calendarType)
      // EventBus.$emit('on-preload-change-calendar', true)
      window.addEventListener(
        `${preloadEventUUID}-on-preload-change-calendar-get-response-data`,
        (res) => {
          // console.log(res)
          let resDate = res.detail.value;
          if (this.options.calendarType === "single") {
            this.options.value = `${resDate.getFullYear()}-${
              resDate.getMonth() + 1
            }-${resDate.getDate()}`;
          } else if (this.options.calendarType === "range") {
            const [start, end] = resDate;
            this.options.value = `${this.formatDate(start)} - ${this.formatDate(
              end
            )}`;
          } else if (this.options.calendarType === "multiple") {
            this.options.value = `选择了 ${resDate.length} 个日期`;
          }
        }
      );
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.van-cell-group {
  background-color: transparent;
}
/deep/.van-cell {
  background-color: transparent;
  padding:0;
  height: 32px;
  line-height: 32px;
}
</style>
