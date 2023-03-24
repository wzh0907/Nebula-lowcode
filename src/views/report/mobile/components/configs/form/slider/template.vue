<template>
  <van-slider
    v-model="options.value"
    :style="{height: options.vertical ? '200px' : ''}"
    :bar-height="options.barHeight"
    :button-size="options.buttonSize"
    :max="options.max"
    :min="options.min"
    :step="options.step"
    :vertical="options.vertical"
  />
</template>

<script>
import optionsConfig from './options-config'

export default {
  name: "sliderTemplate",
  components: {
  },
  data() {
    return {
      options: optionsConfig
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
/deep/.van-slider{
  height: 32px;
  line-height: 32px;
}
</style>
