<template>
  <el-form-item label="数据配置">
    <dataSourceApiConfig
      :componentList="componentList"
      :componentConfig="componentConfig"
      :config="config"
      :interfaceDataConfig="componentConfig.options.interfaceDataConfig || {}"
      v-if="reloadDataSourceApiConfig"
    >
      <template v-slot:dataConfig="data">
          <el-form-item label="值">
            <el-select v-model="componentConfig.options.setOptions.value" placeholder="请选择值" @change="selectParentId">
                  <el-option
                    v-for="(apiParams, key) in data.datasetParamsList"
                    :key="key"
                    :label="apiParams.name"
                    :value="apiParams.name">
                  </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-select v-model="componentConfig.options.setOptions.name" placeholder="请选择名称" @change="selectParentId">
                  <el-option
                    v-for="(apiParams, key) in data.datasetParamsList"
                    :key="key"
                    :label="apiParams.name"
                    :value="apiParams.name">
                  </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="节点ID">
            <el-select v-model="componentConfig.options.setOptions.id" placeholder="请选择节点ID" @change="selectParentId">
                  <el-option
                    v-for="(apiParams, key) in data.datasetParamsList"
                    :key="key"
                    :label="apiParams.name"
                    :value="apiParams.name">
                  </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="父节点ID">
            <el-select v-model="componentConfig.options.setOptions.parentId" placeholder="请选择父节点ID" @change="selectParentId">
                  <el-option
                    v-for="(apiParams, key) in data.datasetParamsList"
                    :key="key"
                    :label="apiParams.name"
                    :value="apiParams.name">
                  </el-option>
            </el-select>
          </el-form-item>

      </template>
    </dataSourceApiConfig>
  </el-form-item>
</template>

<script>
import dataSourceApiConfig from '../../../basics-config/data-source-api-config'

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
  data() {
    return {
      config: {
        labelName: '数据配置',
        isSetConfigName:true, // 不启用labelWidth
        formType: 'data-source-api-config',
        key: 'contentDataSource',
        typeConfigs: [{
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
      }
    };
  },
  created(){
  },
  methods: {
    selectParentId(value){
        let tempValue = this.componentConfig.options.setOptions.value
        let name = this.componentConfig.options.setOptions.name
        let id = this.componentConfig.options.setOptions.id
        let parentId = this.componentConfig.options.setOptions.parentId
        if (tempValue && name &&　id && parentId　) {
          let data = this.componentConfig.options.interfaceDataConfig.tableData
          let setOptions = this.componentConfig.options.setOptions
          let newDellData = this.deelData(data,setOptions)
          this.$set(this.componentConfig.options,'optionsData',newDellData)
        }
    },
    // 处理数据
    deelData(arr,setOptions) {
      let map = {}
      let newData = []
      arr.forEach(item => {
        item.label = item[setOptions.name]
        item.value = item[setOptions.value]
        map[item[setOptions.id]] = item
      })
      arr.forEach(items => {
        let mapItem =  map[items[setOptions.parentId]]
        if (mapItem)　{
          (mapItem.children || (mapItem.children=[])).push(items)
        } else {
          newData.push(items)
        }
      })
      return newData
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
