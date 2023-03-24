<script>
/**
 * 已废弃
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * ******************************** 只对的组件数据老配置兼容兼容 **********************
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
import dataSourceApiConfig from './data-source-api-config.vue'
import slotTableColumnConfig from './slots/table-column-config.vue'
import slotMobileTableColumnConfig from './slots/mobile-table-column-config.vue'
import slotSelectConfig from './slots/select-config.vue'
import slotProgressConfig from './slots/progress-config.vue'
import imgUpload from '@/views/report/layout/report-config-basics/basics-config/img-upload'
export default {
  components: {
    dataSourceApiConfig,
    slotTableColumnConfig,
    slotMobileTableColumnConfig,
    slotSelectConfig,
    slotProgressConfig,
    imgUpload
  },
  props: {
    deviceDesignType: {
      type: String,
      default: 'MOBILE'
    },
    componentList: {
      type: Array,
      default: []
    },
    componentConfig: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      reloadDataSourceApiConfig: true,
      typeConfigs: [],
      formComponentTypeList: ['van-design-select', 'van-design-checkbox', 'van-design-radio']
    };
  },
  watch: {
    componentConfig: {
      immediate: true,
      handler(val){
        this.typeConfigs = this.componentConfig.dataSourceConfig && this.componentConfig.dataSourceConfig.typeConfigs
        this.echoTypeConfigs = this.componentConfig.dataSourceConfig && this.componentConfig.dataSourceConfig.echoTypeConfigs
        this.reloadDataSourceApiConfig = false
        this.$nextTick(() => {
          this.reloadDataSourceApiConfig = true
        })
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changeConfigValue(configOptions, configKey, value){
      configOptions.src = value
    }
  }
};
</script>
<template>
  <div v-if="reloadDataSourceApiConfig && (typeof componentConfig.options.contentDataSource) !== 'undefined' && componentConfig.dataSourceConfig">
    <el-form size="small">
      <el-form-item>
        <dataSourceApiConfig
          :componentList="componentList"
          :componentConfig="componentConfig"
          :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
          :typeConfigs="typeConfigs"
          dataSourceConfigKey="contentDataSource"
          key="typeConfigs"
        >
          <slotTableColumnConfig slot="dataConfig" :componentConfig="componentConfig" style="margin-top: 10px;" v-if="deviceDesignType === 'PC' && componentConfig.type === 'van-design-table'" />
          <!-- 移动端table -->
          <slotMobileTableColumnConfig slot="dataConfig" :columnsConfigs="componentConfig.options.optionColumn" style="margin-top: 10px;" v-if="deviceDesignType === 'MOBILE' && componentConfig.type === 'van-design-table'" />

          <slotProgressConfig slot="global-default" :componentConfig="componentConfig" style="margin-top: 10px;" v-if="componentConfig.type === 'van-design-progress'" />
          <!-- 表单 -->
          <slotSelectConfig slot="global-default" :componentConfig="componentConfig" style="margin-top: 10px;" v-if="formComponentTypeList.indexOf(componentConfig.type) !== -1" />
          <!-- 图片 -->
          <template slot="img-upload" v-if="componentConfig.type === 'van-design-image'">
            <imgUpload
              v-if="componentConfig.options.contentDataSource === 'radio-button-default-image'"
              :imgSrc="componentConfig.options.src"
              :configOptions="componentConfig.options"
              configKey="src"
              @changeConfigValue="changeConfigValue"
            />
            <el-input
              v-else
              placeholder="请输入内容"
              v-model="componentConfig.options.valueKey"
              key="valueKey"
              style="padding-top: 10px"
            >
              <template slot="prepend">
                图片地址
              </template>
            </el-input>
          </template>
        </dataSourceApiConfig>
      </el-form-item>
      <!-- 表单回显配置 -->
      <el-form-item v-if="formComponentTypeList.indexOf(componentConfig.type) !== -1">
        <dataSourceApiConfig
          :componentList="componentList"
          :componentConfig="componentConfig"
          :interfaceDataConfig="componentConfig.options.interfaceDataEchoConfig || {}"
          :typeConfigs="echoTypeConfigs"
          dataSourceConfigKey="contentDataEcho"
          key="echoTypeConfigs"
        />
      </el-form-item>
      
    </el-form>
  </div>
</template>
<style scoped lang="scss">

</style>
