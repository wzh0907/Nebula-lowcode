<template>
  <el-dialog title width="600px" append-to-body :visible.sync="isShowDialog" @open="dialogOpen">
    <div class="content-wrap">
      <!-- <ul class="handle-wrap">
        <li :class="{'active': selectedType === 'relative'}" @click="selectedType = 'relative'">相对日期</li>
        <li :class="{'active': selectedType === 'range'}" @click="selectedType = 'range'">日期范围</li>
        <li :class="{'active': selectedType === 'min'}" @click="selectedType = 'min'">开始日期</li>
        <li :class="{'active': selectedType === 'max'}" @click="selectedType = 'max'">结束日期</li>
        <li :class="{'active': selectedType === 'special'}" @click="selectedType = 'special'">特殊值</li>
      </ul> -->
      <div
        class="input-wrap"
        :class="{'special': (selectedType === 'special' || selectedType === 'relative')}"
      >
        <p class="input-title">{{ selectedTypeDict[selectedType] }}</p>
        <el-form
          v-show="selectedType !== 'special' && selectedType !== 'relative'"
          size="mini"
          :inline="true"
        >
          <el-form-item>
            <!-- <el-input v-model="minNum" placeholder="请输入内容" :disabled="selectedType === 'max'"></el-input> -->
            <el-date-picker
              v-model="startDate"
              :disabled="selectedType === 'max'"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item style="float: right;">
            <el-date-picker
              v-model="endDate"
              :disabled="selectedType === 'min'"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-form>
        <div class="relative-options" v-show="selectedType === 'relative'">
          <el-checkbox size="mini" v-model="isRelativeAnchor">
            锚点相对于
            <el-date-picker
              type="date"
              size="mini"
              @change="changeDate"
              :disabled="!isRelativeAnchor"
              v-model="relativeAnchorDate"
              style="width: 110px;"
              placeholder="立即"
            />
            <!-- <el-input size="mini" placeholder="立即" disabled style="width: 80px;"></el-input> -->
          </el-checkbox>
        </div>
        <div class="special-options" v-show="selectedType !== 'special'">
          <el-checkbox size="mini" v-model="isNullAvailable">包含Null值</el-checkbox>
        </div>
        <!-- 特殊值 -->
        <el-form v-show="selectedType === 'special'" size="mini">
          <el-form-item>
            <el-radio v-model="specialValue" label="null">空日期</el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="specialValue" label="notNull">非空日期</el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="specialValue" label="all">所有日期</el-radio>
          </el-form-item>
        </el-form>
        <!-- 相对日期 -->
        <div class="relative-wrap" v-show="selectedType === 'relative'">
          <p class="date-range-text">{{ startDate }} 到 {{ endDate }}</p>
          <ul class="handle-wrap">
            <li
              :class="{'active': selectedRelativeDateType === 'year'}"
              @click="selectedRelativeDateType = 'year'; changeDate()"
            >年</li>
            <li
              :class="{'active': selectedRelativeDateType === 'quarter'}"
              @click="selectedRelativeDateType = 'quarter'; changeDate()"
            >季度</li>
            <li
              :class="{'active': selectedRelativeDateType === 'month'}"
              @click="selectedRelativeDateType = 'month'; changeDate()"
            >月</li>
            <li
              :class="{'active': selectedRelativeDateType === 'week'}"
              @click="selectedRelativeDateType = 'week'; changeDate()"
            >周</li>
            <li
              :class="{'active': selectedRelativeDateType === 'day'}"
              @click="selectedRelativeDateType = 'day'; changeDate()"
            >天</li>
            <li
              :class="{'active': selectedRelativeDateType === 'hour'}"
              @click="selectedRelativeDateType = 'hour'; changeDate()"
            >小时</li>
            <li
              :class="{'active': selectedRelativeDateType === 'minute'}"
              @click="selectedRelativeDateType = 'minute'; changeDate()"
            >分钟</li>
          </ul>
          <el-form size="mini" style="width: 50%; float: left; padding-left: 100px;">
            <el-form-item>
              <el-radio
                @change="changeDate"
                v-model="relativeValue"
                label="1"
              >{{ selectedRelativeDateType === 'day' ? '昨天' : `前一${selectedRelativeDateTypeDict[selectedRelativeDateType]}` }}</el-radio>
            </el-form-item>
            <el-form-item>
              <el-radio
                @change="changeDate"
                v-model="relativeValue"
                label="2"
              >{{ selectedRelativeDateType === 'day' ? '今天' : `本${selectedRelativeDateTypeDict[selectedRelativeDateType]}` }}</el-radio>
            </el-form-item>
            <el-form-item>
              <el-radio
                @change="changeDate"
                v-model="relativeValue"
                label="3"
              >{{ selectedRelativeDateType === 'day' ? '明天' : `后一${selectedRelativeDateTypeDict[selectedRelativeDateType]}` }}</el-radio>
            </el-form-item>
          </el-form>
          <el-form size="mini" style="width: 50%; float: left;">
            <el-form-item>
              <el-radio @change="changeDate" v-model="relativeValue" label="4">
                前
                <el-input-number
                  size="mini"
                  v-model="relativeInputNumBefore"
                  controls-position="right"
                  @change="changeDate"
                  :min="1"
                  :max="10"
                ></el-input-number>
                {{ selectedRelativeDateTypeDict[selectedRelativeDateType] }}
              </el-radio>
            </el-form-item>
            <el-form-item>
              <el-radio @change="changeDate" v-model="relativeValue" label="5">
                后
                <el-input-number
                  size="mini"
                  v-model="relativeInputNumAfter"
                  controls-position="right"
                  @change="changeDate"
                  :min="1"
                  :max="10"
                ></el-input-number>
                {{ selectedRelativeDateTypeDict[selectedRelativeDateType] }}
              </el-radio>
            </el-form-item>
            <el-form-item>
              <el-radio
                @change="changeDate"
                v-model="relativeValue"
                label="6"
              >本{{ selectedRelativeDateType === 'day' ? '日' : selectedRelativeDateTypeDict[selectedRelativeDateType] }}迄今</el-radio>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">重 置</el-button>
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
// import stringDialog from "./string.vue";
// import { handleRelativeDate } from "../../../utils/handle-date.js";
// 引入类型
import { tableFieldServiceType } from '@/views/tableau-design/types/service-type'
import { filterConfigItemInterface } from '@/views/tableau-design/types/type'

