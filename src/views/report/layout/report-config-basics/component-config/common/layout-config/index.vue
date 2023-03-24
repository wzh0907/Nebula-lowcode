<template>
  <div>
    <bgImageConfig :componentConfigOptions="componentConfig.options" v-if="config.subFormType === 'bg-image-config'" />
    <gridLayoutConfig :componentConfig="componentConfig" v-if="config.subFormType === 'grid-layout-config'" />
  </div>
</template>

<script>
import bgImageConfig from './bg-image.vue'
import gridLayoutConfig from './grid-layout.vue'
export default {
  components: {
    bgImageConfig,
    gridLayoutConfig
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
