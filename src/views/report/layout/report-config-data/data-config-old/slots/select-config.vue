<template>
  <div class="selectTypesOpert">
    <!-- 默认手输 -->
    <columnsValuesConfig
      v-if="componentConfig.options.contentDataSource === 'radio-button-default'"
      :columnsConfigs="componentConfig.options.defaultTableData"
      addBtnText="添加"
      itemKey="label"
      :addColumnConfig="addColumnConfig"
    />
    <!-- 数据 -->
    <template v-else>
      <el-input
        placeholder="请输入内容"
        v-model="componentConfig.options.valueKey"
        key="valueKey"
        style="padding-top: 10px"
      >
        <template slot="prepend"
          >值<span style="visibility: hidden">啊</span></template
        >
      </el-input>
      <el-input
        placeholder="请输入内容"
        v-model="componentConfig.options.labelKey"
        key="labelKey"
        style="padding-top: 10px"
      >
        <template slot="prepend">标签</template>
      </el-input>
    </template>
  </div>
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
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
