<template>
  <div>
    <div class="stat-list-wrap">
      <span class="stat-label">
        维度 
        <i class="el-icon-edit" @click="onOpenStatDialog(false)"></i>
      </span>
      <div class="stat-list" style="display: inline-block;">
        <el-button size="mini" v-for="(item, key) in dimensionDataList" :key="key" class="button-item-wrap">
          <span class="button-text">
            {{ `${item.fieldName} ( ${item.tableName} )` }}
          </span>
          <i class="el-icon-circle-close" @click="delDataList(key, dimensionDataList)"></i>
        </el-button>
        <el-button size="mini" type="text" @click="onOpenStatDialog(false)">编辑</el-button>
      </div>
    </div>
    <div class="stat-list-wrap">
      <span class="stat-label">
        数值 
        <i class="el-icon-edit" @click="onOpenStatDialog(true)"></i>
      </span>
      <div class="stat-list" style="display: inline-block;">
        <el-dropdown v-for="(item, key) in valueDataList" :key="key" placement="bottom-start" trigger="click" @command="onHandleDropdownCommand($event, item)">
          <el-button size="mini" class="button-item-wrap">
            <i class="el-icon-arrow-down"></i>
            <span class="button-text">
              {{ `${item.fieldName} ( ${item.tableName} )` }}
            </span>
            <span class="button-stat-type" v-if="isNumberDict.indexOf(item.fieldType) !== -1">{{ ` [ ${numberValueTypes[item.statType]} ]` }}</span>
            <span class="button-stat-type" v-else>{{ ` [ ${textValueTypes[item.statType]} ]` }}</span>
            <i class="el-icon-circle-close" @click.stop="delDataList(key, valueDataList)"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" v-if="isNumberDict.indexOf(item.fieldType) !== -1">
            <el-dropdown-item v-for="(item, key) in numberValueTypes" :key="key" :command="key">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu slot="dropdown" v-else>
            <el-dropdown-item v-for="(item, key) in textValueTypes" :key="key" :command="key">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" type="text" @click="onOpenStatDialog(true)">编辑</el-button>
      </div>
    </div>
    <!-- pop -->
    <stat-edit-dialog
      :dialog-visible.sync="statEditDialogVisible"
      :dataTableInfoMapPick="dataTableInfoMapPick"
      :statisticsConfig="statisticsConfig"
      @onChageStatData="onChageStatData"
      @onChageStatDataVal="onChageStatDataVal"
      :isStatValue="isStatValue"
      title="批量添加字段"
    />
  </div>
</template>

<script>
import statEditDialog from './stat-edit-dialog.vue'
import { isStringDict, isNumberDict, isDatetimeDict } from '../../utils/field-type'
export default {
  name: "stat-view",
  components: {
    statEditDialog
  },
  props: {
    dataTableInfoMapPick: {},
    statisticsConfig: {}
  },
  data() {
    return {
      isNumberDict,
      isStatValue: false,
      statEditDialogVisible: false,
      numberValueTypes: {
        sum: '求和',
        avg: '求平均',
        count: '求数量',
        min: '求最小值',
        max: '求最大值'
      },
      textValueTypes: {
        count: '计数',
        distinct: '去重计数'
      },
      dimensionDataList: [],
      valueDataList: []
    };
  },
  created() {},
  mounted(){
    this.dialogOpen()
  },
  methods: {
    onHandleDropdownCommand(command, itemData) {
      itemData.statType = command
      this.save()
    },
    onOpenStatDialog(isValue){
      this.isStatValue = isValue
      this.statEditDialogVisible = true
    },
    onChageStatDataVal(obj){
      let dataList = this.handleStatData(obj)
      this.valueDataList = dataList
      this.save()
    },
    onChageStatData(obj){
      let dataList = this.handleStatData(obj)
      this.dimensionDataList = dataList
      this.save()
    },
    handleStatData(obj){
      let dataList = [];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const tableName = obj[key].tableName || '';
          const checkedItemList = obj[key].checkedItemList || [];
          let list = []
          checkedItemList.forEach(item => {
            let fieldType = ''
            let statType = 'count'
            let table = this.dataTableInfoMapPick[key] || []
            table.forEach(fieldItem => {
              if (fieldItem.name === item) {
                fieldType = fieldItem.type
              }
            })
            if (isNumberDict.indexOf(fieldType) !== -1) statType = 'sum'
            list.push({
              tableName: tableName,
              fieldName: item,
              fieldType,
              statType
            })
          })
          dataList = dataList.concat(list)
        }
      }
      return dataList
    },
    delDataList(index, list){
      list.splice(index, 1)
      this.save()
    },
    save(){
      let statisticsData = []
      let groupData = []
      this.dimensionDataList.forEach(item => {
        groupData.push({
          tableName: item.tableName,
          fieldName: item.fieldName
        })
      })
      this.valueDataList.forEach(item => {
        statisticsData.push({
          tableName: item.tableName,
          fieldName: item.fieldName,
          fieldType: item.fieldType,
          functionName: item.statType
        })
      })
      let statisticsConfig = {
        statistics: statisticsData,
        group: groupData
      }
      // console.log(statisticsConfig)
      this.$emit('onCollectData', statisticsConfig)
    },
    dialogOpen() {
      // this.dataForm = {};
      // @ts-ignore
      // this.$refs.dbForm && this.$refs.dbForm.resetFields();

      // if (this.processListData && this.processListData.length) {
      //   this.processSelectedList = this.processListData || []
      // }
      let dimensionDataList = []
      let valueDataList = []
      let statistics = this.statisticsConfig.statistics || []
      let group = this.statisticsConfig.group || []
      statistics.forEach(item => {
        valueDataList.push({
          tableName: item.tableName,
          fieldName: item.fieldName,
          fieldType: item.fieldType,
          statType: item.functionName
        })
      })
      group.forEach(item => {
        dimensionDataList.push({
          tableName: item.tableName,
          fieldName: item.fieldName
        })
      })
      this.dimensionDataList = dimensionDataList
      this.valueDataList = valueDataList
    }
  }
};
</script>

<style lang="scss" scoped>
.stat-list-wrap {
  margin-top: 20px;
  border-bottom: 1px solid #E4E7ED;
}
.stat-label {
  position: absolute;
  font-size: 14px;
  .el-icon-edit {
    cursor: pointer;
    &:hover {
      color: #409EFF;
    }
  }
}
.stat-list {
  margin-left: 70px;  
  button {
    margin-bottom: 10px;
    padding: 7px;
  }
  & button:first-child {
    margin-left: 10px;
  }
  .button-item-wrap {
    .button-text {
      display: inline-block;
      margin: 0 5px;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .button-stat-type {
      display: inline-block;
      overflow: hidden;
      margin-right: 5px;
    }
    .el-icon-circle-close {
      visibility: hidden;
      font-size: 14px;
    }
    &:hover .el-icon-circle-close {
      visibility: visible;
    }
  }
}
</style>
