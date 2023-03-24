<script>
/**
 * 使用说明：未知，有空研究一下，看起来是支持多种配置方式的组件
 */
import dataSourceApiConfig from './data-source-api-config'
import textStyleEditor from './text-style-editor.vue'
import locationStyleEditor from './location-style-editor'
import inputMixinsCustomConfig from '../component-config/mobile/input-config/index.vue'
export default {
  name: "columns-config",
  components: {
    dataSourceApiConfig,
    textStyleEditor,
    locationStyleEditor,
    inputMixinsCustomConfig
  },
  props: [
    'componentConfig','config','componentConfigKey','componentList', 'reloadDataSourceApiConfig'
  ],
  data() {
    return {
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

<template>
  <div class="custom_text-content">
    <el-collapse v-model="activeNames">
      <el-collapse-item  :title="config.labelName" name="1" >
        <!-- 接口配置 -->
        <dataSourceApiConfig
          :componentList="componentList"
          :componentConfig="componentConfig"
          :config="config"
          :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
          v-if="config.key === 'contentDataSource' && reloadDataSourceApiConfig"
        />
        <!-- 文本编辑器 -->
        <textStyleEditor v-if="config.key === 'styleEditorConfig' && reloadDataSourceApiConfig" :styleEditorConfig="componentConfig.options[config.key]" />
        <locationStyleEditor v-if="config.key === 'locationEditorConfig' && reloadDataSourceApiConfig" :styleEditorConfig="componentConfig.options[config.key]" />
        <inputMixinsCustomConfig  v-if="config.key === 'mix-custom-text-content'" :componentConfig="componentConfig" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

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
