<template>
  <div>
    <el-select
      placeholder="请选择"
      size="mini"
      style="width: 178px"
      v-model="componentConfig.options.subPageConfigIndex"
      @change="onChangeValue"
    >
      <el-option
        v-for="(item, key) in subpageList"
        :key="key"
        :label="'子页面 #' + (key + 2)"
        :value="key"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  components: {},
  watch: {},
  props: {
    componentConfig: {
      type: Object,
      default: () => {},
    },
    subpageList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onChangeValue(index) {
      this.componentConfig.options.subPageConfigList = this.subpageList[index].list;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
