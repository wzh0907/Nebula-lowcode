<template>
  <configModule
    :reloadDataSourceApiConfig="reloadDataSourceApiConfig"
    :columnsConfigs="componentConfig.options.collapsePanelColumns"
    :componentConfig="componentConfig"
    :componentList="componentList"
  />
</template>

<script>
import configModule from "./module.vue";

export default {
  name: "columns-config",
  components: {
    configModule,
  },
  watch: {
    'componentConfig.options.collapsePanelColumns': {
      deep: true,
      handler(vals) {
        this.handleColumns(vals)
      }
    }
  },
  props: {
    reloadDataSourceApiConfig: {
      default: {
        type: Boolean,
        default: false
      }
    },
    componentList: {
      default: {
        type: Object,
        default: [],
      },
    },
    componentConfig: {
      default: {
        type: Object,
        default: {},
      },
    },
  },
  data() {
    return {
    };
  },
  created(){
  },
  methods: {
    handleColumns(columns){
      this.componentConfig.options.collapsePanelColumnsInterfaceData = []
      columns.forEach(item => {
        let interfaceDataOptions = []
        let defaultValue = item.defaultValue
        let labelKey = item.labelKey
        let valueKey = item.valueKey
        let interfaceDataConfig = item.interfaceDataConfig.tableData
        interfaceDataConfig.forEach(tableDataItem => {
          interfaceDataOptions.push({
            text: tableDataItem[labelKey],
            value: tableDataItem[valueKey]
          })
        })
        this.componentConfig.options.collapsePanelColumnsInterfaceData.push({
          defaultValue,
          interfaceDataOptions
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
