<template>
  <div class="filter-view">
    <!-- <el-form size="mini" :inline="true" class="form-gap">
      <el-form-item>
        <span>筛选方式</span>
      </el-form-item>
      <el-form-item>
        <el-radio label="match" v-model="filterType">条件过滤</el-radio>
        <el-radio label="expr" v-model="filterType">表达式过滤</el-radio>
      </el-form-item>
    </el-form> -->
    <div v-show="filterType === 'match'">
      <!-- <el-form size="mini" :inline="true" class="form-gap">
        <el-form-item>
          <span>满足下列</span>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择" v-model="fullFilter">
            <el-option label="全部条件" value="all"></el-option>
            <el-option label="任意条件" value="any"></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <el-form size="mini" :inline="true" class="form-gap form-gap-bottom" v-for="(item, index) in filterDataList" :key="index">
        <!-- <el-form-item>
          <el-select placeholder="请选择表" v-model="item.tableId">
            <el-option :label="value[0].tableName" :value="key" v-for="(value, key) in dataTableInfoMap" :key="key"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-select placeholder="请选择字段" v-model="item.field" @change="onChangeField(item, dataTableColumnList)">
            <el-option :label="value.name" :value="value.name" v-for="(value, key) in dataTableColumnList" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!-- start 对不同类型的字段进行处理  操作符 -->
        <el-form-item v-if="item.fieldType === 'number'">
          <el-select placeholder="number" v-model="item.operator">
            <el-option :label="value" :value="key" v-for="(value, key) in numberOperatorMap" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.fieldType === 'text'">
          <el-select placeholder="text" v-model="item.operator">
            <el-option :label="value" :value="value" v-for="(value, key) in numberOperatorMap" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="item.fieldType === 'date'">
          <el-select placeholder="函数" v-model="item.func" @change="onChangeFunc(item.func)">
            <el-option :label="value" :value="key" v-for="(value, key) in dateFunctionMap" :key="key"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="item.fieldType === 'date'">
          <el-select placeholder="date" v-model="item.operator">
            <el-option :label="value" :value="value" v-for="(value, key) in numberOperatorMap" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <!-- 日期类型 填写值 -->
        <el-form-item v-if="item.fieldType === 'date' && item.operator === 'range'">
          <el-date-picker
            v-model="item.startDate"
            type="datetime"
            placeholder="选择日期时间"
            default-time="00:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="item.fieldType === 'date' && item.operator === 'range'">
          <el-date-picker
            v-model="item.endDate"
            type="datetime"
            placeholder="选择日期时间"
            default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="item.fieldType === 'date' && item.operator !== 'range'">
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
        <!-- 非日期类型 -->
        <el-form-item v-if="item.fieldType !== 'date'">
          <el-input
            key="execute-reduction-limit"
            v-model="item.value"
            placeholder="文本"
            width="50"
            size="mini"
          >
            <!-- <el-button slot="prepend" @click="item.isInputVar = !item.isInputVar">{{ item.isInputVar ? '变量值' : '静态值' }}</el-button> -->
          </el-input>
        </el-form-item>
        <!-- end -->
        <el-form-item>
          <!-- <el-checkbox v-model="item.nullAvailable">包含Null值</el-checkbox> -->
          <el-select placeholder="请选择" v-model="item.connectType" style="width: 90px; margin-right: 20px;">
            <el-option label="and" value="and"></el-option>
            <el-option label="or" value="or"></el-option>
            <!-- <el-option label="and not" value="and not"></el-option>
            <el-option label="or not" value="or not"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <i class="el-icon-plus" @click="addFilterItem" v-if="index === (filterDataList.length - 1)"></i>
          <i class="el-icon-minus" @click="deleteFilterItem(index)" v-else></i>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" size="mini" @click="onApplyFilter">应用</el-button>
        <el-button size="mini" @click="onResetFilter">重置</el-button>
      </div>
    </div>
    <!-- <filterExprView :dataTableInfoMap="dataTableInfoMap" v-show="filterType === 'expr'" /> -->
    <!-- pop -->
    <filterDateDialog
      :dialog-visible.sync="dateTimeDialogVisible"
      :selectedFieldItem="selectedFieldItem"
      :selectedFilterData="selectedFilterData"
      @addFilter="addFilter"
      @editFilter="editFilter"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { isStringDict, isNumberDict, isDatetimeDict } from '@/views/tableau-design/utils/field-type'
