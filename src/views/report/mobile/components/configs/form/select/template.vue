<template>
  <div>
    <van-cell-group :border="false">
      <van-field
        readonly
        clickable
        :label-width="options.labelWidth"
        :labelAlign="options.labelAlign"
        :input-align="options.valueAlign"
        :class="[options.labelShow ? '' : 'make_custom_label_title']"
        :border="false"
        :label="label"
        :placeholder="placeholder"
        v-model="options.pickerValue"
        @click="touchDialog"
      />
    </van-cell-group>
    <van-popup v-model="options.show" position="bottom" round>
      <van-picker
        :columns="options.columnsStrArr"
        show-toolbar
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import optionsConfig from "./options-config";

export default {
  name: "selectTemplate",
  components: {},
  data() {
    return {
      options: optionsConfig,
    };
  },
  watch: {
    "options.defaultTableData": {
      deep: true,
      handler() {
        if (
          this.options.contentDataSource === "radio-button-default" &&
          this.options.defaultTableData.length
        ) {
          this.options.columnsStrArr = [];
          this.options.defaultTableData.forEach((item) => {
            this.options.columnsStrArr.push(item.label);
          });
        }
      },
    },
    "options.interfaceDataConfig.tableData": {
      handler(vals) {
        this.options.columnsStrArr = [];
        vals &&
          vals.length &&
          vals.forEach((item) => {
            this.options.columnsStrArr.push(item[this.options.labelKey]);
          });
      },
    },
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
    }
  },
  created() {},
  methods: {
    touchDialog() {
      this.options.show = true;
    },
    onCancel() {
      this.options.show = false;
    },
    onConfirm(value, index) {
      this.options.show = false;
      this.options.pickerValue = value;
      if (this.options.contentDataSource === "radio-button-default") {
        this.options.value = this.options.defaultTableData[index].value;
      } else {
        this.options.value = this.options.interfaceDataConfig.tableData[index][
          this.options.valueKey
        ];
      }
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
