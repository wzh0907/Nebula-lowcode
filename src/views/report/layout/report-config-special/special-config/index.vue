<template>
  <div>
    <template v-if="specialConfig.type === 'special-component-table-column'">
      <tableColumnConfig :tableColumnConfig="specialConfig" />
    </template>
    <template v-if="specialConfig.type === 'special-component-table-column-value'">
      <tableColumnValueConfig :tableColumnValueConfig="specialConfig" />
    </template>
    <template v-if="specialConfig.type === 'van-design-custom'">
      <custom :config="specialConfig"/>
    </template>
    <!-- <template v-if="specialConfig.type === 'special-component-dialogBox'">
      <dialogBoxColumnConfig :dialogBoxValueConfig="specialConfig" />
    </template> -->
  </div>
</template>

<script>
import tableColumnConfig from "./table-column.vue";
import tableColumnValueConfig from "./table-column-value.vue";
import custom from "./custom.vue";
// import dialogBoxColumnConfig from "./dialogBox-column.vue";
export default {
  components: {
    tableColumnConfig,
    tableColumnValueConfig,
    custom,
    // dialogBoxColumnConfig
  },
  props: ["specialConfig"],
  data() {
    return {};
  },
  created() {
    // console.log('specialConfig', this.specialConfig)
  },
  methods: {},
};
</script>
<style scoped lang="scss">
</style>
