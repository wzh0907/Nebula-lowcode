<template>
  <div>
    <buttonColorConfig :componentConfig="componentConfig" v-if="config.subFormType === 'button-color-config'" />
    <buttonIconConfig :componentConfig="componentConfig" v-if="config.subFormType === 'button-icon-config'" />
    <buttonPatternConfig :componentConfig="componentConfig" v-if="config.subFormType === 'button-pattern-config'" />
  </div>
</template>

<script>
import buttonColorConfig from './button-color.vue'
import buttonIconConfig from './button-icon.vue'
import buttonPatternConfig from './button-pattern.vue'
export default {
  components: {
    buttonColorConfig,
    buttonIconConfig,
    buttonPatternConfig
  },
  watch: {},
  props: {
    componentConfig: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
    };
  },
  created() {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
