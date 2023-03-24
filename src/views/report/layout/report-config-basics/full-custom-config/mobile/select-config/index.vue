<template>
  <configModule
    :reloadDataSourceApiConfig="reloadDataSourceApiConfig"
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
    'componentConfig.options.interfaceDataConfig': {
      deep: true,
      handler(vals) {
        this.handleInterfaceDataConfig(vals)
      }
    },
    'componentConfig.options.columns': {
      deep: true,
      handler(vals) {
        this.handleColumns(vals)
      }
    },
    'componentConfig.options.labelKey': {
      deep: true,
      handler(vals) {
        this.handleInterfaceDataConfig(this.componentConfig.options.interfaceDataConfig)
      }
    },
    'componentConfig.options.valueKey': {
      deep: true,
      handler(vals) {
        this.handleInterfaceDataConfig(this.componentConfig.options.interfaceDataConfig)
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
    // console.log(this.componentConfig)
  },
  methods: {
    handleInterfaceDataConfig(dataConfig){
      let labelKey = this.componentConfig.options.labelKey
      let valueKey = this.componentConfig.options.valueKey
      let tableData = dataConfig.tableData
      if(this.componentConfig.options.contentDataSource!=='radio-button-default'){
        this.componentConfig.options.columns = []
        tableData && tableData.forEach(item => {
          this.componentConfig.options.columns.push({
            label: item[labelKey],
            value: item[valueKey]
          })
        })
      }
    },
    handleColumns(columns){
      this.componentConfig.options.columnsStrArr = []
      columns && columns.forEach(item => {
        let label = item.label
        this.componentConfig.options.columnsStrArr.push(label)
      })
      // let contentDataSource = this.componentConfig.options.contentDataSource
      // let labelKey = this.componentConfig.options.labelKey
      // let valueKey = this.componentConfig.options.valueKey
      // this.componentConfig.options.columnsStrArr = []
      // if (contentDataSource === 'radio-button-default') {
      //   columns.forEach(item => {
      //     let label = item.label
      //     this.componentConfig.options.columnsStrArr.push(label)
      //   })
      // } else {
      //   columns.forEach(item => {
      //     let label = item[labelKey]
      //     this.componentConfig.options.columnsStrArr.push(label)
      //   })
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
