<template>
  <div>
    <el-form-item label="数据源" label-width="80px">
      <el-select v-model="componentConfig.options.databaseId" placeholder="请选择" @change="queryTableListService">
        <el-option
          v-for="item in databaseList"
          :key="item.id"
          :label="item.dataSourceName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据表" label-width="80px">
      <el-select v-model="componentConfig.options.dataTableId" placeholder="请选择" @change="queryTableFieldService">
        <el-option
          v-for="item in dataTableList"
          :key="item.tableId"
          :label="item.tableName"
          :value="item.tableId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item  label="主键值" label-width="80px">
      <el-input v-model="componentConfig.options.primaryKey" size="mini" placeholder="输入主键值的变量名" />
      <!-- <el-select v-model="componentConfig.options.primaryKey" placeholder="请选择">
        <el-option
          v-for="item in dataTableFieldList"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select> -->
    </el-form-item>
    <el-form-item label="输入项配置">
      <template
        :label="config.labelName"
        v-for="(config, index) in componentConfig.configList"
      >
        <formConfigModule
          :key="index"
          v-if="config.formType === 'form-config'"
          :columnsConfigs="componentConfig.options[config.key]"
          :addBtnText="config.addBtnText"
          :collapsePanelColumnsConfigs="config.collapsePanelColumnsConfigs"
          :addColumnConfig="config.addColumnConfig"
          :panelLabelPosition="config.panelLabelPosition"

          :dataTableFieldList="dataTableFieldList"
          :componentConfig="componentConfig"
        />
      </template>
    </el-form-item>
  </div>
</template>

<script>
import formConfigModule from "./module.vue";
import {
  getListService as getDatabaseListService,
  getTableListService,
  getTableFieldService
} from "@/api/database";

export default {
  name: "columns-config",
  components: {
    formConfigModule,
  },
  props: {
    componentConfig: {
      default: {
        type: Object,
        default: {},
      },
    },
  },
  data() {
    return {
      databaseList: [],
      dataTableList: [],
      dataTableFieldList: []
    };
  },
  created(){
    this.queryDatabaseListService()
    if (this.componentConfig.options.databaseId) {
      this.queryTableListService(() => {
        if (this.componentConfig.options.dataTableId) {
          this.queryTableFieldService()
        }
      })
    }
    console.log(this.componentConfig,"componentConfig");
  },
  methods: {
    queryDatabaseListService(){
      getDatabaseListService().then(res => {
        this.databaseList = res.dataList
      })
    },
    queryTableListService(next){
      getTableListService({
        dbConfigId: this.componentConfig.options.databaseId,
        size:9999,
        queryType: 'table'
      }).then(res => {
        this.dataTableList = res.dataList
        if (next && typeof next === 'function') next()
      })
    },
    queryTableFieldService(){
      let tableName = ''
      this.dataTableList.forEach(item => {
        if (this.componentConfig.options.dataTableId === item.tableId) {
          tableName = item.tableName
        }
      })
      this.componentConfig.options.dataTableName = tableName
      getTableFieldService({
        dbConfigId: this.componentConfig.options.databaseId,
        tableId: this.componentConfig.options.dataTableId,
        tableName
      }).then(res => {
        this.dataTableFieldList = res.dataList
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
