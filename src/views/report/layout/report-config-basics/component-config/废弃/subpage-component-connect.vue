<template>
  <div>
    <el-cascader
      v-model="chooseValue"
      :options="optionsDataList"
      @change="onChangeValue"
    >
    </el-cascader>
  </div>
</template>

<script>
import { transformComponentListTreeToPlan } from "@/views/report/utils/deal-component-data/transform-component-list";
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
    return {
      chooseValue: "",
      optionsDataList: [],
    };
  },
  watch: {
    subpageList: {
      immediate: true,
      handler(vals) {
        this.optionsDataList = [];
        vals.forEach((item, index) => {
          let childrenList = [];
          let listTemp = [];
          this.transformComponentListTreeToPlan(item.list, listTemp);
          listTemp.forEach((itemTemp) => {
            childrenList.push({
              label: itemTemp.options.commonConfigAssignName,
              value: itemTemp,
            });
          });
          // 生成配置
          this.optionsDataList.push({
            label: `子页面 #${index}`,
            value: index,
            children: childrenList,
          });
        });
      },
    },
  },
  created() {},
  methods: {
    onChangeValue() {},
    transformComponentListTreeToPlan,
  },
};
</script>

<style lang="scss" scoped>
</style>
