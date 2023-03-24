<template>
  <div>
    <el-select v-model="componentConfig.options[config.key].algorithm" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div style="display: flex; margin-top: 8px"
         v-if="componentConfig.options[config.key].algorithm == 'polynomial'">
      多项式阶数
      <el-select style="margin-left: 8px; width: 113px"
                 v-model="componentConfig.options[config.key].order"
                 placeholder="请选择">
        <el-option
          v-for="item in order"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: "regression-charts",
  components: {},
  props: ['componentConfig','componentConfigKey', 'config'],
  data() {
    return {
      options: [{
        label: '无',
        value: 'none'
      }, {
        label: '线性回归',
        value: 'linear'
      }, {
        label: '指数回归',
        value: 'exponential'
      }, {
        label: '对数回归',
        value: 'logarithmic'
      }, {
        label: '多项式回归',
        value: 'polynomial'
      }],
      order: [{
        label: '2',
        value: 2
      }, {
        label: '3',
        value: 3
      }, {
        label: '4',
        value: 4
      }, {
        label: '5',
        value: 5
      }, {
        label: '6',
        value: 6
      }, {
        label: '7',
        value: 7
      }, {
        label: '8',
        value: 8
      }, {
        label: '9',
        value: 9
      }],
    };
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
</style>
