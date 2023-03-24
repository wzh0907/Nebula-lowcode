<template>
  <el-form-item label="数值">
    <dataSourceApiConfig
      :typeConfigs="typeConfigs"
      :componentList="componentList"
      :componentConfig="componentConfig"
      :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
      dataSourceConfigKey="contentDataSource"
      v-if="reloadDataSourceApiConfig"
    >
    <div>
      <!-- 数值输入按钮 -->
      <el-input type="number" placeholder="请输入最大值" v-model.number="componentConfig.options.maxValue" key="maxValue" style="padding-top: 10px;">
          <template slot="prepend">最大值</template>
      </el-input>
      <el-input type="number" placeholder="请输入进度值" v-model.number="componentConfig.options.rateValue" key="rateValue" style="padding-top: 10px;">
        <template slot="prepend">进度值</template>
      </el-input>
    </div>
    <template slot="dataConfig">
      <el-form-item>
        <span>最大值:</span>
        <el-select v-model.number="componentConfig.options.interfaceDataConfig.maxValue" placeholder="请选择最大值" style="padding-top: 10px;" key="maxValue">
          <el-option
            v-for="(value, key) in componentConfig.options.interfaceDataConfig.interFaceData"
            :key="key"
            :label="key"
            :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-input type="number" disabled placeholder="请输入最大值" v-model.number="componentConfig.options.interfaceDataConfig.maxValue" key="maxValue" style="padding-top: 10px;">
          <template slot="prepend">最大值</template>
      </el-input> -->
      <template>
          <el-form-item>
            <span>进度值:</span>
            <el-select v-model.number="componentConfig.options.interfaceDataConfig.value" placeholder="请选择进度值" style="padding-top: 10px;" key="value">
              <el-option
                v-for="(value, key) in componentConfig.options.interfaceDataConfig.interFaceData"
                :key="key"
                :label="key"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-input v-if="componentConfig.options.contentDataSource === 'radio-button-default'" type="number" placeholder="请输入进度值" v-model.number="componentConfig.options.rateValue" key="rateValue" style="padding-top: 10px;">
            <template slot="prepend">进度值</template>
          </el-input>
          <!-- <el-input v-else disabled type="number" placeholder="请输入进度值" v-model.number="componentConfig.options.interfaceDataConfig.value" key="value" style="padding-top: 10px;">
            <template slot="prepend">进度值</template>
          </el-input> -->
      </template>
      </template>
    </dataSourceApiConfig>
  </el-form-item>
</template>

<script>
// import dataSourceApiConfig from '../../../basics-config/data-source-api-config'
import dataSourceApiConfig from '../../../../report-config-data/data-config-old/data-source-api-config.vue'
export default {
  name: "columns-config",
  components: {
    dataSourceApiConfig
  },
  props: [
    "componentList",
    'componentConfig',
    'reloadDataSourceApiConfig'
  ],
  watch:{
    'componentConfig.options.interfaceDataConfig.value':{
      handler(val) {
        if (val) {
          for(let i in this.componentConfig.options.interfaceDataConfig.interFaceData) {
            if (this.componentConfig.options.interfaceDataConfig.interFaceData[i] === val) {
                this.componentConfig.options.interfaceDataConfig.key = i
            }
          }
        }
      }
    }
  },
  data() {
    return {
      typeConfigs: [
          {
            label: '静态数据',
            value: 'radio-button-default',
            formType: 'default',
            key: 'value'
          },{
            label: '后端服务',
            value: 'radio-button-interface',
            formType: 'interface-text-title'
          }
        ],
      config: {
        labelName: '数据配置',
        formType: 'data-source-api-config',
        key: 'contentDataSource',
        typeConfigs: [
          {
            label: '静态数据',
            value: 'radio-button-default',
            formType: 'default',
            key: 'value'
          },{
            label: '后端服务',
            value: 'radio-button-interface',
            formType: 'interface-text-title'
          }
        ]
      }
    };
  },
  created(){
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>
