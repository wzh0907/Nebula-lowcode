<template>
<!--  <van-cell-group>-->
<!--    <van-field-->
<!--      type="time"-->
<!--      v-model="options.value"-->
<!--      :style="{ display: options.labelAlign === 'top' ? 'block' : '' }"-->
<!--      :class="[options.labelShow ? '' : 'make_custom_label_title']"-->
<!--      @focus="touchDialog"-->
<!--      :label="options.label"-->
<!--      :placeholder="options.placeholder"-->
<!--      :required="options.required"-->
<!--      :labelAlign="options.labelAlign"-->
<!--      :clearable="options.clearable"-->
<!--    />-->
<!--  </van-cell-group>-->
  <div class="custom_total_form_component">
    <label
      :style="{
          display:options.labelShow?'':'none',
          width:options.labelAlign=='top'?'100%':options.width+ 'px',textAlign:options.labelAlign=='top'?'left':options.labelAlign,
          lineHeight:options.size=='large'?'40px':options.size=='small'?'24px':'32px'
        }"
    >
      {{label}}
    </label>
    <a-time-picker
      :placeholder="placeholder"
      :size="options.size"
      :allowClear="options.clearable"
      :format="options.format"
      :value="defaultValue"
      :defaultValue="ndefaultValue"
      @change="onChange"
    />
  </div>
</template>

<script>
import moment from 'moment';
import optionsConfig from "./options-config";

export default {
  name: "dataTimePickerTemplate",
  components: {},
  data() {
    return {
      moment: moment,
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
    defaultValue() {
      return this.options.value.length > 0 ? moment(this.options.value, this.options.format) : null
    },
    ndefaultValue: {
        get() {
          if (this.options.interfaceDataConfig.uuid && this.options.interfaceDataConfig.uuid != '') {
            this.options.value=this.options.interfaceDataConfig.value;
            return this.options.interfaceDataConfig.value.length > 0 ? moment(this.options.interfaceDataConfig.value, this.options.format) : null
          }
          return this.options.value.length > 0 ? moment(this.options.value, this.options.format) : null
        },
        set(val) {
        }
      }
  },
  created() {},
  methods: {
    onChange(time, timeString) {
      this.options.value = timeString
      console.log(time, timeString);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
