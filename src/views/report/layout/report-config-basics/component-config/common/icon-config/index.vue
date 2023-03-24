<template>
  <div>
    <iconStyleConfig :componentConfig="componentConfig" v-if="config.subFormType === 'icon-style-config'" />
  </div>
</template>

<script>
import iconStyleConfig from './icon-style.vue'
export default {
  components: {
    iconStyleConfig
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
