<template>
  <div class="custom_total_form_component">
    <label
      :class="options.required ? 'required' : ''"
      :style="{
          display:options.labelShow?'':'none',
          width:options.labelAlign=='top'?'100%':options.width+ 'px',textAlign:options.labelAlign=='top'?'left':options.labelAlign,
          lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'
        }"
    >{{label}}</label>
    <div
      :style="{marginLeft:(options.labelAlign=='top' || !options.labelShow)?'':options.width+ 'px'}"
    >
      <a-range-picker
        v-model="value"
        :size="options.size"
        :format="options.format"
        :disabled="options.disabled"
        :allowClear="options.clearable"
        :defaultValue="interfaceDataValue"
        :disabled-date="disabledDate"
        @change="onChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import optionsConfig from './options-config'

export default {
  name: 'DateRangePickerTemplate',
  components: {},
  data() {
    return {
      moment: moment,
      options: optionsConfig
    }
  },
  computed: {
    value() {
      const optionsValue = this.options.value
      return optionsValue && optionsValue.length === 2
        ? [
            moment(optionsValue[0], this.options.format),
            moment(optionsValue[1], this.options.format)
          ]
        : null
    },
    placeholder() {
      const language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.placeholder || this.options.enPlaceHolder
      } else {
        return this.options.enPlaceHolder || this.options.placeholder
      }
    },
    label() {
      const language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.label || this.options.enLabel
      } else {
        return this.options.enLabel || this.options.label
      }
    },
    interfaceDataValue: {
      get() {
        if (
          this.options.interfaceDataConfig.uuid &&
          this.options.interfaceDataConfig.uuid != ''
        ) {
          this.options.value = this.options.interfaceDataConfig.value
          return this.options.interfaceDataConfig.value&&this.options.interfaceDataConfig.value.length > 0
            ? [
                moment(
                  this.options.interfaceDataConfig.value[0],
                  this.options.format
                ),
                moment(
                  this.options.interfaceDataConfig.value[1],
                  this.options.format
                )
              ]
            : null
        }
        return this.options.value&&this.options.value.length > 0
          ? [
              moment(this.options.value[0], this.options.format),
              moment(this.options.value[1], this.options.format)
            ]
          : null
      },
      set(val) {}
    }

    // return this.options.value.length > 0 ? moment(this.options.value, this.options.format) : null
  },
  mounted() {
    const day = new Date()
    // getDate表示几号，getDay表示周几
    const today =
      day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
    const monday =
      day.getFullYear() +
      '-' +
      (day.getMonth() + 1) +
      '-' +
      (day.getDate() - day.getDay() + 1)
    const monthStart =
      day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + '1'
    if (this.options.defaultValueType == 'Today') {
      this.options.value = today
    } else if (this.options.defaultValueType == 'Monday') {
      this.options.value = monday
    } else if (this.options.defaultValueType == 'MonthStart') {
      this.options.value = monthStart
    }
  },
  methods: {
    disabledDate(current) {
      if (this.options.forbidRange === 'before') {
        return current && current < moment().endOf('day')
      } else if (this.options.forbidRange === 'after') {
        return current && current > moment().endOf('day')
      } else {
        return false
      }
    },
    onChange(time, timeString) {
      this.options.value = timeString
      // console.log('time, timeString', time, timeString)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
