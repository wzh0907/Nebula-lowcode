<template>
  <div class="filter-view" v-show="tabHeaderView === 'filter'">
    <el-form size="mini" :inline="true" class="form-gap">
      <el-form-item>
        <span>筛选方式</span>
      </el-form-item>
      <el-form-item>
        <el-radio label="match" v-model="filterType">条件过滤</el-radio>
        <el-radio label="expr" v-model="filterType">表达式过滤</el-radio>
      </el-form-item>
    </el-form>
    <div v-show="filterType === 'match'">
      <el-form size="mini" :inline="true" class="form-gap">
        <el-form-item>
          <span>满足下列</span>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择" v-model="matchType">
            <el-option label="全部条件" value="all"></el-option>
            <el-option label="任意条件" value="any"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form size="mini" :inline="true" class="form-gap form-gap-bottom" v-for="(item, index) in filterDataList" :key="index">
        <el-form-item>
          <el-select placeholder="请选择表" v-model="item.tableId">
            <el-option :label="value[0] && value[0].tableName" :value="key" v-for="(value, key) in dataTableInfoMapPick" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择字段" v-model="item.field" @change="onChangeField(item, dataTableInfoMapPick[item.tableId])">
            <el-option :label="value.name" :value="value.name" v-for="(value, key) in dataTableInfoMapPick[item.tableId]" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!-- 日期函数 -->
        <el-form-item v-if="item.fieldType === 'date'">
          <el-select placeholder="函数" v-model="item.func" @change="onChangeFunc(item.func, index)">
            <el-option :label="value" :value="key" v-for="(value, key) in dateFunctionMap" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!-- 操作符 -->
        <el-form-item v-if="item.fieldType === 'number'">
          <el-select placeholder="数值运算符" v-model="item.operator">
            <el-option :label="value" :value="key" v-for="(value, key) in numberOperatorMap" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.fieldType === 'text'">
          <el-select placeholder="文本运算符" v-model="item.operator">
            <el-option :label="value" :value="key" v-for="(value, key) in textOperatorMap" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.fieldType === 'date' && item.func !== 'relative' && item.func !== 'range'">
          <el-select placeholder="日期运算符" v-model="item.operator">
            <el-option :label="value" :value="key" v-for="(value, key) in dateOperatorMap" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!-- 日期类型 范围 输入值 -->
        <el-form-item v-if="item.fieldType === 'date' && (item.func === 'range' || item.func === 'relative')">
          <el-date-picker
            v-model="item.startDate"
            type="datetime"
            :disabled="item.func === 'relative'"
            placeholder="选择日期时间"
            default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="item.fieldType === 'date' && (item.func === 'range' || item.func === 'relative')">
          <el-date-picker
            v-model="item.endDate"
            type="datetime"
            :disabled="item.func === 'relative'"
            placeholder="选择日期时间"
            default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
        <!-- 日期类型 输入值 -->
        <el-form-item v-if="item.fieldType === 'date' && item.func !== 'range' && item.func !== 'relative' && item.operator !== 'isNull' && item.operator !== 'notNull'">
          <el-input
            key="execute-reduction-limit"
            v-model="item.value"
            placeholder="日期"
            width="50"
            size="mini"
          >
            <!-- <el-button slot="prepend" @click="item.isInputVar = !item.isInputVar">{{ item.isInputVar ? '变量值' : '静态值' }}</el-button> -->
          </el-input>
        </el-form-item>
        <!-- 数值类型 范围 输入值 -->
        <el-form-item v-if="item.fieldType === 'number' && item.operator === 'range'">
          <el-input
            key="execute-reduction-limit"
            v-model="item.minValue"
            width="50"
            size="mini"
          >
            <el-button slot="prepend">最小值</el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-if="item.fieldType === 'number' && item.operator === 'range'">
          <el-input
            key="execute-reduction-limit"
            v-model="item.maxValue"
            width="50"
            size="mini"
          >
            <el-button slot="prepend">最大值</el-button>
          </el-input>
        </el-form-item>
        <!-- 非日期类型 输入值 -->
        <el-form-item v-if="item.fieldType !== 'date' && item.operator !== 'isNull' && item.operator !== 'notNull' && item.operator !== 'range'">
          <el-input
            key="execute-reduction-limit"
            v-model="item.value"
            width="50"
            size="mini"
          >
            <!-- <el-button slot="prepend" @click="item.isInputVar = !item.isInputVar">{{ item.isInputVar ? '变量值' : '静态值' }}</el-button> -->
          </el-input>
        </el-form-item>
        <!-- end -->
        <el-form-item>
          <el-checkbox v-model="item.isExclude">是否排除</el-checkbox>
        </el-form-item>
        <el-form-item>
          <i class="el-icon-plus" @click="addFilterItem" v-if="index === (filterDataList.length - 1)"></i>
          <i class="el-icon-minus" @click="deleteFilterItem(index)" v-else></i>
        </el-form-item>
      </el-form>
    </div>
    <filterExprView :dataTableInfoMap="dataTableInfoMapPick" :filterType="filterType" :exprData="exprData" @onExprData="onExprData" @onSaveDataExpr="onSaveDataExpr" v-show="filterType === 'expr'" />
    <!-- pop -->
    <filterDateDialog
      :dialog-visible.sync="dateTimeDialogVisible"
      :selectedFieldItem="selectedFieldItem"
      :selectedFilterData="selectedFilterData"
      @onChangeDate="onChangeDate"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator";
