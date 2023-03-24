<template>
  <div>
    <rateIconConfig :componentConfig="componentConfig" v-if="config.subFormType === 'rate-icon-config'" />
  </div>
</template>

<script>
import rateIconConfig from './rate-icon.vue'
export default {
  components: {
    rateIconConfig
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
