<template>
  <div class="textHtmlStyle">
    <el-input-number
      v-model="componentConfig.options[componentConfigKey]"
      controls-position="right"
      @change="handleChange"
      :min="0"
      :step="1"
    />
    <el-checkbox v-model="componentConfig.options[componentSecondKey]" style="margin-left:20px;">%</el-checkbox>
  </div>
</template>
<script>
/**
 * 输入百分比 会自动 去config.key 后面拼接percent
 */
export default {
  name: "input-percent",
  props: {
    componentConfig: {
      type: Object,
      default: () => {},
    },
    componentConfigKey:String,
    componentSecondKey:String
  },
  data() {
    return {
      checked: false,
      config: {
        key: "width",
      },
    };
  },
  created() {},
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>