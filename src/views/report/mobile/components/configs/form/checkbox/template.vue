<template>
  <van-field
    label-width="80px"
    :border="false"
    :style="{ display: options.labelAlign === 'top' ? 'block' : '' }"
    :class="[options.labelShow ? '' : 'make_custom_label_title']"
    :label="label"
    :labelAlign="options.labelAlign"
    :label-width="options.labelWidth"
    :name="options.databaseField"
  >
    <template #input>
      <template v-if="options.checkStyleType == 'textRound'">
        <ul class="checkBox_textButton_main">
          <li
            v-for="(item, key) in options.contentDataSource ===
            'radio-button-default'
              ? options.columns
              : options.interfaceDataConfig.tableData"
            :key="key"
            :style="[item.checked ? {color: options.selectedColor, borderColor: options.selectedColor} : '']"
            :class="['checkBox_textButton', { checkedBtnStyle: item.checked }]"
            @click="checkedBox(key)"
            v-show="!item.isHide"
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
      <van-checkbox-group
        v-model="options.value"
        :direction="options.direction"
        :icon-size="16"
        v-else
      >
        <van-checkbox
          :shape="options.checkStyleType"
          :name="
            options.contentDataSource === 'radio-button-default'
              ? item.value
              : item[options.valueKey]
          "
          style="margin-bottom: 8px"
          :checked-color="options.selectedColor"
          v-for="(item, key) in options.contentDataSource ===
          'radio-button-default'
            ? options.columns
            : options.interfaceDataConfig.tableData"
          v-show="!item.isHide"
          :key="key"
        >
          {{
            options.contentDataSource === "radio-button-default"
              ? item.label
              : item[options.labelKey]
          }}
        </van-checkbox>
      </van-checkbox-group>
    </template>
  </van-field>
</template>

<script>
import optionsConfig from "./options-config";

export default {
  name: "van-design-checkbox",
  components: {},
  data() {
    return {
      options: optionsConfig,
    };
  },
  watch:{
     'options.defaultTableData':{
       handler:function(val){
         // 这么处理的原因是 移动端和PC端 使用的字段不统一，这边操作是 对PC数据结构的拉平
         this.options.columns=val;
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
  created() {},
  methods: {
    checkedBox(i) {
      if (this.options.contentDataSource === "radio-button-default") {
        this.$set(
          this.options.columns[i],
          "checked",
          !this.options.columns[i].checked
        );
        this.filterData(this.options.columns);
      } else {
        this.$set(
          this.options.interfaceDataConfig.tableData[i],
          "checked",
          !this.options.interfaceDataConfig.tableData[i].checked
        );
        this.filterData(this.options.interfaceDataConfig.tableData);
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
/deep/.van-cell-group {
  background-color: transparent;
}
/deep/.van-cell {
  background-color: transparent;
  min-height: 32px;
  line-height: 32px;
}
</style>