import { isStringDict, isNumberDict, isDatetimeDict } from '../../utils/field-type'
import filterExprView from './filter-expr-view.vue'
import filterDateDialog from "./filter-date.vue";

@Component({
  components: {
    filterExprView,
    filterDateDialog
  }
})
export default class FilterView extends Vue {
  @Prop({
    type: Object,
    default: {}
  })
  dataTableInfoMapPick!: any;
  @Prop({
    type: String,
    default: ''
  })
  tabHeaderView!: any;

  @Prop({
    type: Object,
    default: {}
  })
  filterConfig!: any;

  dateTimeDialogVisible = false;
  graphConfig = {};
  inputRelativeDateItemIndex = 0;
  selectedFieldItem = {};
  selectedFilterData = {
    startDate: '',
    endDate: '',
    dateConfig: {}
  };
  isStringDict = isStringDict;
  isNumberDict = isNumberDict;
  isDatetimeDict = isDatetimeDict;
  filterType = 'match';
  matchType = 'all';
  filterDataList = [{
    isInputVar: false
  }];
  exprData = {};
  numberOperatorMap = {
    'range': '范围',
    '=': '=',
    '!=': '!=',
    '>': '>',
    '<': '<',
    '>=': '>=',
    '<=': '<=',
    'isNull': '为空',
    'notNull': '不为空',
    'in': 'in'
  }
  textOperatorMap = {
    'exactMatch': '=',
    'include': '包含',
    'startWith': '开头为',
    'endWith': '结尾为',
    'isNull': '为空',
    'notNull': '不为空',
    'in': 'in'
  }
  dateOperatorMap = {
    '=': '=',
    '!=': '!=',
    '>': '>',
    '<': '<',
    '>=': '>=',
    '<=': '<=',
    'isNull': '为空',
    'notNull': '不为空',
    'in': 'in'
  }
  dateFunctionMap = {
    range: '日期范围',
    relative: '相对日期',
    year: '年',
    quarter: '季度',
    month: '月',
    day: '天',
    hour: '小时',
    minute: '分种',
    second: '秒',
    week: '周数',
    work: '工作日',
    'year/month': '年/月',
    'year/month/day': '年/月/日',
  }
  created() {}
  mounted(){
    window.addEventListener('previewDataButtonEvent', () => {
      if (this.filterType === 'expr') return false;
      this.save();
    })
    window.addEventListener('saveDataButtonEvent', () => {
      if (this.filterType === 'expr') return false;
      this.save();
      this.$emit('onSaveData', true);
    })
    // window.addEventListener('readyQueryReductionItemServiceEvent', () => {
    //   console.log('filterConfig', this.filterConfig)
    //   this.handleFilterConfig();
    // })
    this.handleFilterConfig();
  }
  onSaveDataExpr(exprData: any){
    if (this.filterType !== 'expr') return false;
    let filterConfigData = {
      type: this.filterType,
      exprData
    }
    this.$emit('onFilterData', filterConfigData)
    this.$emit('onSaveData', true);
  }
  onExprData(exprData: any){
    if (this.filterType !== 'expr') return false;
    let filterConfigExprData = {
      type: this.filterType,
      exprData
    }
    this.$emit('onFilterData', filterConfigExprData)
  }
  onChangeFunc(val: string, index: number){
    if (val === 'relative'){
      this.dateTimeDialogVisible = true
      this.inputRelativeDateItemIndex = index;
    }
  }
  onChangeField(item: any, tableList: any){
    let type = ''
    let tableName = ''
    let fieldType = 'text'
    tableList.forEach((table: any) => {
      if(table.name === item.field) {
        type = table.type
        tableName = table.tableName
      }
    })
    if (this.isDatetimeDict.indexOf(type) !== -1) {
      fieldType = 'date'
    } else if (this.isNumberDict.indexOf(type) !== -1) {
      fieldType = 'number'
    }
    item.fieldType = fieldType
    item.tableName = tableName
    item.type = type
  }
  onChangeDate(dateConfig: any){
    let filterDataItem = this.filterDataList[this.inputRelativeDateItemIndex] as any;
    if (!filterDataItem) return false;
    filterDataItem.startDate = dateConfig.startDate;
    filterDataItem.endDate = dateConfig.endDate;
    this.graphConfig = dateConfig.config
    // 赋值保存
    this.selectedFilterData.startDate = dateConfig.startDate;
    this.selectedFilterData.endDate = dateConfig.endDate;
    this.selectedFilterData.dateConfig = dateConfig.config || {};
  }
  addFilterItem(){
    this.filterDataList.push({
      isInputVar: false
    })
  }
  deleteFilterItem(index: number){
    this.filterDataList.splice(index, 1)
  }
  splitDate(tim: number | string) {
    const nowDateObj = new Date(tim);
    const year = nowDateObj.getFullYear();
    const month = nowDateObj.getMonth() + 1;
    const week = nowDateObj.getDay();
    const day = nowDateObj.getDate();
    const hour = nowDateObj.getHours();
    const minute = nowDateObj.getMinutes();
    return {
      year,
      month,
      week,
      day,
      hour,
      minute
    };
  }
  transformDate(dateObj: any){
    let dateObjTemp = this.splitDate(dateObj);
    return `${dateObjTemp.year}-${dateObjTemp.month}-${dateObjTemp.day}`;
  }
  isEmptyObject<T>(obj: T): boolean {
    for (let key in obj) {
      return false;
    }
    return true;
  }
  handleFilterConfig(){
    let filterConfig = this.filterConfig || {};
    if (!filterConfig.type) return false;
    let tempList = [] as any;
    let filterType = filterConfig.type;
    let matchType = filterConfig.matchType
    let exprData = filterConfig.exprData || {}
    let filterList = filterConfig.filterList || []
    if (filterType === 'match') {
      filterList.forEach((item: any) => {
        let obj = {
          tableId: item.tableId,
          tableName: item.tableName,
          field: item.fieldName,
          fieldType: item.filedType === 'char' ? 'text' : item.filedType
        } as any;
        if (item.charConfig && !this.isEmptyObject(item.charConfig)) {
          let configObj = item.charConfig;
          obj.fieldType = 'text';
          obj.operator = configObj.operator;
          obj.isInputVar = configObj.paramType === 'V';
          obj.value = configObj.paramValue;
          obj.isExclude = configObj.isExclude;
        } else if (item.numberConfig && !this.isEmptyObject(item.numberConfig)) {
          let configObj = item.numberConfig;
          obj.fieldType = 'number';
          obj.type = configObj.fieldType;
          obj.operator = configObj.operator;
          obj.isInputVar = configObj.paramType === 'V';
          obj.value = configObj.paramValue;
          obj.minValue = configObj.minValue;
          obj.maxValue = configObj.maxValue;
          obj.isExclude = configObj.isExclude;
        } else if (item.dateConfig && !this.isEmptyObject(item.dateConfig)) {
          let configObj = item.dateConfig;
          obj.fieldType = 'date';
          obj.func = configObj.type;
          obj.startDate = configObj.startDate;
          obj.endDate = configObj.endDate;
          obj.operator = configObj.operator;
          obj.isInputVar = configObj.paramType === 'V';
          obj.value = configObj.paramValue;
          obj.isExclude = configObj.isExclude;
          // this.graphConfig = JSON.parse(configObj.config || '{}');
        }
        tempList.push(obj)
      })
    } else {
      this.exprData = exprData
    }
    // 赋值
    this.filterType = filterType;
    this.matchType = matchType;
    if (!tempList.length) tempList.push({
      isInputVar: false
    })
    this.filterDataList = tempList;
  }
  save(){
    let filterList = [] as any
    this.filterDataList.forEach((item: any) => {
      let obj = {
        tableId: item.tableId,
        tableName: item.tableName,
        fieldName: item.field,
        filedType: item.fieldType === 'text' ? 'char' : item.fieldType,
        charConfig: {},
        numberConfig: {},
        dateConfig: {}
      }
      let charConfig = {}
      let numberConfig = {}
      let dateConfig = {} as any
      if (item.fieldType === 'text') {
        charConfig = {
          operator: item.operator,
          paramType: item.isInputVar ? 'V' : 'C',
          paramValue: item.value,
          isExclude: item.isExclude
        }
      } else if (item.fieldType === 'number') {
        numberConfig = {
          fieldType: item.type,
          operator: item.operator,
          paramType: item.isInputVar ? 'V' : 'C',
          paramValue: item.value,
          minValue: item.minValue,
          maxValue: item.maxValue,
          isExclude: item.isExclude
        }
      } else if (item.fieldType === 'date') {
        dateConfig = {
          type: item.func,
          config: '',
          startDate: this.transformDate(item.startDate),
          endDate: this.transformDate(item.endDate),
          operator: item.operator,
          paramType: item.isInputVar ? 'V' : 'C',
          paramValue: item.value,
          isExclude: item.isExclude
        }
        if (item.func === 'relative') dateConfig.config = JSON.stringify(this.graphConfig || {}) as any;
      }
      obj.charConfig = charConfig
      obj.numberConfig = numberConfig
      obj.dateConfig = dateConfig
      filterList.push(obj)
    })
    let filterConfigData = {
      type: this.filterType,
      matchType: this.matchType,
      filterList
    }
    this.$emit('onFilterData', filterConfigData)
  }
};
</script>

<style lang="scss" scoped>
.filter-view {
  margin-left: 20px;
  .form-gap {
    margin-bottom: 10px;
  }
  .el-icon-plus, .el-icon-minus {
    cursor: pointer;
  }
  /deep/.el-collapse {
    border: 0;
    /deep/.el-collapse-item__wrap {
      border: 0;
    }
  }
  .form-gap-bottom {
    &/deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
