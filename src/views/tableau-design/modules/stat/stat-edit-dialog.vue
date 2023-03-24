<template>
  <el-dialog :title="title" width="700px" :visible.sync="isShowDialog" @open="dialogOpen">
    <div v-if="isDataReady">
      <div class="table-field-wrap" v-for="(value, key) in dataTableInfoMapPick" :key="key">
        <el-checkbox :indeterminate="statusMap[key].isIndeterminate" v-model="statusMap[key].checkAll" @change="handleCheckAllChange(key)">全选</el-checkbox>
        <!-- <div style="padding-bottom: 15px;"></div> -->
        <el-checkbox-group v-model="statusMap[key].checkedItemList" @change="handleCheckedCitiesChange(key)">
          <el-checkbox class="table-field-item" v-model="item.isCheck" v-for="(item, key) in value" :label="item.name" :key="key" :disabled="isNumberDict.indexOf(item.type) === -1">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { addDirService } from "@/api/dir_tree.js";
import { Vue, Prop, Component } from "vue-property-decorator";
import { isNumberDict } from '../../utils/field-type'

@Component
export default class RenameField extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  dialogVisible?: boolean;
  @Prop({
    type: String,
    default: ''
  })
  title?: string;
  @Prop({
    type: Object,
    default: {}
  })
  dataTableInfoMapPick?: any
  @Prop({
    type: Boolean,
    default: false
  })
  isStatValue?: boolean;
  @Prop({
    type: Object,
    default: {}
  })
  statisticsConfig?: any

  statusMap = {} as any;
  isDataReady = false;
  isNumberDict = isNumberDict;

  get isShowDialog() {
    return this.dialogVisible;
  }
  set isShowDialog(val) {
    this.$emit("update:dialogVisible", val);
    this.isDataReady = val as boolean
  }

  created() {}
  mounted() {
  }
  handleCheckAllChange(tableId: any){
    let fieldNameList = [] as any
    let tableFieldList = this.dataTableInfoMapPick[tableId] || []
    let statusObj = this.statusMap[tableId] || {}
    tableFieldList.forEach((item: any) => {
      if (isNumberDict.indexOf(item.type) !== -1) {
        fieldNameList.push(item.name)
      }
    })
    statusObj.checkedItemList = statusObj.checkAll ? fieldNameList : [];
    statusObj.isIndeterminate = false;
  }
  handleCheckedCitiesChange(tableId: any){
    let tableFieldList = this.dataTableInfoMapPick[tableId] || []
    let statusObj = this.statusMap[tableId] || {}
    let checkedCount = statusObj.checkedItemList.length;
    statusObj.checkAll = checkedCount === tableFieldList.length;
    statusObj.isIndeterminate = checkedCount > 0 && checkedCount < tableFieldList.length;
  }
  save() {
    this.isShowDialog = false;
    if (this.isStatValue) {
      this.$emit('onChageStatDataVal', this.statusMap)
    } else {
      this.$emit('onChageStatData', this.statusMap)
    }
  }
  dialogOpen() {
    let statisticsConfigData = []
    if (this.isStatValue) {
      statisticsConfigData = this.statisticsConfig.statistics || []
    } else {
      statisticsConfigData = this.statisticsConfig.group || []
    }
    for (const key in this.dataTableInfoMapPick) {
      this.$set(this.statusMap, key, {
        tableName: this.dataTableInfoMapPick[key]?.[0]?.tableName,
        checkAll: false,
        checkedItemList: [],
        isIndeterminate: false
      })
      // 数据回显
      this.dataTableInfoMapPick[key].forEach(item => {
        statisticsConfigData.forEach((statItem: any) =>{
          if (item.tableName === statItem.tableName && item.name === statItem.fieldName) {
            item.isCheck = true
            this.statusMap[key].checkedItemList.push(item.name)
          }
        })
      })
    }
    this.isDataReady = true
  }
}
</script>

<style lang="scss" scoped>
.table-field-wrap {
  padding-bottom: 20px;
}
.table-field-item {
  width: 20%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /deep/.el-checkbox__label {
    display: inline;
  }
}
</style>