// import filterExprView from './filter-expr-view.vue'
import filterDateDialog from "./filter-date.vue";

@Component({
  components: {
    // filterExprView,
    filterDateDialog
  }
})
export default class FilterView extends Vue {
  @Prop({
    type: Array,
    default: []
  })
  dataTableColumnList!: any;

  dateTimeDialogVisible = false;
  selectedFieldItem = {};
  selectedFilterData = {};
  isStringDict = isStringDict;
  isNumberDict = isNumberDict;
  isDatetimeDict = isDatetimeDict;
  filterType = 'match';
  fullFilter = 'and';
  filterDataList = [{
    isInputVar: false
  }] as any;
  numberOperatorMap ={
    aa: '=',
    bb: '!=',
    cc: '>',
    dd: '<',
    ee: '>=',
    ff: '<=',
    // gg: '为空',
    // hh: '不为空'
  }
  textOperatorMap = {
    exactMatch: '=',
    // bb: '!=',
    include: '包含',
    startWith: '开头为',
    endWith: '结尾为'
    // dd: '不包含',
    // gg: '为空',
    // hh: '不为空'
  }
  dateOperatorMap = {
    range: '范围',
    aa: '=',
    bb: '!=',
    cc: '>',
    dd: '<',
    ee: '>=',
    ff: '<=',
    gg: '为空',
    hh: '不为空'
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
  onResetFilter(){
    this.filterDataList = [{}]
    this.onApplyFilter()
  }
  onApplyFilter(){
    // console.log(this.filterDataList)
    let filterData = [] as any
    this.filterDataList.forEach((filterItem: any) => {
      filterData.push({
        columnName: filterItem.field,
        condition: filterItem.operator,
        columnValue: filterItem.value,
        connectType: filterItem.connectType
      })
    })
    this.$emit('onFilterData', filterData)
  }
  onChangeFunc(val: string){
    if (val === 'relative') this.dateTimeDialogVisible = true
  }
  onChangeField(item: any, tableList: any){
    let type = ''
    let tableName = ''
    let fieldType = 'text'
    tableList.forEach((table: any) => {
      if(table.name === item.field) type = table.type
      tableName = table.tableName
    })
    if (this.isDatetimeDict.indexOf(type) !== -1) {
      fieldType = 'date'
    } else if (this.isNumberDict.indexOf(type) !== -1) {
      fieldType = 'number'
    }
    item.fieldType = fieldType
    item.tableName = tableName
  }
  addFilter(){}
  editFilter(){}
  addFilterItem(){
    this.save()
    this.filterDataList.push({
      isInputVar: false
    })
  }
  deleteFilterItem(index: number){
    this.filterDataList.splice(index, 1)
  }
  save(){
    // console.log(this.filterDataList)
    let filterList = [] as any
    this.filterDataList.forEach((item: any) => {
      let obj = {
        tableName: item.tableName,
        fieldName: item.field,
        filedType: item.fieldType === 'text' ? 'char' : item.fieldType,
        nullAvailable: item.nullAvailable,
        charConfig: {},
        numberConfig: {},
        dateConfig: {}
      }
      let charConfig = {}
      let numberConfig = {}
      let dateConfig = {}
      if (item.fieldType === 'text') {
        charConfig = {
          wildcard: {
            paramType: 'C',
            paramValue: item.value,
            filterType: 'char',
            nullAvailable: item.nullAvailable
          }
        }
      } else if (item.fieldType === 'number') {
        numberConfig = {
          paramType: 'C',
          paramValue: item.value,
          filterType: 'number',
          nullAvailable: item.nullAvailable
        }
      } else if (item.fieldType === 'date') {
        dateConfig = {
          type: item.func,
          filterType: 'date',
          nullAvailable: item.nullAvailable
        }
      }
      obj.charConfig = charConfig
      obj.numberConfig = numberConfig
      obj.dateConfig = dateConfig
      filterList.push(obj)
    })
    // console.log(filterList)
    // this.onFilterData(filterList)
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
