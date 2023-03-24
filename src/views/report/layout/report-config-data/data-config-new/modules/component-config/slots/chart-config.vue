<template>
  <!-- 图表配置 -->
  <el-form size="small">
    <el-form-item v-if="selectedChartDataList.length">
      <span>横轴：</span>
      <el-select
        v-model="interfaceDataConfig.chartSettings.dimension"
        placeholder="请选择"
        :multiple="
          typeof interfaceDataConfig.chartSettings.dimension === 'object'
        "
      >
        <el-option
          v-for="(value, key) in selectedChartDataList[0]"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="padding-top: 10px" v-if="selectedChartDataList.length">
      <span>纵轴：</span>
      <el-select
        v-model="interfaceDataConfig.chartSettings.metrics"
        placeholder="请选择"
        :multiple="
          typeof interfaceDataConfig.chartSettings.metrics === 'object'
        "
        key="metrics"
      >
        <el-option
          v-for="(value, key) in selectedChartDataList[0]"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="padding-top: 10px"
                  v-if="selectedChartDataList.length &&
                  !!interfaceDataConfig.stack">
      <span>堆叠：</span>
      <el-select
        v-model="interfaceDataConfig.stack"
        placeholder="请选择"
        :multiple="
          typeof interfaceDataConfig.stack === 'object'
        "
        key="stack"
      >
        <el-option
          v-for="(value, key) in selectedChartDataList[0]"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      style="padding-top: 10px"
      v-if="
        selectedChartDataList.length &&
        !!interfaceDataConfig.chartSettings.showLine
      "
    >
      <span>线性：</span>
      <el-select
        v-model="interfaceDataConfig.chartSettings.showLine"
        placeholder="请选择"
        multiple
        key="showLine"
      >
        <el-option
          v-for="(value, key) in selectedChartDataList[0]"
          :key="key"
          :label="key"
          :value="key"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      style="padding-top: 10px"
      v-if="
        selectedChartDataList.length &&
        !!interfaceDataConfig.chartSettings.yAxisType
      "
    >
      <span>纵轴数据类型：</span>
      <el-select style="width: 130px" v-model="interfaceDataConfig.yAxisType" placeholder="请选择">
        <el-option
          v-for="item in axisType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      style="padding-top: 10px"
      v-if="
        selectedChartDataList.length &&
        !!interfaceDataConfig.chartSettings.xAxisType
      "
    >
      <span>横轴数据类型：</span>
      <el-select style="width: 130px" v-model="interfaceDataConfig.xAxisType" placeholder="请选择">
        <el-option
          v-for="item in axisType"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  components: {},
  props: {
    interfaceDataConfig: {
      type: Object,
      default: {},
    },
    selectedChartDataList: {
      type: Array,
      default: []
    },

  },
  data() {
    return {
      axisType: [{
        value: 'normal',
        label: '常规'
      }, {
        value: 'percent',
        label: '百分比'
      }, {
        value: 'KMB',
        label: 'KMB'
      }]
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style scoped lang="scss">
</style>
