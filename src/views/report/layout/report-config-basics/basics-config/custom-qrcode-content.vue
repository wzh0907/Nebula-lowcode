<template>
  <div class="custom_qrcode-content">
    <el-collapse v-model="activeNames">
      <el-collapse-item  :title="config.labelName" name="1" >
        <!-- 接口配置 -->
        <dataSourceApiConfig
          :componentList="componentList"
          :componentConfig="componentConfig"
          :config="config"
          :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
          v-if="config.key === 'contentDataSource' && reloadDataSourceApiConfig"
        >
         
        </dataSourceApiConfig>
        <!-- 文本编辑器 -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import dataSourceApiConfig from './data-source-api-config'
export default {
  name: "columns-config",
  components: {
    dataSourceApiConfig,
  },
  props: [
    'componentConfig','config','componentConfigKey','componentList'
  ],
  data() {
    return {
      reloadDataSourceApiConfig: true,
      activeNames: ['1']
    };
  },
  watch: {
  },
  created() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.custom_text-content{
  /deep/.el-collapse-item__wrap{
    overflow: initial;
  }
  /deep/.el-collapse-item__content{
    padding-bottom: 0;
  }
  /deep/.el-collapse-item__wrap{
    border-bottom: 0;
  }
}


</style>
