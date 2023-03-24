<template>
  <div>
    <van-cell-group :border="false">
      <van-field
        type="time"
        v-model="options.value"
        :label-width="options.labelWidth+'px'"
        :border="false"
        :style="{ display: options.labelAlign === 'top' ? 'block' : '' }"
        :class="[options.labelShow ? '' : 'make_custom_label_title']"
        @focus="touchDialog"
        :label="label"
        :placeholder="placeholder"
        :required="options.required"
        :labelAlign="options.labelAlign"
        :input-align="options.valueAlign"
        :clearable="options.clearable"
      />
    </van-cell-group>
  </div>
</template>

<script>
import optionsConfig from "./options-config";
import { generateUUID } from "@/views/report/utils/index";

export default {
  name: "datetimePickerTemplate",
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
  created() {},
  methods: {
    touchDialog() {
      let preloadEventUUID = generateUUID();
      let operateEventNameA = new CustomEvent(
        `on-preload-change-datetime-picker`,
        { detail: { value: true, preloadEventUUID } }
      );
      window.dispatchEvent(operateEventNameA);

      // EventBus.$emit('on-preload-change-datetime-picker', true)
      window.addEventListener(
        `${preloadEventUUID}-on-preload-change-datetime-picker-get-response-data`,
        (res) => {
          let value = res.detail.value;
          this.options.value = value;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.van-cell-group {
  background-color: transparent !important;
}

/deep/.van-cell {
  background-color: transparent;
  padding:0;
  min-height: 30px;
  line-height: 30px;
}
</style>
