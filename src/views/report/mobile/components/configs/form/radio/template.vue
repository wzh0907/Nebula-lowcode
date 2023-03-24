<template>
  <van-field
    :border="false"
    :class="[options.labelShow ? '' : 'make_custom_label_title']"
    :label="label"
    :label-width="options.labelWidth"
    :labelAlign="options.labelAlign"
    :name="options.databaseField"
    :style="{display: options.labelAlign === 'top' ? 'block' : ''}"
    label-width="80px"
  >
    <template #input>
      <template v-if="options.radioStyleType == 'textRound'">
        <ul class="checkBox_textButton_main">
          <li
            v-for="(item, key) in options.contentDataSource ===
              'radio-button-default'
                ? options.columns
                : options.interfaceDataConfig.tableData"
            v-show="!item.isHide"
            :key="key"
            :class="['checkBox_textButton', { checkedBtnStyle: item.checked }]"
            @click="checkedBox(key)"
          >
              <span>
                {{
                  options.contentDataSource === "radio-button-default"
                    ? item.label
                    : item[options.labelKey]
                }}
              </span>
          </li>
        </ul>
      </template>
      <van-radio-group v-else v-model="options.value" :direction="options.direction" :icon-size="16">
        <van-radio
          v-for="(item, key) in (options.contentDataSource==='radio-button-default'?options.columns:options.interfaceDataConfig.tableData)"
          :key="key"
          :name="options.contentDataSource==='radio-button-default'?item.value:item[options.valueKey]"
          :shape="options.radioStyleType"
          :checked-color="options.selectedColor"
          style="margin-bottom: 8px;">
          {{ options.contentDataSource === 'radio-button-default' ? item.label : item[options.labelKey] }}
        </van-radio>
      </van-radio-group>
    </template>
  </van-field>
</template>

<script>
import optionsConfig from './options-config'

export default {
  name: "radioTemplate",
  components: {},
  data() {
    return {
      options: optionsConfig
    };
  },
  watch: {
    'options.defaultTableData': {
      handler: function (val) {
        // 这么处理的原因是 移动端和PC端 使用的字段不统一，这边操作是 对PC数据结构的拉平
        this.options.columns = val;
      },
      deep: true
    },
  },
  computed: {
    label() {
      let language = navigator.language.substr(0, 2)
      if (language == 'zh') {
        return this.options.label || this.options.enLabel
      } else {
        return this.options.enLabel || this.options.label
      }
    }
  },
  created() {
  },
  methods: {
    checkedBox(i) {
      if (this.options.contentDataSource === "radio-button-default") {
        this.clearData(this.options.columns, i);
        this.$set(
          this.options.columns[i],
          "checked",
          !this.options.columns[i].checked
        );
        if (this.options.columns[i].checked) {
          this.options.value = this.options.columns[i].value
        }
        // this.filterData(this.options.columns);
      } else {
        this.clearData(this.options.columns, i);
        this.$set(
          this.options.interfaceDataConfig.tableData[i],
          "checked",
          !this.options.interfaceDataConfig.tableData[i].checked
        );
        if (this.options.interfaceDataConfig.tableData[i].checked) {
          this.options.value = this.options.interfaceDataConfig.tableData[i].value
        }
        // this.filterData(this.options.interfaceDataConfig.tableData);
      }
    },
    clearData(data, index) {
      for (let i = 0; i < data.length; i++) {
        if (i !== index) {
          data[i].checked = false
        }
      }
    },
    filterData(data) {
      this.options.value = [];
      data.forEach((item) => {
        if (item.checked) {
          this.options.value.push(item.value);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
