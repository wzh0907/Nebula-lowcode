<template>
  <el-form-item label="数据配置">
    <dataSourceApiConfig
      :componentList="componentList"
      :componentConfig="componentConfig"
      :config="config"
      :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
      v-if="reloadDataSourceApiConfig"
    >
      <template slot="default">
        <columnsValuesConfig :columnsConfigs="componentConfig.options.columns" addBtnText="添加" itemKey="label" :addColumnConfig="addColumnConfig" />
      </template>
      <template slot="dataConfig">
        <el-input placeholder="请输入内容" v-model="componentConfig.options.valueKey" key="valueKey" style="padding-top: 10px;">
          <template slot="prepend">值<span style="visibility: hidden;">啊</span></template>
        </el-input>
        <el-input placeholder="请输入内容" v-model="componentConfig.options.labelKey" key="labelKey" style="padding-top: 10px;">
          <template slot="prepend">标签</template>
        </el-input>
      </template>
    </dataSourceApiConfig>
  </el-form-item>
</template>

<script>
import dataSourceApiConfig from '../../../basics-config/data-source-api-config'
import columnsValuesConfig from '../../../basics-config/columns-values-config'
export default {
  name: "columns-config",
  components: {
    dataSourceApiConfig,
    columnsValuesConfig
  },
  props: [
    "componentList",
    'componentConfig',
    'reloadDataSourceApiConfig'
  ],
  data() {
    return {
      config: {
        labelName: '数据配置',
        isSetConfigName:true, // 不启用labelWidth
        formType: 'data-source-api-config',
        key: 'contentDataSource',
        typeConfigs: [
          {
            label: '默认值',
            value: 'radio-button-default',
            formType: 'default',
            key: 'value'
          }, {
            label: '数据表',
            value: 'radio-button-tables',
            formType: 'interface-chart-table'
          }, {
            label: '数据集',
            value: 'radio-button-dataset',
            formType: 'interface-chart-table'
          }, {
            label: '后端服务',
            value: 'radio-button-interface',
            formType: 'interface-chart-table'
          }
        ]
      },
      addColumnConfig: {
        label: '',
        value: ''
      }
    };
  },
  created(){
    console.log(this.componentConfig)
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
