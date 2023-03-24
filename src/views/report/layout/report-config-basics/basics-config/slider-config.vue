<template>
  <div style="display:flex">
    <el-checkbox v-if="config.checkKey" v-model="componentConfig.options[config.checkKey]" ></el-checkbox>
    <el-slider
          v-model="componentConfig.options[config.key]"
          v-if="config.formType === 'slider'"
          :min="1"
          :max="24"
          :marks="{ 12: '' }"
          style="margin-left: 10px;width:85%"
        ></el-slider>
  </div>
</template>
<script>
export default {
  name: "slider-config",
  props: {
    componentConfig: {
      type: Object,
      default: () => {},
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      checked: false,
      // config: {
      //   key: "width",
      // },
    };
  },
  created() {
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>
