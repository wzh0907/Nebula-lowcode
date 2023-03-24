<template>
  <div>
    <el-form-item label="选项">
      <dataSourceApiConfig
        :componentList="componentList"
        :componentConfig="componentConfig"
        :config="config"
        :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
        v-if="reloadDataSourceApiConfig"
      >
        <template slot="default">
          <columnsValuesConfig
            :columnsConfigs="componentConfig.options.columns"
            addBtnText="添加"
            itemKey="label"
            :addColumnConfig="addColumnConfig"
          /> </template
        >-
        <template slot="dataConfig">
          <el-input
            placeholder="请输入内容"
            v-model="componentConfig.options.valueKey"
            key="valueKey"
            style="padding-top: 10px"
          >
            <template slot="prepend"
              >值<span style="visibility: hidden">啊</span></template
            >
          </el-input>
          <el-input
            placeholder="请输入内容"
            v-model="componentConfig.options.labelKey"
            key="labelKey"
            style="padding-top: 10px"
          >
            <template slot="prepend">标签</template>
          </el-input>
        </template>
      </dataSourceApiConfig>
    </el-form-item>
    <el-form-item label="数据回显">
      <dataSourceApiConfig
        :componentList="componentList"
        :componentConfig="componentConfig"
        :config="echoConfig"
        :interfaceDataConfig="componentConfig.options.interfaceDataEchoConfig || {}"
        v-if="reloadDataSourceApiConfig"
        key='echoData'
      />
    </el-form-item>
  </div>
</template>

<script>
import dataSourceApiConfig from "../../../basics-config/data-source-api-config";
import columnsValuesConfig from "../../../basics-config/columns-values-config";
export default {
  name: "columns-config",
  components: {
    dataSourceApiConfig,
    columnsValuesConfig,
  },
  props: ["componentList", "componentConfig", "reloadDataSourceApiConfig"],
  data() {
    return {
      config: {
        labelName: "数据配置",
        isSetConfigName: true, // 不启用labelWidth
        formType: "data-source-api-config",
        key: "contentDataSource",
        typeConfigs: [
          {
            label: "默认值",
            isSetConfigName: true, // 不启用labelWidth
            value: "radio-button-default",
            formType: "default",
            key: "value",
          },
          {
            label: "数据表",
            value: "radio-button-tables",
            formType: "interface-chart-table",
          },
          {
            label: "数据集",
            value: "radio-button-dataset",
            formType: "interface-chart-table",
          },
          {
            label: "后端服务",
            value: "radio-button-interface",
            formType: "interface-chart-table",
          },
        ],
      },
      echoConfig:{
        labelName: '回显',
        isSetConfigName:true, // 不启用labelWidth
        formType: 'data-source-api-config',
        key: 'contentDataEcho',
        typeConfigs: [
          {
            label: '回显服务',
            value: 'radio-button-interface-echo',
            formType: 'interface-chart-echo'
          }
        ]
      },
      addColumnConfig: {
        label: "",
        value: "",
      },
    };
  },
  created() {
    console.log(this.componentConfig);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
