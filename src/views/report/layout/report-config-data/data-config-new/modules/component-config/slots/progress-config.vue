<template>
  <el-form size="small">
    <!-- 默认手输 -->
    <div
      v-if="
        componentConfig.options.contentDataSource === 'radio-button-default'
      "
    >
      <!-- 数值输入按钮 -->
      <el-input
        size="small"
        type="number"
        placeholder="请输入最大值"
        v-model.number="componentConfig.options.maxValue"
        key="maxValue"
        style="padding-top: 10px"
      >
        <template slot="prepend">最大值</template>
      </el-input>
      <el-input
        size="small"
        type="number"
        placeholder="请输入进度值"
        v-model.number="componentConfig.options.rateValue"
        key="rateValue"
        style="padding-top: 10px"
      >
        <template slot="prepend">进度值</template>
      </el-input>
    </div>
    <!-- 数据 -->
    <template v-else>
      <el-form-item>
        <span>最大值：</span>
        <el-select
          v-model="componentConfig.options.interfaceDataConfig.maxKey"
          placeholder="请选择最大值"
          style="padding-top: 10px"
          key="maxValue"
          @change="chooseMaxValue"
        >
          <el-option
            v-for="(value, key) in componentConfig.options.interfaceDataConfig.tableData"
            :key="key"
            :label="key"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <span>进度值：</span>
        <el-select
          v-model="componentConfig.options.interfaceDataConfig.rateKey"
          placeholder="请选择进度值"
          style="padding-top: 10px"
          key="value"
          @change="chooseRateValue"
        >
          <el-option
            v-for="(value, key) in componentConfig.options.interfaceDataConfig.tableData"
            :key="key"
            :label="key"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-input
        v-if="
          componentConfig.options.contentDataSource === 'radio-button-default'
        "
        type="number"
        placeholder="请输入进度值"
        v-model.number="componentConfig.options.rateValue"
        key="rateValue"
        style="padding-top: 10px"
      >
        <template slot="prepend">进度值</template>
      </el-input>
    </template>
  </el-form>
</template>

<script>
import columnsValuesConfig from "@/views/report/layout/report-config-basics/basics-config/columns-values-config";
export default {
  name: "select-config",
  components: {
    columnsValuesConfig,
  },
  props: {
    componentConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      addColumnConfig: {
        label: "",
        value: "",
      },
      maxKey: "",
      currentKey: "",
    };
  },

  methods: {
    chooseMaxValue(key) {
      let currentValue = this.componentConfig.options.interfaceDataConfig
        .tableData[key];
      this.componentConfig.options.interfaceDataConfig.maxValue = Number(
        currentValue
      );
    },
    chooseRateValue(key) {
      let rateValue = this.componentConfig.options.interfaceDataConfig
        .tableData[key];
      this.componentConfig.options.interfaceDataConfig.rateValue = Number(
        rateValue
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
