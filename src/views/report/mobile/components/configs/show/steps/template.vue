<template>
  <van-steps :active="options.active" :direction="options.direction" :activeColor="options.color" style="background-color: transparent;">
    <van-step v-for="(step, index) in options.steps" :key="index" style="background-color: transparent;">
      <template v-if="options.direction ==='horizontal'">
        {{ step.value }}
      </template>
      <template v-if="options.direction ==='vertical'">
        <h3>{{ step.value }}</h3>
        <p>{{ step.description }}</p>
      </template>
    </van-step>
  </van-steps>
</template>

<script>
import optionsConfig from './options-config'

export default {
  name: "stepsTemplate",
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
/deep/.van-step--horizontal .van-step__circle-container {
  background-color: transparent;
}

</style>