@Component({
  components: {
    // stringDialog
  }
})
export default class DateFilter extends Vue {
  // name: 'Add',
  // components: {
  //   stringDialog
  // },
  @Prop({
    type: Boolean,
    default: false
  })
  dialogVisible?: Boolean;
  @Prop({
    type: Object,
    default: {}
  })
  selectedFilterData!: filterConfigItemInterface;
  @Prop({
    type: Object,
    default: {}
  })
  selectedFieldItem!: tableFieldServiceType['dataList'][0];
  // @Prop({
  //   type: String,
  //   default: ""
  // })
  // selectedFieldId?: string;

  isNullAvailable = false;
  listLoading = false;
  formLabelWidth = "84px";
  dataForm = {};
  selectedType = "relative";
  selectedTypeDict = {
    relative: "相对日期",
    range: "日期范围",
    min: "开始日期",
    max: "结束日期",
    special: "特殊值"
  };
  selectedRelativeDateTypeDict = {
    year: "年",
    quarter: "季度",
    month: "月",
    week: "周",
    day: "天",
    hour: "小时",
    minute: "分钟"
  };
  relativeDateTimestampMap: any = {
    year: 12 * 30 * 24 * 60 * 60 * 1000,
    quarter: 3 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000
  };
  selectedRelativeDateType = "year";
  specialValue = "";
  relativeValue = "1";
  startDate = "";
  endDate = "";
  relativeInputNumBefore = 1;
  relativeInputNumAfter = 1;
  isRelativeAnchor = false;
  relativeAnchorDate = "";

