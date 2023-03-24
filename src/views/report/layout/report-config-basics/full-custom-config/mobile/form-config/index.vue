<template>
  <div>
    <el-form-item label="数据源">
      <el-select v-model="componentConfig.options.databaseId" placeholder="请选择" @change="queryTableListService">
        <el-option
          v-for="item in databaseList"
          :key="item.id"
          :label="item.dataSourceName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据表">
      <el-select v-model="componentConfig.options.dataTableName" placeholder="请选择" @change="queryTableFieldService">
        <el-option
          v-for="item in dataTableList"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="主键">
      <el-input v-model="componentConfig.options.primaryKey" size="mini" />
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
} from "@/api/database";

import {
  getDbTableList,
  getDbTableColumnsList
} from "@/api/database-command/index.js";

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
  },
  methods: {
    queryDatabaseListService(){
      getDatabaseListService().then(res => {
        this.databaseList = res.dataList
      })
    },
    queryTableListService(next){
      getDbTableList({
            dbConfigId: this.componentConfig.options.databaseId,
          }).then((res) => {
            this.dataTableList = res.dataList
            if (next && typeof next === 'function') next()
            });
    },
    queryTableFieldService(){
      console.log("this.componentConfig.options",this.componentConfig.options)
      
      getDbTableColumnsList({
        dbConfigId: this.componentConfig.options.databaseId,
        tableName: this.componentConfig.options.dataTableName,
      }).then((res) => {
        if (res.code == 0) {
          this.dataTableFieldList = res.dataList;
          
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
