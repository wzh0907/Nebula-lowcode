<template>
  <div style="padding-left: 20px;">
    <paramsConfig :interfaceDataConfig="interfaceConfig.data" :componentUuidList="componentUuidList" :chooseSubpageIndex="chooseSubpageIndex" v-if="interfaceConfig.type === 'radio-button-interface' || interfaceConfig.type === 'radio-button-connect'" />
    <queryConfig :interfaceDataConfig="interfaceConfig.data" :componentUuidList="componentUuidList" :chooseSubpageIndex="chooseSubpageIndex"
      v-else-if="interfaceConfig.type === 'radio-button-tables' || interfaceConfig.type === 'radio-button-dataset'"
    />
    <otherConfig :interfaceDataConfig="interfaceConfig.data" :componentUuidList="componentUuidList" v-else />
  </div>
</template>

<script>
/**
 * 数据配置的所有操作都在以下三个组件里面进行（包括接口响应的数据处理）
 * 
 * paramsConfig: 后端服务的配置
 * queryConfig: 数据表的配置
 * otherConfig: SQL脚本、视图的配置
 */
import paramsConfig from './param-config.vue'
import queryConfig from './query-config.vue'
import otherConfig from './other-config.vue'
export default {
  components: {
    paramsConfig,
    queryConfig,
    otherConfig
  },
  props: {
    interfaceConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    componentUuidList: {
      type: Array,
      default: () => {
        return []
      }
    },
    chooseSubpageIndex:{
     type: Number
    }
  },
  data() {
    return {};
  },
  created() {
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped lang="scss">

</style>