  get isShowDialog() {
    return this.dialogVisible;
  }
  set isShowDialog(val) {
    this.$emit("update:dialogVisible", val);
  }
  created() {
    this.changeDate();
  }
  mounted() {}
  changeDate() {
    let nowTim = Date.now();
    if (this.relativeAnchorDate) nowTim = Date.parse(this.relativeAnchorDate);
    // let startDate = ''
    // let endDate = ''
    let timTemp = this.relativeDateTimestampMap[this.selectedRelativeDateType];
    let resultTim = 0;
    if (this.relativeValue === "1") {
      resultTim = nowTim - timTemp;
    } else if (this.relativeValue === "2") {
      resultTim = nowTim;
    } else if (this.relativeValue === "3") {
      resultTim = nowTim + timTemp;
    } else if (this.relativeValue === "4") {
      resultTim = nowTim - timTemp * this.relativeInputNumBefore;
    } else if (this.relativeValue === "5") {
      resultTim = nowTim + timTemp * this.relativeInputNumAfter;
    } else if (this.relativeValue === "6") {
      resultTim = nowTim;
    }
    let startDateObj = this.splitDate(nowTim);
    let endDateObj = this.splitDate(resultTim);
    this.startDate = `${startDateObj.year}/${startDateObj.month}/${startDateObj.day}`;
    this.endDate = `${endDateObj.year}/${endDateObj.month}/${endDateObj.day}`;
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
  transformDate(){
    let startDateObj = this.splitDate(this.startDate);
    let endDateObj = this.splitDate(this.endDate);
    this.startDate = `${startDateObj.year}/${startDateObj.month}/${startDateObj.day}`;
    this.endDate = `${endDateObj.year}/${endDateObj.month}/${endDateObj.day}`;
  }
  save() {
    this.isShowDialog = false;
    this.transformDate()
    let dateConfig: any = {
      type: this.selectedType,
      startDate: this.startDate,
      endDate: this.endDate,
      nullAvailable: this.isNullAvailable,
      config: {
        selectedRelativeDateType: this.selectedRelativeDateType,
        relativeValue: this.relativeValue,
        relativeInputNumBefore: this.relativeInputNumBefore,
        relativeInputNumAfter: this.relativeInputNumAfter,
        isRelativeAnchor: this.isRelativeAnchor,
        relativeAnchorDate: this.relativeAnchorDate
      }
    };
    if (this.selectedType === "special")
      dateConfig.specialType = this.specialValue;
    let data = {
      fieldName: this.selectedFieldItem.name,
      tableName: this.selectedFieldItem.tableName,
      filedType: 'date',
      dateConfig
    };
    if (this.isEmptyObject(this.selectedFilterData)) {
      this.$emit("addFilter", data);
    } else {
      this.$emit("editFilter", data);
    }
  }
  isEmptyObject<T>(obj: T): boolean {
    for (let key in obj) {
      return false;
    }
    return true;
  }
  dialogOpen() {
    this.selectedType = "relative";
    this.startDate = "";
    this.endDate = "";
    this.isNullAvailable = false;
    if (typeof this.selectedFilterData !== "object") return false;
    if (this.isEmptyObject(this.selectedFilterData)) return false;

    let dateConfig = this.selectedFilterData.dateConfig || {} as filterConfigItemInterface['dateConfig'];
    if (!dateConfig) return false

    this.selectedType = dateConfig.type;
    this.startDate = dateConfig.startDate;
    this.endDate = dateConfig.endDate;
    this.isNullAvailable = dateConfig.nullAvailable;
    if (this.selectedType === "special") this.specialValue = dateConfig.specialType;
    if (this.selectedType === "relative") {
      let config: any = dateConfig.config;
      this.selectedRelativeDateType = config.selectedRelativeDateType;
      this.relativeValue = config.relativeValue;
      this.relativeInputNumBefore = config.relativeInputNumBefore;
      this.relativeInputNumAfter = config.relativeInputNumAfter;
      this.isRelativeAnchor = config.isRelativeAnchor;
      this.relativeAnchorDate = config.relativeAnchorDate;
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}
/deep/.el-radio__label,
/deep/.el-checkbox__label {
  font-size: 12px;
}
.handle-wrap {
  display: flex;
  padding: 15px;
  padding-right: 0;
  font-size: 12px;
  li {
    flex: 1;
    margin-right: 15px;
    height: 65px;
    line-height: 65px;
    text-align: center;
    background-color: #e0dede;
    border: 1px solid #000;
    cursor: pointer;
    &.active {
      background-color: #a0cfff;
    }
  }
}
.input-wrap {
  position: relative;
  height: 240px;
  padding: 15px;
  padding-top: 75px;
  padding-right: 5px;
  border: 1px solid #e0dede;
  &.special {
    padding-top: 15px;
  }
  .input-title {
    position: absolute;
    top: -8px;
    // left: 0;
    padding: 0 5px;
    background-color: #fff;
    font-size: 12px;
  }
  .relative-options {
    position: absolute;
    bottom: 10px;
    left: 10px;
    /deep/.el-input__prefix {
      display: none;
    }
    /deep/.el-input--prefix .el-input__inner {
      padding-left: 15px;
      padding-right: 15px;
    }
  }
  .special-options {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
.relative-wrap {
  padding-top: 20px;
  .date-range-text {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
  }
  .handle-wrap {
    li {
      height: 25px;
      line-height: 25px;
    }
  }
  /deep/.el-form-item {
    margin-bottom: 6px;
  }
}
</style>
