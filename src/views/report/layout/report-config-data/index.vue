<template>
  <div v-if="componentConfig.options.interfaceDataConfig">
    <indexNew
      :deviceDesignType="deviceDesignType"
      :componentConfig="componentConfig"
      :componentList="componentList"
      v-if="componentConfig.options.interfaceDataConfig.versions === '1.0.0'"
    />
    <indexOld
      v-else
      :deviceDesignType="deviceDesignType"
      :componentConfig="componentConfig"
      :componentList="componentList"
    />
  </div>
</template>

<script>
import indexNew from "./data-config-new/index.vue";
import indexOld from "./data-config-old/index.vue";
export default {
  components: {
    indexNew,
    indexOld,
  },
  props: {
    deviceDesignType: {
      type: String,
      default: "MOBILE",
    },
    componentList: {
      type: Array,
      default: [],
    },
    componentConfig: {
      type: Object,
      default: {},
    },
  },
  created(){
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss">
</style>
