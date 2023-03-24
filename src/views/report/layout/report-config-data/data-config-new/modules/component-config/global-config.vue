<template>
  <div>
    <!-- 全局配置 -->
    <div>
      <span style="font-weight: bold">全局变量</span>
      <div>
        <el-select
          v-model="
            componentConfig.options.interfaceDataConfig.globalBindDataKey
          "
          filterable
          placeholder="请选择"
          style="padding-top: 10px"
          @change="onChangeBindDataKey"
          size="small"
        >
          <el-option
            v-for="(value, key) in globalVariables"
            :key="key"
            :label="value.variableKey"
            :value="value.variableKey"
          >
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    componentConfig: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      globalVariables: [],
    };
  },
  created() {
    this.globalVariables = this.$store.getters.globalVariables;
  },
  methods: {
    onChangeBindDataKey() {},
  },
};
</script>
<style scoped lang="scss">
/deep/.el-cascader .el-input .el-input__inner::-webkit-input-placeholder {
  color: #333;
}
</style>
