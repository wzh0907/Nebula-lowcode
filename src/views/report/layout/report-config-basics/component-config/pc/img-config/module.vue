<template>
  <div>
    <el-form-item label="图片">
      <dataSourceApiConfig
        :componentList="componentList"
        :componentConfig="componentConfig"
        :config="config"
        :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
        v-if="reloadDataSourceApiConfig"
      >
        <template slot="img-upload">
          <imgUpload :imgSrc="componentConfig.options.src" @changeConfigValue="changeConfigValue" :configOptions="componentConfig.options" :configKey="config.key" />
        </template>
        <template slot="dataConfig">
          <el-input
            placeholder="请输入内容"
            v-model="componentConfig.options.valueKey"
            key="valueKey"
            style="padding-top: 10px"
          >
            <template slot="prepend"
              >图片地址<span style="visibility: hidden">啊</span></template
            >
          </el-input>
          
        </template>
      </dataSourceApiConfig>
    </el-form-item>
    <!-- <el-form-item label="数据回显">
      <dataSourceApiConfig
        :componentList="componentList"
        :componentConfig="componentConfig"
        :config="echoConfig"
        :interfaceDataConfig="componentConfig.options.interfaceDataEchoConfig || {}"
        v-if="reloadDataSourceApiConfig"
        key='echoData'
      />
    </el-form-item> -->
  </div>
</template>

<script>
import imgUpload from '../../../basics-config/img-upload'
import dataSourceApiConfig from "../../../basics-config/data-source-api-config";
import columnsValuesConfig from "../../../basics-config/columns-values-config";
export default {
  name: "columns-config",
  components: {
    imgUpload,
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
            label: "静态图片",
            isSetConfigName: true, // 不启用labelWidth
            value: 'radio-button-default',
            formType: 'img-upload',
            key: "src",
          },          
          {
            label: "后端服务",
            value: "radio-button-interface",
            formType: "interface-chart-table",
          },
        ],
      },
      // echoConfig:{
      //   labelName: '回显',
      //   isSetConfigName:true, // 不启用labelWidth
      //   formType: 'data-source-api-config',
      //   key: 'contentDataEcho',
      //   typeConfigs: [
      //     {
      //       label: '回显服务',
      //       value: 'radio-button-interface-echo',
      //       formType: 'interface-chart-echo'
      //     }
      //   ]
      // },
      addColumnConfig: {
        label: "",
        value: "",
      },
    };
  },
  created() {
    console.log(this.componentConfig);
  },
  methods: {
    changeConfigValue(configOptions, configKey, value){
      configOptions.src = value
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
